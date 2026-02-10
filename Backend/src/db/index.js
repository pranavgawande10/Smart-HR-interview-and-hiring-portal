import mongoose from "mongoose";

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully ✅");
        console.log("DB State:", mongoose.connection.readyState);
    } catch (error) {
        console.log("MongoDB connection failed ❌", error);
        process.exit(1);
    } 
}

export default connectDB;