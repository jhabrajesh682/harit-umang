const studentSchema = require("../models/student.model");
const validate = require('../validators/student.validator')
const bcrypt = require("bcrypt");
const { valid } = require("@hapi/joi");
var crypto = require('crypto');
const key = process.env.secretKey;
const otpGenerator = require("otp-generator");
const mail = require('../helper/emailService')
const jwt = require('../helper/jwt')
const schools = require('../models/school.model')


async function verifyHashAndOTP(hash, email, otp) {

    let [hashValue, expires] = hash.split(".");
    let now = Date.now();
    if (now > parseInt(expires)) {
        return ({
            otpWrong: true,
            status: false
        })
    }

    let data = `${email}.${otp}.${expires}`;
    let newCalculatedHash = crypto.createHmac("sha256", key).update(data).digest("hex");

    if (newCalculatedHash === hashValue) {
        return true
    }
    if (newCalculatedHash != hashValue) {
        console.log("into wrong");
        return ({
            otpWrong: false,
            status: false
        })
    }
}
class student {

    async generateOTPAndHashForRegister(req, res) {


        let { error } = validate.validateStudentSendOTP(req.body)

        if (error) {
            return res.status(400).send({
                status: false,
                message: 'failed',
                error: error
            })
        }

        let regexError = validate.validateStudentWithRegex(req.body)
        if (regexError) {
            return res.status(400).send({
                message: 'special character are not allowed',
                error: regexError
            })
        }

        //to check user is already exist or not

        let isUserExist = await studentSchema.findOne({ emailId: req.body.emailId }).lean()

        if (isUserExist) {
            return res.status(400).send({
                status: false,
                message: 'user already exist'
            })
        }

        let isValidSchoolId = await schools.findById(req.body.schoolName).lean()
        if (!isValidSchoolId) {
            return res.status(404).send({
                status: false,
                message: 'pls enter valid school Id'
            })
        }

        const otp = otpGenerator.generate(6, { alphabets: false, upperCase: false, specialChars: false });

        await mail.sendMail(req.body.emailId, req.body.studentName, otp)

        const ttl = 5 * 60 * 1000; //5 Minutes in miliseconds
        const expires = Date.now() + ttl; //timestamp to 5 minutes in the future
        const data = `${req.body.emailId}.${otp}.${expires}`; // data to encrypt
        const hash = crypto.createHmac("sha256", key).update(data).digest("hex");

        const fullHash = `${hash}.${expires}`; //this data send to users

        return res.status(200).send({
            status: true,
            hash: fullHash
        })
    }

    async createStudentRegister(req, res) {

        let { error } = validate.validateStudent(req.body);

        if (error) {
            return res.status(400).send({
                status: false,
                message: 'failed',
                error: error
            })
        }
        let regexError = validate.validateStudentWithRegex(req.body)
        if (regexError) {
            return res.status(400).send({
                message: 'special character are not allowed',
                error: regexError
            })
        }

        //verify OTP

        let otpResponse = await verifyHashAndOTP(req.body.hash, req.body.emailId, req.body.otp)

        if (otpResponse.otpWrong === false) {
            return res.status(400).send({
                status: false,
                message: 'your OTP is Wrong'
            })
        }
        if (otpResponse.otpWrong === true) {
            return res.status(400).send({
                status: false,
                message: 'your OTP is expired'
            })
        }

        let isUserExist = await studentSchema.findOne({ emailId: req.body.emailId }).lean()

        if (isUserExist) {
            return res.status(400).send({
                status: false,
                message: 'user already exist'
            })
        }
        let students = new studentSchema({
            ...req.body
        })

        const salt = await bcrypt.genSalt(10);

        students.password = await bcrypt.hash(students.password, salt);

        await students.save();

        return res.status(200).send({
            status: true,
            message: 'You have successfully registered'
        })
    }

