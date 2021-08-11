const router = require("express").Router();
const student = require("../controllers/student.controller");
const students = new student();

router.post('/studentRegisterSendOTP', students.generateOTPAndHashForRegister);


router.post('/studentRegister', students.createStudentRegister);

router.post('/studentLogin', students.studentLogin)



module.exports = router