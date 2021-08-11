const { number } = require("@hapi/joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schoolSchema = new Schema({

    schoolName: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    emailId: {
        type: String,
        required: true
    },

    state: {
        type: String,
        required: true
    },

    teacherName: {
        type: String,
        required: true
    },

    phoneNumber: {
        type: Number,
        required: true
    },

    greenAmbassadorDetails: {
        type: Array,
        required: true
    },

    status: {
        type: Boolean,
        default: false
    },

    active: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('school', schoolSchema)