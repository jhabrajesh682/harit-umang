const projects = require('../models/project.model')
const validator = require('../validators/project.validator')
const requestCount = require('../helper/userCallRequest')
const students = require('../models/student.model')
const fs = require('fs');
const path = require('path');
const school = require('../models/school.model')
const jwt = require('jsonwebtoken')
const jwtPrivateKey = process.env.accessTokenSecret

async function verifyToken(token) {
    const decode = jwt.verify(token, jwtPrivateKey)
    let decodedData = decode
    console.log("decodedData==========>", decodedData);
    if (decodedData.isAdmin == false) {
        return false
    }

    else {
        return true
    }

}


class project {


    async submitProject(req, res) {

        let { error } = validator.submitProject(req.body)

        if (error) {
            return res.status(400).send({
                status: false,
                message: 'failed',
                error: error
            })
        }

        let regexError = validator.validateProjectRegex(req.body)

        if (regexError) {
            return res.status(400).send({
                message: 'special characters are not allowed',
                error: regexError
            })
        }

        try {

            let isValidStudent = await students.findById(req.body.student).lean()
            if (!isValidStudent) {
                return res.status(404).send({
                    status: false,
                    message: 'student not found pls enter valid student Id'
                })
            }

            const extfile = req.files.pptFile.name
            let allExtName = extfile.split('.').slice(1).join('.')

            if (allExtName == 'pptx' || allExtName == 'ppt') {

                let pptFiles = req.files.pptFile;
                let date = new Date();
                let timestamp = date.getTime();

                let finalPPT = timestamp + '.ppt';
                let time = 'pptFiless/' + timestamp + '.ppt';
                pptFiles.mv(time)


                let newProject = new projects({
                    pptFile: finalPPT,
                    amountofEWasteInNum: req.body.amountofEWasteInNum,
                    amountOfEWasteInWords: req.body.amountOfEWasteInWords,
                    publicWasteInNum: req.body.publicWasteInNum,
                    publicWasteInWords: req.body.publicWasteInWords,
                    energySavedInNum: req.body.energySavedInNum,
                    energySavedInWords: req.body.energySavedInWords,
                    treePlantedInNum: req.body.treePlantedInNum,
                    treePlantedInWords: req.body.treePlantedInWords,
                    student: req.body.student
                })

                await newProject.save()
                let dateTime = new Date();

                await requestCount.saveUserRequest(isValidStudent.emailId, 'submitProject', dateTime.getTime())
                let checkRequestCount = await requestCount.checkUserRequestCount(isValidStudent.emailId, 'submitProject')
                if (!checkRequestCount) {
                    return res.status(400).send({
                        status: false,
                        message: 'too many request sent Pls wait for 2 minutes and then try again.'
                    })
                }

                return res.status(200).send({
                    status: true,
                    message: 'project successfully saved'
                })
            }

            else {
                return res.status(400).send({
                    status: false,
                    message: 'Pls upload .ppt and .pptx file'
                })
            }
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }


    async getAllProject(req, res) {

        let project = await projects.find({})
            .populate('student', '-createdAt -updatedAt')
            .sort({ _id: -1 })
            .lean()

        return res.status(200).send({
            status: true,
            result: project
        })
    }


    async getPPTFile(req, res) {

        let projectDetails = await projects.findById(req.params.id).lean();
        if (!req.params.token) {
            return res.status(400).send({
                status: false,
                message: 'Please provide the token'
            })
        }


        if (!projectDetails || !req.params.id) {
            return res.status(404).send({
                status: false,
                message: 'Project Not found'
            })
        }
        let isAuth = await verifyToken(req.params.token)
        if (!isAuth) {
            return res.status(404).send({
                status: false,
                message: 'Please provide admin token'
            })
        }

        fs.readdir(path.join(__dirname, '../../pptFiless'), function (err, files) {
            if (err) {
                console.log(err);
                return;
            }
            let findFile = projectDetails.pptFile
            for (const iterator of files) {
                if (iterator == findFile) {
                    console.log(iterator);
                    res.download(path.join(process.env.pptPath.toString(), iterator))
                }
            }
        });
    }

    async getProjectBySchoolId(req, res) {

        let isSchoolExist = await school.findById(req.body.schoolId).select('schoolName').lean();

        if (!isSchoolExist || !req.body.schoolId) {
            return res.status(404).send({

                status: false,
                message: 'school Id not found'
            })
        }
        let finalArray = []
        let schoolStudent = await students.find({ schoolName: req.body.schoolId }).lean()

        for (const iterator of schoolStudent) {

            let projectData = await projects.find({ student: iterator._id })
                .populate('student', '-password')
                .sort({ _id: -1 })
                .lean()

            for (const x of projectData) {
                finalArray.push({
                    project: x,
                    schoolData: isSchoolExist
                })
            }
        }

        return res.status(200).send({
            status: true,
            result: finalArray
        })
    }

    async getOneProjectById(req, res) {

        let { error } = validator.validateProjectId(req.body)
        if (error) {
            return res.status(400).send({
                status: false,
                error: error
            })
        }

        let projectDetails = await projects.findById(req.body.projectId).lean()

        return res.status(200).send({
            status: true,
            result: projectDetails
        })
    }
}

module.exports = project