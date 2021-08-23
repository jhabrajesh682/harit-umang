const router = require("express").Router();
const captcha = require('../controllers/captcha.controller')

const Captchas = new captcha();


router.post('/verify', Captchas.verifyCaptcha);


module.exports = router