import {Application} from "../models/application.model.js";
import Job from "../models/job.model.cjs";
import User from "../models/user.cjs";
import Interview from "../models/interview.model.js";

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

    // 🔥 Convert to Date
    const scheduledTime = new Date(`${date}T${time}:00`);

    // 🔥 Conflict Check (IMPORTANT)
    const conflict = await Interview.findOne({
      interviewer: req.user._id,
      scheduledAt: scheduledTime,
      status: { $in: ["SCHEDULED"] }
    });

    if (conflict) {
      return res.status(400).json({
        message: "You already have an interview at this time"
      });
    }

    // ✅ Save
    interview.scheduledAt = scheduledTime;
    interview.mode = mode;
    interview.meetingLink = meetingLink;
    interview.location = location;
    interview.status = "SCHEDULED";

    await interview.save();

    res.status(200).json({
      message: "Interview scheduled successfully",
      interview
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const rescheduleInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { date, time } = req.body;

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

    const newTime = new Date(`${date}T${time}:00`);

    // 🔥 Conflict Check (exclude current interview)
    const conflict = await Interview.findOne({
      interviewer: req.user._id,
      scheduledAt: newTime,
      status: { $in: ["SCHEDULED"] },
      _id: { $ne: interviewId }
    });

    if (conflict) {
      return res.status(400).json({
        message: "Time slot already occupied"
      });
    }

    interview.scheduledAt = newTime;
    interview.status = "SCHEDULED";

    await interview.save();

    res.status(200).json({
      message: "Rescheduled successfully",
      interview
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const completeInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { feedback, result } = req.body;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // 🔐 Authorization
    if (
      interview.interviewer?.toString() !== req.user._id.toString() &&
      req.user.role !== "HR"
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    interview.status = "COMPLETED";
    interview.feedback = feedback;
    interview.result = result;

    await interview.save();

    // 🔥 FINAL ROUND LOGIC
    if (interview.isFinalRound) {
      const application = await Application.findById(interview.application);

      if (result === "PASS") {
        application.status = "selected";
      } else {
        application.status = "rejected";
      }

      await application.save();

      return res.status(200).json({
        message: "Final decision completed",
        applicationStatus: application.status
      });
    }

    return res.status(200).json({
      message: "Interview completed",
      interview
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getMyInterviews = async (req, res) => {
  try {
    const userId = req.user._id;

    const interviews = await Interview.find({
      interviewer: userId
    })
      .populate("candidate", "name email")
      .populate("job", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: interviews.length,
      interviews
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



