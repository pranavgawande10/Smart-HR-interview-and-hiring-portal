const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
const {validateEditProfileData} = require("../utils/validation.js");

profileRouter.get("/profile/view" , userAuth,  async(req,res)=>{
    try{
        const user = req.user;

        // console.log(cookie);
        res.send(user);

    }catch(Error)
    {
        res.status(400).send("something went wrong Unable to fetch profile!" + Error.message);
    }
    
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const allowedFields = [
      "name",
      "email",
      "companyName",
      "profilePhoto",
    ];

    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        loggedInUser[key] = req.body[key];
      }
    });

    await loggedInUser.save();

    res.send(
      `${loggedInUser.name}, your profile was updated successfully!!`
    );
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});
module.exports = profileRouter;
