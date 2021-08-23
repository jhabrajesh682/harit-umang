const joi = require("@hapi/joi");

function validateAdmin(admin) {

    let schema = joi.object({
        name: joi.string().required(),
        emailId: joi.string().email().required(),
        password: joi.string().min(8).max(25).required()
    })

    let result = schema.validate(admin)
    return result
}

function validateAdminLogin(admin) {

    let schema = joi.object({
        emailId: joi.string().email().required(),
        password: joi.string().required()
    })

    let result = schema.validate(admin)
    return result
}

module.exports.validateAdmin = validateAdmin
module.exports.validateAdminLogin = validateAdminLogin