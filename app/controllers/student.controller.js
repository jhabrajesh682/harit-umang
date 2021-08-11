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
        return false
    }

    let data = `${email}.${otp}.${expires}`;
    let newCalculatedHash = crypto.createHmac("sha256", key).update(data).digest("hex");

    if (newCalculatedHash === hashValue) {
        return true
    }
    if (newCalculatedHash != hashValue) {
        console.log("into wrong");
        return false
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
        if (isValidSchoolId) {
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

        if (!otpResponse) {
            return res.status(400).send({
                status: false,
                message: 'your OTP is Wrong'
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

        //create jwt token and send

        let token = jwt.jwttoken(students._id)


        return res.status(200).send({
            status: true,
            message: 'student successfully registered',
            token: token
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

        let userDetails = await studentSchema.findOne({ emailId: req.body.emailId }).lean()
        console.log(userDetails);
        if (!userDetails) {
            return res.status(404).send({
                status: false,
                message: 'user not found'
            })
        }

        let validatePassword = await bcrypt.compare(req.body.password, userDetails.password)
        if (!validatePassword) {
            res.status(400).send({
                message: "pls enter correct password",
                status: false,
                Email: req.body.Email
            })
        }

        let token = jwt.jwttoken(userDetails._id)

        return res.status(200).send({
            status: true,
            message: 'you have successfully logged in',
            student: userDetails,
            token: token
        })
    }
}


module.exports = student