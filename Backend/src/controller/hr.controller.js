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
    const { applicationId, interviewId } = req.params;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found"
      });
    }

    let users = [];

    // 🔴 FINAL ROUND → FETCH HR (NO SKILLS)
    if (interview.isFinalRound === true) {
      users = await User.find({
        role: "HR",
        availabilityStatus: "AVAILABLE"
      }).select("-password");

      return res.status(200).json({
        message: "HR list fetched for final round",
        count: users.length,
        interviewers: users
      });
    }

    // 🟢 NORMAL ROUND → SKILL BASED
    const application = await Application.findById(applicationId);
    const job = await Job.findById(application.job);

    const interviewers = await User.find({
      role: "INTERVIEWER",
      availabilityStatus: "AVAILABLE"
    }).select("-password");

    users = interviewers.filter(i =>
      i.skills?.some(skill =>
        job.skillsrequired.includes(skill)
      )
    );

    return res.status(200).json({
      message: "Matching interviewers fetched successfully",
      count: users.length,
      interviewers: users
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createInterviewRound = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { round, isFinalRound } = req.body;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        message: "Application not found"
      });
    }

    // ❌ Stop if already completed
    if (["selected", "rejected"].includes(application.status)) {
      return res.status(400).json({
        message: "Hiring process already completed"
      });
    }

    // 🔍 Get last interview
    const lastInterview = await Interview.findOne({
      application: applicationId
    }).sort({ createdAt: -1 });

    // ❌ Check previous round completion + PASS
    if (lastInterview) {
      if (lastInterview.status !== "COMPLETED") {
        return res.status(400).json({
          message: "Previous round not completed yet"
        });
      }

      if (lastInterview.result !== "PASS") {
        return res.status(400).json({
          message: "Candidate did not pass previous round"
        });
      }
    }

    // 🔢 Auto round number
    const roundNumber = lastInterview
      ? lastInterview.roundNumber + 1
      : 1;

    // 🔴 Prevent multiple final rounds
    if (isFinalRound === true) {
      const existingFinal = await Interview.findOne({
        application: applicationId,
        isFinalRound: true
      });

      if (existingFinal) {
        return res.status(400).json({
          message: "Final round already exists"
        });
      }
    }

    // ✅ Create interview
    const interview = await Interview.create({
      application: applicationId,
      candidate: application.candidate,
      job: application.job,
      round,
      roundNumber,
      isFinalRound: isFinalRound || false,
      status: "SCHEDULED"   // ✅ consistent
    });

    // 🔄 Update application status
    application.status = "interview";
    await application.save();

    res.status(201).json({
      message: `Round ${roundNumber} created successfully`,
      interview
    });

  } catch (error) {
    console.error("Create Round Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const assignInterviewerToRound = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { interviewerId } = req.body;

    // 🔐 Only HR allowed
    if (req.user.role !== "HR") {
      return res.status(403).json({
        message: "Only HR can assign interviewer"
      });
    }

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found"
      });
    }

    // ❌ Already assigned
    if (interview.interviewer) {
      return res.status(400).json({
        message: "Interviewer already assigned"
      });
    }

    // 🔴 FINAL ROUND → HR only
    if (interview.isFinalRound) {
      interview.interviewer = req.user._id;
      interview.status = "ASSIGNED";

      await interview.save();

      return res.json({
        message: "HR assigned as interviewer for final round",
        interview
      });
    }

    // 🟢 NORMAL ROUND

    const interviewer = await User.findById(interviewerId);

    if (!interviewer) {
      return res.status(404).json({
        message: "Interviewer not found"
      });
    }

    // ❌ Ensure role
    if (interviewer.role !== "INTERVIEWER") {
      return res.status(400).json({
        message: "User is not an interviewer"
      });
    }

    // ❌ Availability check
    if (interviewer.availabilityStatus !== "AVAILABLE") {
      return res.status(400).json({
        message: "Interviewer not available"
      });
    }

    // ❌ Capacity check
    if (interviewer.assignedCount >= interviewer.maxCapacity) {
      return res.status(400).json({
        message: "Interviewer capacity full"
      });
    }

    // ✅ Assign
    interview.interviewer = interviewerId;
    interview.status = "ASSIGNED";

    await interview.save();

    // 🔥 Increase load
    interviewer.assignedCount += 1;
    await interviewer.save();

    res.json({
      message: "Interviewer assigned successfully",
      interview
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// export const hrDecisionAfterInterview = async (req, res) => {
//   try {
//     const { interviewId } = req.params;
//     const { action } = req.body;

//     const interview = await Interview.findById(interviewId);

//     const application = await Application.findById(interview.application);

//     // ❌ Reject
//     if (action === "REJECT") {
//       application.status = "rejected";
//       await application.save();

//       return res.json({ message: "Candidate rejected" });
//     }

//     // ✅ Next round
//     if (action === "NEXT_ROUND") {

//       // 🔥 increase round
//       application.currentRound += 1;

//       await application.save();

//       return res.json({
//         message: `Move to Round ${application.currentRound}`
//       });
//     }

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

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

export const updateHRCapacity = async (req, res) => {
  try {
    const hrId = req.user._id;
    const { maxCapacity } = req.body;

    // 🔐 Only HR allowed (extra safety)
    if (req.user.role !== "HR") {
      return res.status(403).json({
        message: "Only HR can update HR capacity"
      });
    }

    if (!maxCapacity || maxCapacity < 1) {
      return res.status(400).json({
        message: "Capacity must be greater than 0"
      });
    }

    const hr = await User.findByIdAndUpdate(
      hrId,
      { maxCapacity },
      { new: true }
    );

    return res.status(200).json({
      message: "HR capacity updated successfully",
      hr
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const completeHRInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { feedback, result } = req.body; // PASS / FAIL

    // 🔍 Find interview
    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found"
      });
    }

    // ❌ Only final round allowed
    if (interview.isFinalRound !== true) {
      return res.status(400).json({
        message: "This is not a final HR round"
      });
    }

    // 🔐 Only assigned HR can complete
    if (interview.interviewer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    // ✅ Mark interview completed
    interview.status = "COMPLETED";
    interview.feedback = feedback;
    interview.result = result;

    await interview.save();

    // 🔥 Update application status
    const application = await Application.findById(interview.application);

    if (!application) {
      return res.status(404).json({
        message: "Application not found"
      });
    }

    application.status = result === "PASS" ? "selected" : "rejected";

    await application.save();

    // 🔥 Reduce HR load
    const hr = await User.findById(interview.interviewer);

    if (hr && hr.assignedCount > 0) {
      hr.assignedCount -= 1;
      await hr.save();
    }

    return res.status(200).json({
      message: "Final interview completed successfully",
      applicationStatus: application.status,
      interview
    });

  } catch (error) {
    console.error("HR Completion Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getShortlistedApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await Application.find({
      job: jobId,
      status: { $ne: "rejected" }
    }).populate("candidate", "name email");

    const result = [];

    for (let app of applications) {

      // 🔥 Get last interview
      const lastInterview = await Interview.findOne({
        application: app._id
      }).sort({ createdAt: -1 });

      if (!lastInterview) continue;

      // ❌ Skip failed candidates
      if (lastInterview.result === "FAIL") continue;

      // 🔥 Count completed rounds
      const completedRounds = await Interview.countDocuments({
        application: app._id,
        status: "COMPLETED"
      });

      result.push({
        ...app._doc,
        roundsCompleted: completedRounds,
        lastRound: lastInterview.roundNumber,
        isFinalRound: lastInterview.isFinalRound,
        lastResult: lastInterview.result,
        lastInterviewId: lastInterview._id,
        assignedInterviewerId: lastInterview.interviewer
      });
    }

    res.json({
      count: result.length,
      applications: result
    });

  } catch (error) {
    console.error("Shortlist Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const finalHRDecision = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { feedback, result } = req.body;

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    if (
      interview.interviewer?.toString() !== req.user._id.toString() &&
      req.user.role !== "HR"
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (interview.status === "COMPLETED") {
      return res.status(400).json({ message: "Already completed" });
    }

    if (!["PASS", "FAIL"].includes(result)) {
      return res.status(400).json({ message: "Invalid result" });
    }

    interview.status = "COMPLETED";
    interview.feedback = feedback;
    interview.result = result;

    await interview.save();

    const application = await Application.findById(interview.application);
    const candidate = await User.findById(application.candidate);
    const job = await Job.findById(application.job);

    let finalStatus = application.status;

    if (interview.isFinalRound) {
      application.status = result === "PASS" ? "selected" : "rejected";
      finalStatus = application.status;
    } else {
      if (result === "FAIL") {
        application.status = "rejected";
        finalStatus = "rejected";
      }
    }

    await application.save();

    // 📩 EMAIL TO CANDIDATE
    await sendEmail({
      to: candidate.email,
      subject: "Interview Result Update",
      html: interviewMailTemplate({
        candidateName: candidate.name,
        jobTitle: job.title,
        company: job.company,
        result: finalStatus,
        message:
          finalStatus === "selected"
            ? "🎉 Congratulations! You are selected."
            : finalStatus === "rejected"
            ? "We regret to inform you."
            : "You cleared this round."
      })
    });

    // 📩 HR EMAIL (only final selection)
    if (interview.isFinalRound && result === "PASS") {
      await sendEmail({
        to: req.user.email,
        subject: "Candidate Selected",
        html: `
          <h3>Candidate Selected</h3>
          <p><b>Name:</b> ${candidate.name}</p>
          <p><b>Job:</b> ${job.title}</p>
          <p><b>Email:</b> ${candidate.email}</p>
        `
      });
    }

    res.json({
      message: "Interview completed",
      applicationStatus: finalStatus
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const hrScheduleInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { date, time, mode, meetingLink, location } = req.body;

    const interview = await Interview.findById(interviewId);
    if (!interview) return res.status(404).json({ message: "Not found" });

    if (interview.interviewer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const startTime = new Date(`${date}T${time}:00`);
    const duration = 30 * 60 * 1000;
    const endTime = new Date(startTime.getTime() + duration);

    const all = await Interview.find({
      interviewer: req.user._id,
      status: "SCHEDULED",
      _id: { $ne: interviewId }
    });

    const conflict = all.some((i) => {
      const s = new Date(i.scheduledAt);
      const e = new Date(s.getTime() + duration);
      return startTime < e && endTime > s;
    });

    if (conflict) {
      return res.status(400).json({ message: "Time conflict" });
    }

    interview.scheduledAt = startTime;
    interview.mode = mode;
    interview.meetingLink = meetingLink;
    interview.location = location;
    interview.status = "SCHEDULED";

    await interview.save();

    const candidate = await User.findById(interview.candidate);
    const job = await Job.findById(interview.job);

    await sendEmail({
      to: candidate.email,
      subject: "Interview Scheduled",
      html: interviewMailTemplate({
        candidateName: candidate.name,
        jobTitle: job.title,
        company: job.company,
        date: startTime.toLocaleString(),
        message: "Your interview is scheduled."
      })
    });

    res.json({ message: "Scheduled", interview });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const hrRescheduleInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { date, time } = req.body;

    const interview = await Interview.findById(interviewId);
    if (!interview) return res.status(404).json({ message: "Not found" });

    if (interview.interviewer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const startTime = new Date(`${date}T${time}:00`);
    const duration = 30 * 60 * 1000;
    const endTime = new Date(startTime.getTime() + duration);

    const all = await Interview.find({
      interviewer: req.user._id,
      status: "SCHEDULED",
      _id: { $ne: interviewId }
    });

    const conflict = all.some((i) => {
      const s = new Date(i.scheduledAt);
      const e = new Date(s.getTime() + duration);
      return startTime < e && endTime > s;
    });

    if (conflict) {
      return res.status(400).json({ message: "Conflict" });
    }

    interview.scheduledAt = startTime;

    await interview.save();

    const candidate = await User.findById(interview.candidate);
    const job = await Job.findById(interview.job);

    await sendEmail({
      to: candidate.email,
      subject: "Interview Rescheduled",
      html: interviewMailTemplate({
        candidateName: candidate.name,
        jobTitle: job.title,
        company: job.company,
        date: startTime.toLocaleString(),
        message: "Interview rescheduled"
      })
    });

    res.json({ message: "Rescheduled", interview });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getSelectedApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await Application.find({
      job: jobId
    }).populate("candidate", "name email profilePhoto");

    const selected = [];

    for (let app of applications) {

      // 🔥 Get last interview
      const lastInterview = await Interview.findOne({
        application: app._id
      }).sort({ createdAt: -1 });

      if (!lastInterview) continue;

      // ✅ ONLY FINAL ROUND PASS
      if (
        lastInterview.isFinalRound === true &&
        lastInterview.result === "PASS"
      ) {
        // 🔢 Count completed rounds
        const roundsCompleted = await Interview.countDocuments({
          application: app._id,
          status: "COMPLETED"
        });

        selected.push({
          ...app._doc,
          roundsCompleted,
          finalResult: lastInterview.result,
          finalRound: lastInterview.roundNumber
        });
      }
    }

    res.status(200).json({
      success: true,
      count: selected.length,
      applications: selected
    });

  } catch (error) {
    console.error("Selected Applications Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getHRInterviews = async (req, res) => {
  try {
    const hrId = req.user._id;

    const interviews = await Interview.find({
      interviewer: hrId,
      status: { $ne: "COMPLETED" } // 🔥 hide completed
    })
      .populate("candidate", "name email")
      .populate("job", "title company")
      .sort({ scheduledAt: 1 }); // upcoming first

    res.status(200).json({
      success: true,
      count: interviews.length,
      interviews
    });

  } catch (error) {
    console.error("HR Interviews Error:", error);
    res.status(500).json({ error: error.message });
  }
};



