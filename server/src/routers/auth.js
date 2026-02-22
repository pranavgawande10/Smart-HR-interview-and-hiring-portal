const express = require("express");
const authRouter = express.Router();
const User  = require("../models/user.js");
const {signupValidation} = require("../utils/validation.js");
const bcrypt =  require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail.js");



authRouter.post("/signup" , async (req,res)=>{
    // console.log(req.body);
    

    try{
        //validation of data
        signupValidation(req);

        //encrypt the password
        const { 
  name, 
  email, 
  password, 
  companyName, 
  role, 
  skills, 
  experienceYears 
} = req.body;
        const passwordHash = await bcrypt.hash(password , 10);

        

        //create a new instance of user model
        const user = new User({
    name,
    email,
    password: passwordHash,
    role: role || "HR", 
    companyName: role === "HR" ? companyName : undefined,
    skills: role === "INTERVIEWER" ? skills : undefined,
    experienceYears: role === "INTERVIEWER" ? experienceYears : undefined
});

        const data = req.body;
        await user.save();
        res.send("user data saved successfully!");
    }
    catch(err)
    {
        res.status(400).send("data not saved!" + err);
    }
    
});

authRouter.post("/login", async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // 🔥 ROLE CHECK
        if (user.role !== role) {
            return res.status(403).json({ message: "Role mismatch! Please select correct role." });
        }

        const isPasswordValid = await user.validatePassword(password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = user.getJWT();

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, 
            maxAge: 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Login successful",
            role: user.role,
            name: user.name
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

authRouter.post("/logout" , (req,res) =>{
    res.cookie("token" , null ,{
        expires :new Date(Date.now()), 
    });

    res.send("Logout successfully!");
});

authRouter.post("/forgotpassword", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            throw new Error("Email is required");
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }

        const resetToken = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        const resetLink = `${process.env.RESET_PASSWORD_URL}?token=${resetToken}`;
        console.log(resetLink);

        await sendEmail(
            user.email,
            "Reset Your Password",
            `
            <p>Hello ${user.name},</p>
            <p>Click below to reset your password:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>This link will expire in 15 minutes.</p>
            `
        );

        res.send("Password reset link sent to email");

    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
});

authRouter.post("/resetpassword", async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            throw new Error("Token and password required");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded._id);
        if (!user) {
            throw new Error("Invalid token");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        await user.save();

        res.send("Password reset successful");

    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
});


module.exports = authRouter;