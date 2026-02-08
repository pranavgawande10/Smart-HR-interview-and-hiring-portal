# HR panel
- database link

# HR Schema and job Schema
- in models folder (user.js and job.js)

# POST API
- signup
- login
- logout
- forgotpassword
- resetpassword
- job/create

# GET API
- job/myjobs
- profile/view
- profile/edit

# Routers used (server -> src-> routers )
 - authRouter in auth.js containing ( signup, login, logout, forgotpassword, resetpassword)
 - jobRouter in job.js containing (job create, view myjobs)
 - profileRouter in profile.js containing (profile/view , profile/edit)

# middlewares used (server -> src-> middlewares )
auth.js in middlewares (userAuth)

# Validations (server -> src-> utils )
- in utils folder (validation.js)  

# mail transporter (server -> src-> utils )
- in utils folder (sendEmail.js) 

# Interview & Feedback Module (Backend)

This module manages interview scheduling, interviewer dashboards, and structured interview feedback for a hiring platform.
It is designed with role-based access, secure authentication, and MongoDB relationships using references and population.

📌 Features

- Schedule interviews for candidates

- Fetch all interviews assigned to a specific interviewer

- Submit structured interview feedback

- Role-based secure access using authentication middleware

- MongoDB schema relationships with ref and populate()

# 🧱 Models
 - 1️⃣ Interview Model

- Path: src/models/interview.js

- Represents an interview scheduled for a candidate.

# Fields

- candidateId → Reference to User (Candidate)

- interviewerId → Reference to User (Interviewer)

- jobId → Reference to Job

- round → TECHNICAL | MANAGERIAL | HR

- scheduledAt → Interview date & time

- meetingLink → Online meeting link

- status → SCHEDULED | COMPLETED | NO_SHOW

- timestamps → Created & Updated time

 - 2️⃣ Interview Feedback Model (Path: src/models/interviewFeedback.js)

- Stores feedback submitted by the interviewer after the interview.

# Fields

- interviewId → Reference to Interview

- interviewerId → Reference to User

- technicalScore → Numeric rating

- communication → Numeric rating

- problemSolving → Numeric rating

- recommendation → HIRE | HOLD | REJECT

- comments → Text feedback

# timestamps

- 🔐 Authentication & Authorization

 - All interviewer routes are protected using userAuth middleware

 - Logged-in interviewer is identified using req.user._id

 - Only authenticated interviewers can:

 - View assigned interviews

 - Submit interview feedback

 #🚀 API Endpoints (Path: src/routers/interviewers.js) 

  - 1️⃣ Create Interview (Testing Only)

  -  POST /interview/create-test
     Description: Creates an interview entry.
  - ⚠️ This route is meant only for testing and should be removed or protected in production.

  - 2️⃣ Get Interviews for Interviewer

  - GET /interviewer/interviews
    Description: Fetches all interviews assigned to the logged-in interviewer.

# Details:

- Uses populate() to fetch:

- Candidate details

- Job details

  - 3️⃣ Submit Interview Feedback

  - POST /interviewer/feedback
    Description: Allows an interviewer to submit structured feedback for an interview.
    Sample Request Body
   {
    "technicalScore": 8,
    "communication": 7,
    "problemSolving": 9,
    "recommendation": "HIRE",
    "comments": "Strong problem-solving skills and good communication."
  }



