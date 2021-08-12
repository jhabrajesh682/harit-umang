const mongoose = require("mongoose");
const Schema = mongoose.Schema;


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
        ref: 'school',
        required: true
    },
    password: {
        type: String,
        required: true
    },
    count: {
        type: Number
    },
    loginTime: {
        type: Number
    },
    accountActiveStatus: {
        type: Boolean,
        default: true

    }
}, {
    timestamps: true
})



module.exports = mongoose.model('student', studentSchema)