const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["HR", "INTERVIEWER", "CANDIDATE"],
        default: "HR"
    },

    companyName: {
        type: String
    },

    skills: [String],              // interviewer
    experienceYears: Number,       // interviewer
    availabilityStatus: {
        type: String,
        enum: ["AVAILABLE", "BUSY", "OFFLINE"],
        default: "AVAILABLE"
    },

    profilePhoto: String
}, { timestamps: true });

userSchema.methods.getJWT = function () {
    return jwt.sign(
        { _id: this._id, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
};

userSchema.methods.validatePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
