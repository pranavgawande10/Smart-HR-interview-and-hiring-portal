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

- This module handles interview scheduling, interviewer dashboards, and interview feedback for a hiring platform.
📌 Features

- Schedule interviews for candidates

- Fetch all interviews assigned to an interviewer

- Submit structured interview feedback

- Role-based secure access using authentication

- MongoDB relationships using references and population

🧱 Models
1️⃣ Interview Model (src -> models ->interview.js)

# Represents an interview scheduled for a candidate.

- Fields:

- candidateId → Reference to User (Candidate)

- interviewerId → Reference to User (Interviewer)

- jobId → Reference to Job

- round → TECHNICAL | MANAGERIAL | HR

- scheduledAt → Interview date & time

- meetingLink → Online meeting link

- status → SCHEDULED | COMPLETED | NO_SHOW

- timestamps → Created & Updated time

2️⃣ Interview Feedback Model (src -> models -> interviewFeedback.js)

# Stores feedback submitted by the interviewer.

- Fields:

- interviewId → Reference to Interview

- interviewerId → Reference to User

- technicalScore → Numeric rating

- communication → Numeric rating

- problemSolving → Numeric rating

- recommendation → HIRE | HOLD | REJECT

- comments → Text feedback

- timestamps


🔐 Authentication

- All interviewer routes are protected using the userAuth middleware.

- req.user._id is used to identify the logged-in interviewer.

- Only authenticated interviewers can view interviews and submit feedback.


🚀 API Endpoints (src -> routers -> interviewers.js)
1️⃣ Create Interview (Testing Only) 
   [POST /interview/create-test]
   Description: Creates an interview entry (used for testing).

2️⃣ Get Interviews for Interviewer
   [GET /interviewer/interviews]
   Description: Fetches all interviews assigned to the logged-in interviewer.

3️⃣ Submit Interview Feedback
   [POST /interviewer/feedback]
   Description: interviewer is able to give the feedback 
( 
  "technicalScore": 8,
  "communication": 7,
  "problemSolving": 9,
  "recommendation": "HIRE",
  "comments": "Strong problem-solving skills and good communication."
)

✅ Notes

- populate() is used to fetch related job and candidate details.

- Feedback is always linked to an interview and interviewer.

- The create-test route should be removed or protected in production.
