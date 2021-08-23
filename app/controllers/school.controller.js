const schools = require('../models/school.model');
const validator = require('../validators/school.validator');
const requestCount = require('../helper/userCallRequest')

class school {

    async createSchool(req, res) {

        let { error } = validator.validateSchools(req.body)
        if (error) {
            return res.status(400).send({
                status: false,
                message: 'failed',
                error: error
            })
        }

        let specialCharacter = validator.validateSchoolWithRegex(req.body)

        if (specialCharacter) {
            return res.status(400).send({
                message: 'Special characters not allowed',
                error: specialCharacter

            })
        }
        let date = new Date()

        await requestCount.saveUserRequest(req.body.emailId, 'createSchool', date.getTime())
        let checkRequestCount = await requestCount.checkUserRequestCount(req.body.emailId, 'createSchool')
        if (!checkRequestCount) {
            return res.status(400).send({
                status: false,
                message: 'Too many request sent Pls wait for 2 minutes and then try again.'
            })
        }
        try {

            let amabassdorLength = req.body.greenAmbassadorDetails.length
            if (amabassdorLength > 5) {
                return res.status(400).send({
                    status: false,
                    message: 'No. of geen ambassadors should be equal to 5'
                })
            }

            let schoolDetails = new schools({
                ...req.body
            })

            await schoolDetails.save()

            return res.status(200).send({
                status: true,
                message: 'school details successfully submitted'
            })

        } catch (error) {
            console.log(error);
            res.send(error)
        }

    }

    async getAllSchools(req, res) {

        let schoolList = await schools.find({}).sort({ _id: -1 }).lean()

        return res.status(200).send({
            status: true,
            result: schoolList
        })
    }


    async schoolApprovedByAdmin(req, res) {

        let { error } = validator.adminApprovesSchool(req.body)
        if (error) {
            return res.status(200).send({
                status: false,
                message: 'failed',
                error: error
            })
        }

        try {

            let isSchoolExist = await schools.findById(req.body.schoolId).lean()
            if (!isSchoolExist) {
                return res.status(404).send({
                    status: false,
                    message: 'school not found pls enter valid school id'
                })
            }

            await schools.updateOne({
                _id: req.body.schoolId
            }, { status: req.body.status })

        } catch (error) {
            console.log(error);
            res.send(error)
        }

        return res.status(200).send({
            status: true,
            message: 'school successfully approved'
        })

    }


    async getAllApprovedSchools(req, res) {


        let school = await schools.find({ status: true, active: true }).sort({ _id: -1 }).lean();

        return res.status(200).send({
            status: true,
            result: school
        })
    }

    async DeactivateSchools(req, res) {

        let { error } = validator.deactivateSchoolsValidate(req.body);
        if (error) {
            return res.status(400).send({
                status: false,
                message: 'failed',
                error: error
            })
        }

        let isValidSchool = await schools.findById(req.body.schoolId).lean();

        if (!isValidSchool) {
            return res.status(200).send({
                status: false,
                message: 'school not found pls enter valid school id'
            })
        }

        await schools.updateOne({ _id: req.body.schoolId }, {
            active: req.body.active
        })

        return res.status(200).send({
            status: true,
            message: 'school successfully deactivated'
        })
    }

    async getOneSchoolById(req, res) {

        let { error } = validator.validateSchoolId(req.body)
        if (error) {
            return res.status(400).send({
                status: false,
                error: error
            })
        }
        let schoolDetails = await schools.findById(req.body.schoolId).lean()

        if (!schoolDetails) {
            return res.status(404).send({
                status: false,
                message: 'school Not found'
            })
        }

        return res.status(200).send({
            status: true,
            result: schoolDetails
        })
    }

}

module.exports = school