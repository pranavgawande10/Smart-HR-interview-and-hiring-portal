const express = require("express");
const connectDB = require("./config/database.js");
const app = express();
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const PORT = process.env.PORT;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(
    {
        origin: process.env.CLIENT_URI,
        credentials: true
    }
))



const authRouter = require("./routers/auth.js");
const profileRouter = require("./routers/profile.js");
const jobRouter = require("./routers/job.js");
const interviewerRouter = require("./routers/interviewer");
app.use("/", interviewerRouter);


app.use("/", profileRouter);
app.use("/", authRouter);
app.use("/", jobRouter);



connectDB()
    .then(() => {
        console.log("connect to DB successfully!");
        app.listen(PORT, () => {
            console.log(`server is successfully listening at port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("connection to DB is failed!");
    });
