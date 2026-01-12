 const jwt  = require("jsonwebtoken");
const User = require("../models/user");
const dotenv = require("dotenv");
dotenv.config();


 const userAuth = async (req,res,next)=>{
    try 
    {
        //read the token fron req cookies
        //validate the token 
        //find the user
        const {token } = req.cookies;
        if(!token)
        {
          throw new Error("token not valid!!");
        }

        const decodeddata = await jwt.verify(token , process.env.JWT_SECRET);

        const { _id} = decodeddata;
        const user = await User.findById(_id);
      
        if(!user)
        {
            throw new Error("User not found!!!");
        }
    
        req.user = user;
         next();  
    
    }
    catch(error)
    {
         res.status(400).send("Error : " + error );
    }
 }

 module.exports = { userAuth };