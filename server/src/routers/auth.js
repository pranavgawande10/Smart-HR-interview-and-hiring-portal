const express = require("express");
const authRouter = express.Router();
const User  = require("../models/user.js");
const {signupValidation} = require("../utils/validation.js");
const bcrypt =  require("bcrypt");
const validator = require("validator");


authRouter.post("/signup" , async (req,res)=>{
    // console.log(req.body);
    

    try{
        //validation of data
        signupValidation(req);

        //encrypt the password
        const {name, email,password ,companyName} = req.body;
        const passwordHash = await bcrypt.hash(password , 10);

        console.log(passwordHash);

        //create a new instance of user model
        const user = new User({
            name,
            email,
            companyName,
            password : passwordHash,
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

authRouter.post("/login" , async(req,res)=>{
    try{
        const {email , password} = req.body;
        if(!(validator.isEmail(email)))
        {
            res.status(400).send("Please enter valid EmailId!");
        }
        

        const userpresent  = await User.findOne({email : email});
        if(!userpresent)
        {
            throw new Error("Invalid Credentials!");
        }
        const isPasswordvalid = await userpresent.validatePassword(password);

        if(isPasswordvalid)
        {
            //create a JWT token
            const token = await userpresent.getJWT();
            //add token to cookie and send the response back to user !!
            res.cookie("token" , token); 
            
            res.send("Login successfully!!!");
        }
        else
        {
            throw new Error("Invalid credentials!!");
        }
    }
    catch(error)
    {
        res.status(400).send("login failed please enter valid data!" + error.message);
    }
});

authRouter.post("/logout" , (req,res) =>{
    res.cookie("token" , null ,{
        expires :new Date(Date.now()), 
    });

    res.send("Logout successfully!");
});

module.exports = authRouter;