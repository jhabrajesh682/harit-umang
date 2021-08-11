const projects = require('../models/project.model')
const validator = require('../validators/project.validator')
const path = require('path')

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

        try {


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
}

module.exports = project