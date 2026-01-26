const express = require("express");
const router = express.Router();
const Interview = require("../models/interview");
const Feedback = require("../models/interviewFeedback");
const { userAuth } = require("../middlewares/auth");

router.post("/interview/create-test", async (req, res) => {
    try {
        const interview = new Interview(req.body);
        await interview.save();
        res.send("Interview created for testing");
    } catch (err) {
        res.status(400).send(err.message);
    }
});


router.get("/interviewer/interviews", userAuth, async (req, res) => {
    const interviews = await Interview.find({
        interviewerId: req.user._id
    }).populate("jobId candidateId");

    res.json(interviews);
});

router.post("/interviewer/feedback", userAuth, async (req, res) => {
    const feedback = new Feedback({
        ...req.body,
        interviewerId: req.user._id
    });

    await feedback.save();
    res.send("Feedback submitted");
});

module.exports = router;
