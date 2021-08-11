const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");

const studentSchema = new Schema({

    studentName: {
        type: String,
        required: true
    },

    class: {
        type: String,
        required: true
    },

    emailId: {
        type: String,
        required: true,
        unique: true
    },

    schoolName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

// studentSchema.methods.getSignedJwtToken = function () {
//     return jwt.sign({ id: this._id, Email: this.Email }, process.env.JWT_SECRET_KEY, {
//         expiresIn: process.env.JWT_EXPIRY_TIME
//     })
// }

module.exports = mongoose.model('student', studentSchema)