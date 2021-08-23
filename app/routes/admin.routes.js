const router = require("express").Router();
const admin = require('../controllers/admin.controller')

const admins = new admin();

router.post('/createAdmin', admins.createAdmin)

router.post('/logInAdmin', admins.adminLogin);


module.exports = router;