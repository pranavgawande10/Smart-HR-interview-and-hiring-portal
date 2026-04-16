
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



// Update a job by ID
jobRouter.patch("/job/update/:id", userAuth, authorizeRoles("HR"), async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Check if the HR editing the job is the one who created it
        if (job.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to update this job" });
        }

        const allowedUpdates = ["title", "description", "location", "vacancies", "skillsrequired", "experience"];
        const updates = Object.keys(req.body);
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).json({ message: "Invalid updates!" });
        }

        updates.forEach((update) => {
            job[update] = req.body[update];
        });

        await job.save();
        res.json({ message: "Job updated successfully!", job });

    } catch (error) {
        res.status(400).json({ message: "Error updating job", error: error.message });
    }
});

// Delete a job by ID
jobRouter.delete("/job/delete/:id", userAuth, authorizeRoles("HR"), async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Check if the HR deleting the job is the one who created it
        if (job.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this job" });
        }

        await Job.findByIdAndDelete(jobId);
        res.json({ message: "Job deleted successfully!" });

    } catch (error) {
        res.status(400).json({ message: "Error deleting job", error: error.message });
    }
});

module.exports = jobRouter;
