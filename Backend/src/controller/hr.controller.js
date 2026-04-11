import {Application} from "../models/application.model.js";
import Job from "../models/job.model.cjs";
import User from "../models/user.cjs";

import Interview from "../models/interview.model.js";

export const assignInterviewer = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Prevent reassignment
    if (application.assignedInterviewer) {
      return res.status(400).json({
        message: "Interviewer already assigned",
      });
    }

    const job = await Job.findById(application.job);

    // ✅ Only available + under capacity
    const interviewers = await User.find({
      role: "INTERVIEWER",
      availabilityStatus: "AVAILABLE",
    });

    // ✅ Filter based on capacity
    const availableInterviewers = interviewers.filter(
      (i) => i.assignedCount < i.maxCapacity
    );

    // ✅ Skill matching
    const matchedInterviewers = availableInterviewers.filter((interviewer) =>
      interviewer.skills?.some((skill) =>
        job.skillsrequired.includes(skill)
      )
    );

    if (matchedInterviewers.length === 0) {
      return res.status(400).json({
        message: "No interviewer available (capacity full or no skill match)",
      });
    }

    // ✅ Pick least loaded interviewer
    const interviewer = matchedInterviewers.sort(
      (a, b) => a.assignedCount - b.assignedCount
    )[0];

    // Assign
    application.assignedInterviewer = interviewer._id;
    application.status = "interview";

    interviewer.assignedCount += 1;

    await interviewer.save();
    await application.save();

    return res.status(200).json({
      message: "Interviewer assigned successfully",
      interviewer,
    });

  } catch (error) {
    console.error("Assign Interviewer Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const getMatchedInterviewers = async (req, res) => {
  try {
    const { applicationId } = req.params;

    // 1. Get application
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // 2. Get job
    const job = await Job.findById(application.job);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 3. Get all available interviewers
    const interviewers = await User.find({
      role: "INTERVIEWER",
      availabilityStatus: "AVAILABLE",
    }).select("-password"); // hide password

    // 4. Match based on skills
    const matchedInterviewers = interviewers.filter((interviewer) =>
      interviewer.skills?.some((skill) =>
        job.skillsrequired.includes(skill)
      )
    );

    // 5. If none found
    if (matchedInterviewers.length === 0) {
      return res.status(200).json({
        message: "No matching interviewer found",
        interviewers: [],
      });
    }

    // 6. Send response
    return res.status(200).json({
      message: "Matching interviewers fetched successfully",
      count: matchedInterviewers.length,
      interviewers: matchedInterviewers,
    });

  } catch (error) {
    console.error("Get Interviewers Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const createInterviewRound = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { round, roundNumber, isFinalRound } = req.body;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // ❌ Check if final round already exists
    const existingFinal = await Interview.findOne({
      application: applicationId,
      isFinalRound: true
    });

    if (existingFinal) {
      return res.status(400).json({
        message: "Final round already created. No more rounds allowed."
      });
    }

    const interview = await Interview.create({
      application: applicationId,
      candidate: application.candidate,
      job: application.job,
      round,
      roundNumber,
      isFinalRound: isFinalRound || false
    });

    application.status = "interview";
    await application.save();

    res.status(201).json({
      message: "Interview round created",
      interview
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const assignInterviewerToRound = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { interviewerId } = req.body;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // 🔥 FINAL ROUND → only HR allowed
    if (interview.isFinalRound) {
      const hr = await User.findById(req.user._id);

      interview.interviewer = hr._id;
      interview.status = "ASSIGNED";

      await interview.save();

      return res.json({
        message: "HR assigned as interviewer for final round",
        interview
      });
    }

    // Normal assignment
    interview.interviewer = interviewerId;
    interview.status = "ASSIGNED";

    await interview.save();

    res.json({
      message: "Interviewer assigned",
      interview
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const hrDecisionAfterInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { action } = req.body;

    const interview = await Interview.findById(interviewId);

    const application = await Application.findById(interview.application);

    // ❌ Reject
    if (action === "REJECT") {
      application.status = "rejected";
      await application.save();

      return res.json({ message: "Candidate rejected" });
    }

    // ✅ Next round
    if (action === "NEXT_ROUND") {

      // 🔥 increase round
      application.currentRound += 1;

      await application.save();

      return res.json({
        message: `Move to Round ${application.currentRound}`
      });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getResumeForHR = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId)
      .populate("candidate", "name email");

    if (!application || !application.resume) {
      return res.status(404).json({
        message: "Resume not found"
      });
    }

    // 🔥 Cloudinary URLs
    const viewUrl = application.resume;
    const downloadUrl = application.resume + "?fl_attachment=true";

    return res.status(200).json({
      message: "Resume fetched successfully",
      candidate: application.candidate,
      viewResume: viewUrl,
      downloadResume: downloadUrl
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


