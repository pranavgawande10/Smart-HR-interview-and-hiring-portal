import { Routes, Route } from 'react-router-dom';
import HRLayout from './HR_panel/components/Layout';        // Rename this
import Dashboard from './HR_panel/pages/Dashboard';
import Jobposting from './HR_panel/pages/Jobposting';
import JobDetails from './HR_panel/pages/JobDetails';
import Applicants from './HR_panel/pages/Applicants';
import Interview from './HR_panel/pages/Interview';
import Profile from './HR_panel/pages/Profile';
import Notfound from './HR_panel/pages/Notfound';

// Import Candidate components
import CandidateLayout from './Candidate_panel/components/CandidateLayout';  // Keep this name
import CandidateDashboard from './Candidate_panel/pages/Candidatedashboard';
import CandidateJobs from './Candidate_panel/pages/CandidateJobs';
import CandidateApplications from './Candidate_panel/pages/CandidateApplications';
import CandidateInterviews from './Candidate_panel/pages/CandidateInterviews';
import CandidateProfile from './Candidate_panel/pages/CandidateProfile';

function App() {
  return (
    <Routes>
      {/* HR Panel Routes - use HRLayout */}
      <Route path="/" element={<HRLayout />}>  {/* Changed from Layout to HRLayout */}
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
      
      {/* 404 Page */}
      <Route path="*" element={<Notfound />} />
    </Routes>
  );
}

export default App;