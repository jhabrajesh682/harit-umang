const joi = require("@hapi/joi");

function validateStudent(student) {

    let schema = joi.object({
        studentName: joi.string().required(),
        class: joi.string().required(),
        emailId: joi.string().email().required(),
        schoolName: joi.string().required(),
        hash: joi.string().required(),
        otp: joi.string().required(),
        password: joi.string().min(8).max(25).required()
    })

    let result = schema.validate(student)
    return result
}

function validateStudentSendOTP(student) {

    let schema = joi.object({
        studentName: joi.string().required(),
        class: joi.string().required(),
        emailId: joi.string().email().required(),
        schoolName: joi.string().required(),
        password: joi.string().min(8).max(25).required()
    })

    let result = schema.validate(student)
    return result
}


function validateStudentLogin(student) {
    let schema = joi.object({
        emailId: joi.string().email().required(),
        password: joi.string().required()
    })

    let result = schema.validate(student)
    return result
}

function validateStudentWithRegex(student) {
    console.log(student);
    const format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    let studentName = format.test(student.studentName)
    let className = format.test(student.class)
    let schoolName = format.test(student.schoolName)

    if (schoolName) {
        return ({
            schoolName: student.schoolName,
            status: false
        })
    }
    else if (studentName) {
        return ({
            studentName: student.studentName,
            status: false
        })
    }
    else if (className) {
        return ({
            className: student.className,
            status: false
        })
    }
}


module.exports.validateStudent = validateStudent
module.exports.validateStudentSendOTP = validateStudentSendOTP
module.exports.validateStudentLogin = validateStudentLogin
module.exports.validateStudentWithRegex = validateStudentWithRegex