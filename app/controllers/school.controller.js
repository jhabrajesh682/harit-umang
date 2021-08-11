const schools = require('../models/school.model');
const validator = require('../validators/school.validator');


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

    }

}

module.exports = school