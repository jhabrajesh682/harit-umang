const admin = require('../models/admin.model');
const validate = require('../validators/admin.validator')
const jwt = require('../helper/jwt')
const bcrypt = require("bcrypt");


class admins {

    async createAdmin(req, res) {

        let { error } = validate.validateAdmin(req.body);
        if (error) {
            return res.status(400).send({
                status: false,
                message: 'failed',
                error: error
            })
        }
        try {
            let isEmailExist = await admin.findOne({ emailId: req.body.emailId }).lean()
            if (isEmailExist) {
                return res.status(400).send({
                    status: false,
                    message: 'Email Id already exist'
                })
            }

            let createAdmins = new admin({
                ...req.body
            })

            const salt = await bcrypt.genSalt(10);
            createAdmins.password = await bcrypt.hash(createAdmins.password, salt);
            await createAdmins.save()

            return res.status(200).send({
                status: true,
                message: 'You have successfully registered'
            })
        } catch (error) {
            return res.status(400).send({
                status: false,
                error: error
            })
        }


    }

    async adminLogin(req, res) {

        let { error } = validate.validateAdminLogin(req.body)
        if (error) {
            return res.status(400).send({
                status: false,
                message: 'failed',
                error: error
            })
        }

        let checkUser = await admin.findOne({ emailId: req.body.emailId }).lean()
        if (!checkUser) {
            return res.status(404).send({
                status: false,
                message: 'user not found'
            })
        }
        let validatePassword = await bcrypt.compare(req.body.password, checkUser.password)

        if (!validatePassword) {
            return res.status(400).send({
                status: false,
                message: 'Please Enter correct password'
            })
        }

        let jwtToken = jwt.jwttokenAdmin(checkUser._id, true)

        return res.status(200).send({
            status: true,
            message: 'you have successfully logged in',
            token: jwtToken
        })
    }
}


module.exports = admins