    async studentLogin(req, res) {

        let { error } = validate.validateStudentLogin(req.body)
        if (error) {
            return res.status(400).send({
                status: false,
                message: 'failed',
                error: error
            })
        }
        let now = new Date()

        let userDetails = await studentSchema.findOne({ emailId: req.body.emailId }).lean()

        if (!userDetails) {
            return res.status(404).send({
                status: false,
                message: 'user not found'
            })
        }
        let accountBlockTime = now.getTime() - userDetails.loginTime
        console.log(accountBlockTime);
        if (accountBlockTime < process.env.loginBlockTime && userDetails.accountActiveStatus === false) {
            return res.status(400).send({
                status: false,
                message: 'your account is blocked for 1hr pls try after sometime'
            })
        }

        let validatePassword = await bcrypt.compare(req.body.password, userDetails.password)
        if (!validatePassword) {

            let finalTimeDiff = now.getTime() - userDetails.loginTime;

            if (finalTimeDiff < process.env.studentLoginTimeCount && userDetails.count < 3) {

                await studentSchema.updateOne({ _id: userDetails._id }, {
                    $inc: { count: 1 }, accountActiveStatus: true
                })
            }

            else if (finalTimeDiff < process.env.studentLoginTimeCount && userDetails.count == 3) {

                await studentSchema.updateOne({ _id: userDetails._id }, {
                    count: 0, accountActiveStatus: false,
                    loginTime: now.getTime()
                })
            }
            else if (finalTimeDiff > process.env.studentLoginTimeCount && userDetails.count == 0) {

                await studentSchema.updateOne({ _id: userDetails._id }, {
                    count: 1,
                    accountActiveStatus: true,
                    loginTime: now.getTime()
                })
            }


            return res.status(400).send({
                message: "pls enter correct password",
                status: false,
                Email: req.body.Email
            })
        }

        await studentSchema.updateOne({ _id: userDetails._id }, {
            loginTime: now.getTime(),
            count: 0, accountActiveStatus: true
        })

        let token = jwt.jwttoken(userDetails._id)

        return res.status(200).send({
            status: true,
            message: 'you have successfully logged in',
            student: userDetails,
            token: token
        })
    }

    async generateHashAndOTPForForgotPassword(req, res) {

        let { error } = validate.validateStudentForGotPass(req.body)
        if (error) {
            return res.status(400).send({
                status: false,
                message: 'failed',
                error: error
            })
        }

        let isValidStudent = await studentSchema.findOne({ emailId: req.body.emailId }).lean()

        if (!isValidStudent) {
            return res.status(404).send({
                status: false,
                message: 'Pls Enter valid Email Id'
            })
        }

        const otp = otpGenerator.generate(6, { alphabets: false, upperCase: false, specialChars: false });

        await mail.sendForgotPassMail(req.body.emailId, isValidStudent.studentName, otp)

        const ttl = 5 * 60 * 1000;
        const expires = Date.now() + ttl;
        const data = `${req.body.emailId}.${otp}.${expires}`;
        const hash = crypto.createHmac("sha256", key).update(data).digest("hex");

        const fullHash = `${hash}.${expires}`;

        return res.status(200).send({
            status: true,
            hash: fullHash
        })

    }

    async verifyOTPAndChangePassword(req, res) {

        let { error } = validate.verifyStudentForgotPasswordOTP(req.body)

        if (error) {
            return res.status(400).send({
                status: false,
                message: 'failed',
                error: error
            })
        }

        let otpResponse = await verifyHashAndOTP(req.body.hash, req.body.emailId, req.body.otp)

        if (otpResponse.otpWrong === false) {
            return res.status(400).send({
                status: false,
                message: 'your OTP is Wrong'
            })
        }
        if (otpResponse.otpWrong === true) {
            return res.status(400).send({
                status: false,
                message: 'your OTP is expired'
            })
        }

        let studentInfo = await studentSchema.findOne({ emailId: req.body.emailId }).lean()

        if (!studentInfo) {
            return res.status(404).send({
                status: false,
                message: 'student not found'
            })
        }


        const salt = await bcrypt.genSalt(10);
        let newPassword = await bcrypt.hash(req.body.password, salt);

        await studentSchema.updateOne({
            _id: studentInfo._id
        }, {
            password: newPassword
        })

        return res.status(200).send({
            status: true,
            message: 'Password successfully changed'
        })
    }
}


module.exports = student