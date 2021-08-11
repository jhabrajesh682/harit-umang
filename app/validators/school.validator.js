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

function deactivateSchoolsValidate(school) {
    let schema = joi.object({
        schoolId: joi.string().required(),
        active: joi.boolean().required()
    })

    let result = schema.validate(school)
    return result
}


function validateSchoolWithRegex(school) {

    const format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    let schoolName = format.test(school.schoolName)
    let address = format.test(school.address)
    let state = format.test(school.state)
    let teacherName = format.test(school.teacherName)
    if (schoolName) {
        return ({
            schoolName: school.schoolName,
            status: false
        })
    }
    else if (address) {
        return ({
            address: school.address,
            status: false
        })
    }
    else if (state) {
        return ({
            state: school.state,
            status: false
        })
    }
    else if (teacherName) {
        return ({
            teacherName: school.teacherName,
            status: false
        })
    }
}

module.exports.deactivateSchoolsValidate = deactivateSchoolsValidate
module.exports.adminApprovesSchool = adminApprovesSchool
module.exports.validateSchools = validateSchools
module.exports.validateSchoolWithRegex = validateSchoolWithRegex