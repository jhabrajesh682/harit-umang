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

module.exports.submitProject = submitProject