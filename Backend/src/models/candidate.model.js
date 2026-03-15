import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Candidate name is required"],
      trim: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Candidate email is required"],
      trim: true,
      unique: true,
      lowercase: true,
    },
    skills: {
      type: [String],
      required: [true, "Candidate skills are required"],
    },
    appliedJobId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    applicationStatus: {
      type: String,
      enum: ["applied", "in review", "interviewed", "hired", "rejected"],
      default: "applied",
    },
    resumeUrl: {
      type: String,
    },

    profilePictureUrl: {
      type: String,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      trim: true,
    },
    refreshToken: {
      type: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordTokenExpiry: {
      type: Date,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationTokenExpiry: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
);

candidateSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

candidateSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

candidateSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
    },

    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    },
  );
};

candidateSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
    },
  );
};

candidateSchema.methods.generateTemporaryToken = function () {
  const unHashedToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex");

  const tokenExpiry = Date.now() + 20 * 60 * 1000;
  return { unHashedToken, hashedToken, tokenExpiry };
};


export const Candidate = mongoose.model("Candidate", candidateSchema);
