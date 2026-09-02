# Smart HR Interview and Hiring Portal

A comprehensive, modern Recruitment Management System (RMS) designed to streamline the hiring process for Candidates, HR Professionals, and Interviewers. This platform offers a seamless experience with role-based access control, an interactive dashboard, and a premium Glassmorphism UI.

---

## 🌟 Key Features

### 🔐 Authentication & Authorization
- **Role-Based Access Control (RBAC):** Distinct dashboards and permissions for `CANDIDATE`, `HR`, and `INTERVIEWER`.
- **Secure Login/Registration:** Powered by JSON Web Tokens (JWT) stored securely in HTTP-only cookies and bcrypt password hashing.
- **Password Management:** Forgot password and secure password reset workflows.

### 👤 Candidate Portal (Modern Glassmorphism UI)
- **Interactive Dashboard:** View real-time statistics on applications, upcoming interviews, and recommended jobs.
- **Job Browser:** Browse open positions, view detailed job descriptions, and apply seamlessly via a beautiful animated modal.
- **Profile Management:**
  - Dynamic **Skills Dropdown** with over 100+ predefined skills and custom entry support.
  - Upload and manage profile photos using Cloudinary.
  - Track experience years, email, and personal details.
- **Application Tracking:** Monitor the real-time status of job applications (e.g., Pending, Shortlisted, Rejected).
- **Interview Management:** View scheduled interviews, accept them, or request a reschedule directly from the panel.

### 🏢 HR & Recruiter Portal
- **Job Management:** Post, edit, and manage job listings.
- **Applicant Tracking:** Review candidate profiles, download resumes, and update application statuses.
- **Interview Scheduling:** Assign interviewers to candidates and schedule interview slots.

### 🎤 Interviewer Portal
- **Schedule Overview:** View a calendar/list of assigned upcoming interviews.
- **Candidate Evaluation:** Review candidate resumes and submit structured interview feedback.

---

## 🛠️ Technology Stack

### Frontend (Client)
- **Framework:** React 19 + Vite
- **Routing:** React Router v7
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion (for premium enter/exit transitions and hover effects)
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Architecture:** Component-based, responsive Glassmorphism design system

### Backend (Server)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB via Mongoose (ODM)
- **Authentication:** jsonwebtoken (JWT) + bcrypt
- **File Uploads:** Multer (Local temp storage) + Cloudinary (Cloud storage for resumes & profile photos)
- **Email Services:** Nodemailer + Mailgen (for verification & notifications)
- **CORS & Security:** cookie-parser, cors

---

## 📂 Project Structure

```text
📦 Smart HR Interview and hiring portal
 ┣ 📂 Backend                 # Node.js + Express backend
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 controller          # Request handlers (candidate, hr, job, etc.)
 ┃ ┃ ┣ 📂 db                  # Database connection setup
 ┃ ┃ ┣ 📂 middleware          # Auth (JWT), role checking, file upload (Multer)
 ┃ ┃ ┣ 📂 models              # Mongoose schemas (User, Job, Application, Interview)
 ┃ ┃ ┣ 📂 routes              # API route definitions
 ┃ ┃ ┗ 📂 utils               # Cloudinary setup, async handler, custom error/response classes
 ┃ ┣ 📜 app.js                # Express app configuration
 ┃ ┣ 📜 index.js              # Server entry point
 ┃ ┗ 📜 .env                  # Backend environment variables
 ┃
 ┣ 📂 src                     # React Frontend source code
 ┃ ┣ 📂 Candidate_panel       # Candidate-specific components & pages
 ┃ ┣ 📂 components            # Reusable UI components (Cards, Footers)
 ┃ ┣ 📂 constants             # Global constants (e.g., SKILLS_LIST)
 ┃ ┣ 📜 App.jsx               # Main React router setup
 ┃ ┗ 📜 index.css             # Tailwind config and custom Glassmorphism utilities
 ┃
 ┣ 📜 package.json            # Frontend dependencies & Vite scripts
 ┗ 📜 vite.config.js          # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your local machine:
- **Node.js** (v18 or higher recommended)
- **MongoDB** (Local instance or MongoDB Atlas URI)
- **Cloudinary Account** (For image/resume uploads)

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd "Smart HR Interview and hiring portal"
```

### 2. Backend Setup
Navigate to the Backend directory and install dependencies:
```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` directory and add your credentials:
```env
PORT=3001
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your_jwt_secret_key

# Cloudinary Setup for File Uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend server (runs on `nodemon` for development):
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal, navigate to the root directory, and install dependencies:
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend API will run at `http://localhost:3001`.

---

## 🎨 UI/UX Design System
The frontend utilizes a modern **Glassmorphism** design language.
- Custom `.glass-card` classes are defined in `index.css` utilizing `backdrop-blur` and semi-transparent `rgba` backgrounds.
- High-performance, staggered micro-animations are built deeply into the candidate workflows using `framer-motion` to provide a highly interactive and premium feel.


