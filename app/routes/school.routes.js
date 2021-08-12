const router = require("express").Router();
const school = require('../controllers/school.controller')
const auth = require('../middlewares/auth')
const schools = new school()

router.post('/registerSchool', schools.createSchool)

router.get('/getAllSchools', schools.getAllSchools);

router.post('/schoolApprove', schools.schoolApprovedByAdmin)

router.get('/getAllActiveSchools', schools.getAllApprovedSchools)

router.post('/deactivateSchool', schools.DeactivateSchools)

module.exports = router