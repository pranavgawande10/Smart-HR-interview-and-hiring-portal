# Smart HR Interview and Hiring Portal - Backend

This is the backend server for the **Smart HR Interview and Hiring Portal**, built with **Node.js, Express, and MongoDB**. It provides robust RESTful APIs to handle authentication, job management, scheduling interviews, and managing user profiles across different roles (like HR and Interviewers).

## 🚀 Technologies Used
* **Node.js & Express.js:** The core framework for building the server and routing.
* **MongoDB & Mongoose:** NoSQL database infrastructure and object data modeling.
* **JWT (JSON Web Tokens):** For secure, stateless cookie-based user authentication.
* **Bcrypt:** For securely hashing user passwords before database storage.
* **Nodemailer:** To dispatch automated emails (e.g., password reset links).
* **Dotenv:** Managing sensitive environment variables.
* **Cors & Cookie-Parser:** Handling cross-origin requests from the React frontend and securely parsing authentication cookies.

## 📁 Folder Structure
```text
server/
│
├── src/
│   ├── config/          # Database configuration and connection logic
│   ├── middlewares/     # Custom middlewares (e.g., JWT Auth, Role Authorization)
│   ├── models/          # Mongoose DB Schemas (User, Job, Interview, InterviewFeedback)
│   ├── routers/         # Express Route Handlers (Auth, Job, Profile, Interviewer)
│   ├── utils/           # Utility functions (Nodemailer config, Validation logic)
│   └── app.js           # Application entry point & Express configuration
│
├── .env                 # Environment variables (secret keys, DB connection strings)
├── package.json         # Project dependencies and npm scripts
└── readme.md            # Backend documentation
```

## ⚙️ Environment Configuration (`.env`)
To run this project locally, you need to set up a `.env` file in the root of the `server/` directory with the following keys:
```env
PORT=3000
CLIENT_URI=http://localhost:5173      # Your frontend URL (Vite default)
JWT_SECRET=your_super_secret_jwt_key
RESET_PASSWORD_URL=http://localhost:5173/reset-password
# Add your MongoDB connection string inside your config or .env as well
```

## 🔌 API Endpoints Overview

### Authentication (`/routers/auth.js`)
Handles secure access for the whole platform:
* `POST /signup`: Register a new user (HR, Interviewer, Candidate).
* `POST /login`: Authenticates user and issues a JWT HTTP-Only cookie.
* `POST /logout`: Clears the authentication cookie.
* `POST /forgotpassword`: Sends a JWT-signed password reset link via Nodemailer.
* `POST /resetpassword`: Accepts the token and new password to update DB credentials.

### Job Management (`/routers/job.js`)
*Requires HR Role Authorization*
* `POST /job/create`: Create a new job posting.
* `GET /job/myjobs`: Fetch a list of jobs created by the logged-in HR.
* `PATCH /job/update/:id`: Update an existing job (requires ownership).
* `DELETE /job/delete/:id`: Delete a job posting (requires ownership).

### Profile Operations (`/routers/profile.js`)
* `GET /profile`: View user profile data.
* `PATCH /profile/edit`: Allows updating user-specific information.

### Interviews & Feedback (`/routers/interviewer.js`)
APIs specific to managing interviews and leaving localized interview feedback for candidates.

## 🛠️ How to Run Locally

**1. Clone the repository and navigate to the backend directory:**
```bash
cd server
```

**2. Install all dependencies:**
```bash
npm install
```

**3. Start the Development Server:**
Using `nodemon` (auto-reloads on file changes):
```bash
npm run dev
```

Or using standard Node:
```bash
npm start
```
The server will now be listening successfully at `http://localhost:3000`.

## 🛡️ Security Implementations
* **Password Hashing:** Plain-text passwords never touch the database.
* **HTTP-Only Cookies:** JWT tokens are secured against Cross-Site Scripting (XSS) via `httpOnly` flags.
* **Role-Based Access Control (RBAC):** Distinct middlewares strictly verify permissions before resolving endpoints (e.g., checking if `req.user.role === 'HR'`).
