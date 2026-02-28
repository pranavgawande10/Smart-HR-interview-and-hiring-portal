
const express = require("express");
const jobRouter = express.Router();
const Job = require("../models/job.js");
const { userAuth } = require("../middlewares/auth.js");
const authorizeRoles = require("../middlewares/authorize");



jobRouter.post("/job/create", userAuth, authorizeRoles("HR"), async (req, res) => {
    try {
        // if (req.user.role !== "HR") {
        //     return res.status(403).json({ message: "Only HR can create jobs" });
        // }

        const { title, description, location, vacancies,skillsrequired } = req.body;

        if (!title || !description || !location || !vacancies || !skillsrequired) {
            throw new Error("All fields are required!");
        }

        const job = new Job({
            title,
            description,
            location,
            vacancies,
            skillsrequired,
            createdBy: req.user._id
        });

        await job.save();

        res.status(201).json({
            message: "Job created successfully!",
            job
        });

    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
});




jobRouter.get("/job/myjobs", userAuth, async (req, res) => {
    try {
        const jobs = await Job.find({ createdBy: req.user._id })
    .populate("createdBy", "name companyName");


        res.json(jobs);
    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
});

module.exports = jobRouter;
