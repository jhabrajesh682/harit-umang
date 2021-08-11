const nodemailer = require("nodemailer");
require('dotenv').config()
let transporter = nodemailer.createTransport({
    host: "send.one.com",
    secure: true,
    port: 465,
    auth: {
        user: process.env.email,
        pass: process.env.password
    }
});


async function sendMail(email, name, otp) {
    let message = `Hi ${name} <br>
            <br>
            Your OTP To Register in Panasonic Harit Umang is : ${otp}  <br>
            <br>
            Note: OTP is valid for only 5mins <br>
            Thanks & Regards <br>
           Panasonic Harit Umang Team
                     `
    let info = await transporter.sendMail({
        from: '"Panasonic Harit Umang" <brajesh.jha@studiokrew.com>',
        to: email,
        subject: "OTP to Register in Panasonic Harit Umang",
        text: "New Mail",
        html: `${message}`
    });
    console.log('mail sent');
    return true
}

module.exports.sendMail = sendMail