import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    coverLetter: {
      type: String,
    },

    resume: {
      type: String, // URL of uploaded resume
      required: true,
    },

    status: {
      type: String,
      enum: ["applied", "shortlisted", "rejected", "interview"],
      default: "applied",
    },
  },
  { timestamps: true }
);

export const Application = mongoose.model("Application", applicationSchema);