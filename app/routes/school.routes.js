const router = require("express").Router();
const school = require('../controllers/school.controller')
const auth = require('../middlewares/auth')
const schools = new school()

router.post('/registerSchool', schools.createSchool)

router.get('/getAllSchools', [auth], schools.getAllSchools);

router.post('/schoolApprove', [auth], schools.schoolApprovedByAdmin)

router.get('/getAllActiveSchools', schools.getAllApprovedSchools)

module.exports = router