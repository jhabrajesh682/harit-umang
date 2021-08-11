const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const project = new Schema({

    pptFile: {
        type: String,
        required: true
    },

    amountofEWasteInNum: {
        type: Number,
        required: true
    },

    amountOfEWasteInWords: {
        type: String,
        required: true
    },
    publicWasteInNum: {
        type: Number,
        required: true
    },
    publicWasteInWords: {
        type: String,
        required: true
    },

    energySavedInNum: {
        type: Number,
        required: true
    },

    energySavedInWords: {
        type: String,
        required: true
    },

    treePlantedInNum: {
        type: Number,
        required: true
    },

    treePlantedInWords: {
        type: String,
        required: true
    },

    student: {
        type: String,
        ref: "student"
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('project', project)