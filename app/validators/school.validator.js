const joi = require("@hapi/joi");

function validateSchools(school) {

    let schema = joi.object({
        schoolName: joi.string().required(),
        address: joi.string().required(),
        emailId: joi.string().required(),
        state: joi.string().required(),
        teacherName: joi.string().required(),
        phoneNumber: joi.number().required(),
        greenAmbassadorDetails: joi.array().required()
    })

    let result = schema.validate(school)
    return result
}

function adminApprovesSchool(school) {
    let schema = joi.object({
        schoolId: joi.string().required(),
        status: joi.boolean().required()
    })

    let result = schema.validate(school)
    return result
}



module.exports.adminApprovesSchool = adminApprovesSchool
module.exports.validateSchools = validateSchools