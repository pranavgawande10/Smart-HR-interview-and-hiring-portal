import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
    required: true
  },

  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  interviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },

  round: {
    type: String,
    required: true
  },

  roundNumber: {
    type: Number,
    required: true
  },

  // 🔥 FINAL ROUND FLAG
  isFinalRound: {
    type: Boolean,
    default: false
  },

  status: {
    type: String,
    enum: ["PENDING", "ASSIGNED", "SCHEDULED", "COMPLETED", "CANCELLED"],
    default: "PENDING"
  },

  scheduledAt: Date,
  mode: String,
  meetingLink: String,
  location: String,

  candidateResponse: {
    type: String,
    enum: ["PENDING", "ACCEPTED", "REJECTED", "REQUEST_RESCHEDULE"],
    default: "PENDING"
  },

  rescheduleReason: String,

  feedback: String,
  result: {
    type: String,
    enum: ["PASS", "FAIL"]
  }

}, { timestamps: true });

export default mongoose.model("Interview", interviewSchema);