import { Application } from "../models/application.model.js";
import  Job  from "../models/job.model.cjs";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadDocOnCloudinary } from "../utils/cloudinary.js";
/*
---------------------------------------
Apply For Job
POST /api/v1/application/apply/:jobId
---------------------------------------
*/

export const applyForJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const { fullName, email, phone, coverLetter } = req.body;

  if (!fullName || !email || !phone) {
    throw new ApiError(400, "Full name, email and phone are required");
  }

  // Check if job exists
  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  // Prevent duplicate applications
  const alreadyApplied = await Application.findOne({
    job: jobId,
    candidate: req.user._id,
  });

  if (alreadyApplied) {
    throw new ApiError(400, "You have already applied for this job");
  }

  // Resume file
  const resumePath = req.file?.path;

  if (!resumePath) {
    throw new ApiError(400, "Resume file is required");
  }

  let resume;
  try {
    resume = await uploadDocOnCloudinary(resumePath);
    if(!resume?.url){
        throw new ApiError(500, "Cloudinaruy did not return a URL for the uploaded resume");
    }
    
  } catch (error) {
    console.log("Error uploading resume to Cloudinary:", error);
    throw new ApiError(500, "Failed to upload resume. Please try again.");
  }

  const application = await Application.create({
    job: jobId,
    candidate: req.user._id,
    fullName,
    email,
    phone,
    coverLetter,
    resume: resume.url,
  });

  return res.status(201).json({
    success: true,
    message: "Application submitted successfully",
    application,
  });
});

/*
---------------------------------------
Candidate: View My Applications
GET /api/v1/application/my-applications
---------------------------------------
*/

export const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({
    candidate: req.user._id,
  })
    .populate("job")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    count: applications.length,
    applications,
  });
});

/*
---------------------------------------
HR: View Applications for a Job
GET /api/v1/application/job/:jobId
---------------------------------------
*/

export const getApplicantsForJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const applications = await Application.find({
    job: jobId,
  })
    .populate("candidate", "name email profilePhoto")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    count: applications.length,
    applications,
  });
});

/*
---------------------------------------
HR: Update Application Status
PATCH /api/v1/application/status/:applicationId
---------------------------------------
*/

export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  const allowedStatus = [
    "applied",
    "shortlisted",
    "interview",
    "rejected",
  ];

  if (!allowedStatus.includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  const application = await Application.findByIdAndUpdate(
    applicationId,
    { status },
    { new: true }
  );

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  return res.status(200).json({
    success: true,
    message: "Application status updated",
    application,
  });
});