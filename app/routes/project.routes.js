const router = require("express").Router();
const project = require('../controllers/project.controller')

const admin = require('../middlewares/admin')
const projects = new project()


router.post('/submitProjects', projects.submitProject)

router.post('/getAllProjects', [admin], projects.getAllProject)

router.get('/PPTDownload/:id/:token', projects.getPPTFile)

router.post('/getAllProjectBySchoolId', [admin], projects.getProjectBySchoolId)

router.post('/getOneProjectById', [admin], projects.getOneProjectById)

module.exports = router