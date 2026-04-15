import { Routes, Route } from 'react-router-dom';
import HRLayout from './HR_panel/components/Layout';        
import Dashboard from './HR_panel/pages/Dashboard';
import Jobposting from './HR_panel/pages/Jobposting';
import JobDetails from './HR_panel/pages/JobDetails';
import Applicants from './HR_panel/pages/Applicants';
import Interview from './HR_panel/pages/Interview';
import Profile from './HR_panel/pages/Profile';
import Notfound from './HR_panel/pages/Notfound';


// Import Candidate components
import CandidateLayout from './Candidate_panel/components/CandidateLayout';  
import CandidateDashboard from './Candidate_panel/pages/Candidatedashboard';
import CandidateJobs from './Candidate_panel/pages/CandidateJobs';
import CandidateApplications from './Candidate_panel/pages/CandidateApplications';
import CandidateInterviews from './Candidate_panel/pages/CandidateInterviews';
import CandidateProfile from './Candidate_panel/pages/CandidateProfile';

// Interviewer imports
import InterviewerLayout from './Interviewer_panel/components/InterviewerLayout';
import InterviewerDashboard from './Interviewer_panel/pages/InterviewerDashboard';
import InterviewerApplications from './Interviewer_panel/pages/InterviewerApplications';
import InterviewerInterviews from './Interviewer_panel/pages/InterviewerInterviews';
import InterviewerProfile from './Interviewer_panel/pages/InterviewerProfile';




function App() {
  return (
    <Routes>
      {/* HR Panel Routes - use HRLayout */}
      <Route path="/" element={<HRLayout />}>  
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="jobs" element={<Jobposting />} />
         <Route path="job/:jobId" element={<JobDetails />} />
        <Route path="applicants" element={<Applicants />} />
        <Route path="interviews" element={<Interview />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Candidate Panel Routes - use CandidateLayout */}
      <Route path="/candidate" element={<CandidateLayout />}>
        <Route index element={<CandidateDashboard />} />
        <Route path="dashboard" element={<CandidateDashboard />} />
        <Route path="jobs" element={<CandidateJobs />} />
        <Route path="applications" element={<CandidateApplications />} />
        <Route path="interviews" element={<CandidateInterviews />} />
        <Route path="profile" element={<CandidateProfile />} />
      </Route>
      
          {/* Interviewer Panel Routes */}
      <Route path="/interviewer" element={<InterviewerLayout />}>
        <Route index element={<InterviewerDashboard />} />
        <Route path="dashboard" element={<InterviewerDashboard />} />
        <Route path="applications" element={<InterviewerApplications />} />
        <Route path="interviews" element={<InterviewerInterviews />} />
        <Route path="profile" element={<InterviewerProfile />} />
      </Route>
     

      {/* 404 Page */}
      <Route path="*" element={<Notfound />} />
    </Routes>
  );
}

export default App;