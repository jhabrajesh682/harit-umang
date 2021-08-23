const joi = require("@hapi/joi");


function submitProject(project) {
    let schema = joi.object({

        pptFile: joi.allow(),
        amountofEWasteInNum: joi.number().required(),
        amountOfEWasteInWords: joi.string().required(),
        publicWasteInNum: joi.number().required(),
        publicWasteInWords: joi.string().required(),
        energySavedInNum: joi.number().required(),
        energySavedInWords: joi.string().required(),
        treePlantedInNum: joi.number().required(),
        treePlantedInWords: joi.string().required(),
        student: joi.string()

    })

    let result = schema.validate(project)
    return result
}

function validateProjectRegex(project) {

    const format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    let amountOfEWasteInWords = format.test(project.amountOfEWasteInWords)
    let publicWasteInWords = format.test(project.publicWasteInWords)
    let energySavedInWords = format.test(project.energySavedInWords)
    let treePlantedInWords = format.test(project.treePlantedInWords)

    if (amountOfEWasteInWords) {
        return ({
            amountOfEWasteInWords: project.amountOfEWasteInWords,
            status: false
        })
    }
    else if (publicWasteInWords) {
        return ({
            publicWasteInWords: project.publicWasteInWords,
            status: false
        })
    }

    else if (energySavedInWords) {
        return ({
            energySavedInWords: project.energySavedInWords,
            status: false
        })
    }
    else if (treePlantedInWords) {
        return ({
            treePlantedInWords: project.treePlantedInWords,
            status: false
        })
    }
}

function validateProjectId(project) {
    let schema = joi.object({
        projectId: joi.string().required()
    })

    let result = schema.validate(project)
    return result
}

module.exports.submitProject = submitProject
module.exports.validateProjectId = validateProjectId
module.exports.validateProjectRegex = validateProjectRegex