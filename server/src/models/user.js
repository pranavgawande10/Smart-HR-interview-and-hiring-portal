const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();


const hrSchema = new mongoose.Schema({
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
        default: "HR"
    },

    companyName: {
        type: String,
        required: true
    },

    profilePhoto: {
        type: String,
        default: "enter photo url"   // or null
    },

}, { timestamps: true });

hrSchema.methods.getJWT = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return token;
};

hrSchema.methods.validatePassword = async function (passwordIntputByUser) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordvalid = await bcrypt.compare(passwordIntputByUser, passwordHash);

    return isPasswordvalid;

}

module.exports = mongoose.model("HR", hrSchema);
