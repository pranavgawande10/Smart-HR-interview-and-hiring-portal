import {Application} from "../models/application.model.js";
import Job from "../models/job.model.cjs";
import User from "../models/user.cjs";
import Interview from "../models/interview.model.js";
import { sendEmail } from "../utils/email.js";
import { interviewMailTemplate } from "../utils/emailTemplates.js";

export const updateAvailability = async (req, res) => {
  try {
    const userId = req.user._id;
    const { availabilityStatus } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { availabilityStatus },
      { new: true }
    );

    res.status(200).json({
      message: "Availability updated",
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCapacity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { maxCapacity } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { maxCapacity },
      { new: true }
    );

    res.status(200).json({
      message: "Capacity updated",
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// export const updateSkills = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { skills } = req.body;

//     const user = await User.findByIdAndUpdate(
//       userId,
//       { skills },
//       { new: true }
//     );

//     res.status(200).json({
//       message: "Skills updated successfully",
//       user,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export const completeInterview = async (req, res) => {
//   try {
//     const { applicationId } = req.params;

//     // 1. Find the application and populate interviewer
//     const application = await Application.findById(applicationId)
//       .populate("assignedInterviewer");

//     if (!application) {
//       return res.status(404).json({
//         message: "Application not found",
//       });
//     }

//     // 2. Check if an interviewer is assigned
//     if (!application.assignedInterviewer) {
//       return res.status(400).json({
//         message: "No interviewer assigned",
//       });
//     }

//     const interviewer = await User.findById(application.assignedInterviewer._id);

//     // 3. Update application status (you can pass result in body if needed)
//     application.status = "shortlisted"; // or "rejected" if you want

//     // 4. Clear assignedInterviewer
//     application.assignedInterviewer = null;

//     // 5. Decrease interviewer load safely
//     if (interviewer.assignedCount > 0) {
//       interviewer.assignedCount -= 1;
//     }

//     // 6. Save both documents
//     await interviewer.save();
//     await application.save();

//     return res.status(200).json({
//       message: "Interview completed successfully, interviewer cleared",
//     });

//   } catch (error) {
//     console.error("Complete Interview Error:", error);
//     return res.status(500).json({
//       error: error.message,
//     });
//   }
// };

export const updateSkills = async (req, res) => {
  try {
    const userId = req.user._id;
    const { skills } = req.body;

    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({ message: "Skills must be an array" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { skills } }, // ✅ explicit update
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Skills updated successfully",
      user,
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const scheduleInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { date, time, mode, meetingLink, location } = req.body;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    if (interview.interviewer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (interview.status === "COMPLETED") {
      return res.status(400).json({
        message: "Interview already completed"
      });
    }

    const startTime = new Date(`${date}T${time}:00`);

    if (isNaN(startTime.getTime())) {
      return res.status(400).json({
        message: "Invalid date or time"
      });
    }

    const duration = 30 * 60 * 1000;
    const endTime = new Date(startTime.getTime() + duration);

    // 🔥 OVERLAP CHECK
    const conflicts = await Interview.find({
      interviewer: req.user._id,
      status: "SCHEDULED",
      _id: { $ne: interviewId }
    });

    const isConflict = conflicts.some((i) => {
      const existingStart = new Date(i.scheduledAt);
      const existingEnd = new Date(existingStart.getTime() + duration);
      return startTime < existingEnd && endTime > existingStart;
    });

    if (isConflict) {
      return res.status(400).json({
        message: "Time slot overlaps with another interview"
      });
    }

    // ✅ Save
    interview.scheduledAt = startTime;
    interview.mode = mode;
    interview.meetingLink = meetingLink;
    interview.location = location;
    interview.status = "SCHEDULED";
    interview.candidateResponse = "PENDING";

    await interview.save();

    // 🔥 EMAIL NOTIFICATION
    const candidate = await User.findById(interview.candidate);
    const job = await Job.findById(interview.job);

    await sendEmail({
      to: candidate.email,
      subject: "Interview Scheduled",
      html: interviewMailTemplate({
        candidateName: candidate.name,
        jobTitle: job.title,
        company: job.company,
        round: interview.roundNumber,
        date: startTime.toLocaleString(),
        mode: mode,
        message: "Your interview has been scheduled."
      })
    });

    res.status(200).json({
      message: "Interview scheduled successfully",
      interview
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};



export const rescheduleInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { date, time, reason } = req.body;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    if (interview.interviewer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (interview.status === "COMPLETED") {
      return res.status(400).json({
        message: "Cannot reschedule completed interview"
      });
    }

    const startTime = new Date(`${date}T${time}:00`);

    if (isNaN(startTime.getTime())) {
      return res.status(400).json({
        message: "Invalid date or time"
      });
    }

    const duration = 30 * 60 * 1000;
    const endTime = new Date(startTime.getTime() + duration);

    // 🔥 OVERLAP CHECK
    const conflicts = await Interview.find({
      interviewer: req.user._id,
      status: "SCHEDULED",
      _id: { $ne: interviewId }
    });

    const isConflict = conflicts.some((i) => {
      const existingStart = new Date(i.scheduledAt);
      const existingEnd = new Date(existingStart.getTime() + duration);
      return startTime < existingEnd && endTime > existingStart;
    });

    if (isConflict) {
      return res.status(400).json({
        message: "Time slot overlaps with another interview"
      });
    }

    // ✅ Update
    interview.scheduledAt = startTime;
    interview.status = "SCHEDULED";
    interview.candidateResponse = "PENDING";
    interview.rescheduleReason = reason || "Rescheduled by interviewer";
    interview.rescheduleCount = (interview.rescheduleCount || 0) + 1;

    await interview.save();

    // 🔥 EMAIL NOTIFICATION
    const candidate = await User.findById(interview.candidate);
    const job = await Job.findById(interview.job);

    await sendEmail({
      to: candidate.email,
      subject: "Interview Rescheduled",
      html: interviewMailTemplate({
        candidateName: candidate.name,
        jobTitle: job.title,
        company: job.company,
        round: interview.roundNumber,
        date: startTime.toLocaleString(),
        message: "Your interview has been rescheduled."
      })
    });

    res.status(200).json({
      message: "Rescheduled successfully",
      interview
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};



export const completeInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { feedback, result } = req.body;

    const interview = await Interview.findById(interviewId);
 
    if (!interview) {
      return res.status(404).json({
        message: "Interview not found"
      });
    }

    // 🔐 AUTH
    if (
      interview.interviewer?.toString() !== req.user._id.toString() &&
      req.user.role !== "HR"
    ) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    // ❌ Prevent double completion
    if (interview.status === "COMPLETED") {
      return res.status(400).json({
        message: "Interview already completed"
      });
    }

    // ❌ Validate result
    if (!["PASS", "FAIL"].includes(result)) {
      return res.status(400).json({
        message: "Result must be PASS or FAIL"
      });
    }

    // ✅ Update interview
    interview.status = "COMPLETED";
    interview.feedback = feedback;
    interview.result = result;

    await interview.save();

    // 🔥 Reduce interviewer load
    const interviewerUser = await User.findById(interview.interviewer);

    if (interviewerUser && interviewerUser.assignedCount > 0) {
      interviewerUser.assignedCount -= 1;
      await interviewerUser.save();
    }

    // 🔥 Get candidate & job
    const candidate = await User.findById(interview.candidate);
    const job = await Job.findById(interview.job);

    // 🔥 SEND RESULT EMAIL
    await sendEmail({
      to: candidate.email,
      subject: "Interview Result",
      html: interviewMailTemplate({
        candidateName: candidate.name,
        jobTitle: job.title,
        company: job.company,
        round: interview.roundNumber,
        result: result,
        message:
          result === "PASS"
            ? "Congratulations! You have cleared this round."
            : "Unfortunately, you did not clear this round."
      })
    });

    // 🔴 UPDATE APPLICATION
    const application = await Application.findById(interview.application);

    // ❌ FAIL → Reject immediately
    if (result === "FAIL") {
      application.status = "rejected";
      await application.save();

      return res.json({
        message: "Candidate rejected",
        applicationStatus: "rejected"
      });
    }

    // 🔴 FINAL ROUND → FINAL RESULT
    if (interview.isFinalRound === true) {
      application.status = "selected";
      await application.save();

      // ✅ HR notification
      await sendEmail({
        to: req.user.email,
        subject: "Candidate Selected",
        html: `
          <h3>Candidate Selected</h3>
          <p><b>Name:</b> ${candidate.name}</p>
          <p><b>Email:</b> ${candidate.email}</p>
          <p><b>Job:</b> ${job.title}</p>
        `
      });

      return res.json({
        message: "Candidate selected 🎉",
        applicationStatus: "selected"
      });
    }

    // 🟢 PASS → WAIT FOR NEXT ROUND (HR will create)
    application.status = "interview";
    await application.save();

    res.json({
      message: "Interview completed - ready for next round",
      interview
    });

  } catch (error) {
    console.error("Complete Interview Error:", error);
    res.status(500).json({ error: error.message });
  }
};


export const getMyInterviews = async (req, res) => {
  try {
    const userId = req.user._id;

    const interviews = await Interview.find({
      interviewer: userId
      // Removed { status: { $ne: "COMPLETED" } } to allow Dashboard fetching all histories
    })
      .populate("candidate", "name email")
      .populate("job", "title")
      .sort({ scheduledAt: 1 }); // better: upcoming first

    res.status(200).json({
      count: interviews.length,
      interviews
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch user safely, excluding password
    const user = await User.findById(userId).select("-password -__v");

    if (!user) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({ profile: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email, companyName } = req.body;

    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (companyName !== undefined) updateData.companyName = companyName;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password -__v");

    if (!user) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      profile: user,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already in use" });
    }
    res.status(500).json({ error: error.message });
  }
};


