const router = require("express").Router();
const project = require('../controllers/project.controller')
const auth = require('../middlewares/auth')
const projects = new project()


router.post('/submitProjects', [auth], projects.submitProject)

router.post('/getAllProjects', [auth], projects.getAllProject)

module.exports = router