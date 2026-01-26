const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    interviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },

    round: {
        type: String,
        enum: ["TECHNICAL", "MANAGERIAL", "HR"],
        required: true
    },

    scheduledAt: Date,
    meetingLink: String,

    status: {
        type: String,
        enum: ["SCHEDULED", "COMPLETED", "NO_SHOW"],
        default: "SCHEDULED"
    }
}, { timestamps: true });

module.exports = mongoose.model("Interview", interviewSchema);
