const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
console.log(process.env.MONGODB_URI);
const connectDB = async ()=>{
    try{
         await mongoose.connect(process.env.MONGODB_URI);
    }
    catch(error)
    {
        throw new Error("Data base cant connect!!!");
    }
}

module.exports = connectDB;