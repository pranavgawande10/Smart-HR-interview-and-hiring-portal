
const express = require("express");
const jobRouter = express.Router();
const Job = require("../models/job.js");
const { userAuth } = require("../middlewares/auth.js");


// ✅ HR creates a job post
jobRouter.post("/job/create", userAuth, async (req, res) => {
    try {
        const { title, description, location, vacancies } = req.body;

        if (!title || !description || !location || !vacancies) {
            throw new Error("All fields are required!");
        }

        const job = new Job({
            title,
            description,
            location,
            vacancies,
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


// ✅ HR views their own job posts
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
