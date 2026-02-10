const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    interviewId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Interview",
        required: true
    },

    interviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    technicalScore: Number,
    communication: Number,
    problemSolving: Number,

    recommendation: {
        type: String,
        enum: ["HIRE", "HOLD", "REJECT"]
    },

    comments: String
}, { timestamps: true });

module.exports = mongoose.model("InterviewFeedback", feedbackSchema);
