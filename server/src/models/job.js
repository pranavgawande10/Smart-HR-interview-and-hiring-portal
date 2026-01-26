const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    vacancies: {
        type: Number,
        required: true,
        min: 1
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",   
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);
