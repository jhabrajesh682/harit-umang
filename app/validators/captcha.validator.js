const Joi = require('@hapi/joi');

function validateCaptcha(captcha) {
    let schema = Joi.object({
        token: Joi.string().required(),
    })

    let result = schema.validate(captcha)
    return result
}



module.exports.validateCaptcha = validateCaptcha
