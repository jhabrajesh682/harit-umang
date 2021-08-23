const router = require("express").Router();
const school = require('../controllers/school.controller')
const admin = require('../middlewares/admin')

const schools = new school()

router.post('/registerSchool', schools.createSchool)

router.get('/getAllSchools', [admin], schools.getAllSchools);

router.post('/schoolApprove', [admin], schools.schoolApprovedByAdmin)

router.get('/getAllActiveSchools', schools.getAllApprovedSchools)

router.post('/deactivateSchool', [admin], schools.DeactivateSchools)

router.post('/getOneSchoolById', [admin], schools.getOneSchoolById)

module.exports = router