import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/nav/Home";
import About from "./pages/nav/About";
import Contact from "./pages/nav/Contact";
import Services from "./pages/nav/Services";
import HrLogin from "./pages/login/HrLogin";
import InterviewerLogin from "./pages/login/InterviewerLogin";
import CandidateLogin from "./pages/login/CandidateLogin";
import HrRegister from "./pages/register/HrRegister";
import InterviewerRegister from "./pages/register/InterviewerRegister";
import CandidateRegister from "./pages/register/CandidateRegister";
import HelpCenter from "./pages/support/HelpCenter";
import PrivacyPolicy from "./pages/support/PrivacyPolicy";
import TermsConditions from "./pages/support/TermsConditions";
import AdminLogin from "./pages/login/AdminLogin";
import CandidateForgotPass from "./pages/forgot/CandidateForgotPass";
import HrForgotPass from "./pages/forgot/HrForgotPass";
import InterviewerForgotPass from "./pages/forgot/InterviewerForgotPass";
import AdminForgotPass from "./pages/forgot/AdminForgotPass";
import ProtectedRoute from "./components/ProtectedRoute";


//  HR-Panel
import Layout from "./HR_panel/components/Layout";
import Dashboard from './HR_panel/pages/Dashboard';
import Jobposting from './HR_panel/pages/Jobposting';
import JobDetails from './HR_panel/pages/JobDetails';
import Applicants from './HR_panel/pages/Applicants';
import Interview from './HR_panel/pages/Interview';
import Profile from './HR_panel/pages/Profile';
import Notfound from './HR_panel/pages/Notfound';
import Sidebar from "./HR_panel/components/Sidebar";
import InterviewerSidebar from "./HR_panel/components/InterviewerSidebar";

// Interviewer Panel
import InterviewerDashboard from "./Interviewer_panel/pages/InterviewerDashboard";
import InterviewerApplications from "./Interviewer_panel/pages/InterviewerApplications";
import InterviewerInterviews from "./Interviewer_panel/pages/InterviewerInterviews";
import InterviewerProfile from "./Interviewer_panel/pages/InterviewerProfile";

// Import Candidate components
import CandidateLayout from "./Candidate_panel/components/CandidateLayout"; // Keep this name
import CandidateDashboard from "./Candidate_panel/pages/CandidateDashboard";
import CandidateJobs from './Candidate_panel/pages/CandidateJobs';
import CandidateApplications from './Candidate_panel/pages/CandidateApplications';
import CandidateInterviews from './Candidate_panel/pages/CandidateInterviews';
import CandidateProfile from './Candidate_panel/pages/CandidateProfile';
import CandidateJobDescription from "./Candidate_panel/pages/More_info_jobs/JobDescription";

const AppShell = () => {
  const location = useLocation();
  const hideGlobalFooter =
    location.pathname.startsWith("/hr") ||
    location.pathname.startsWith("/interviewer") ||
    location.pathname.startsWith("/candidate");

  const hideGlobalMenu =
    location.pathname.startsWith("/hr") ||
    location.pathname.startsWith("/interviewer") ||
    location.pathname.startsWith("/candidate");

  return (
    <div className="min-h-screen flex flex-col">
      {!hideGlobalMenu && <Navbar />}

      <main className="grow">
        <Routes>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
  
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/login/hr" element={<HrLogin />} />
          <Route path="/login/interviewer" element={<InterviewerLogin />} />
          <Route path="/login/candidate" element={<CandidateLogin />} />

          <Route path="/register/hr" element={<HrRegister />} />
          <Route path="/register/interviewer" element={<InterviewerRegister />} />
          <Route path="/register/candidate" element={<CandidateRegister />} />

          <Route path="/support/helpcenter" element={<HelpCenter />} />
          <Route path="/support/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/support/termscondition" element={<TermsConditions />} />

          <Route path="/login/candidate/forgot" element={<CandidateForgotPass />} />
          <Route path="/login/hr/forgot" element={<HrForgotPass />} />
          <Route path="/login/interviewer/forgot" element={<InterviewerForgotPass />} />
          <Route path="/login/admin/forgot" element={<AdminForgotPass />} />

          {/* HR Panel */}
          <Route path="/hr" element={<ProtectedRoute><Layout SidebarComponent={Sidebar} /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="jobs" element={<Jobposting />} />
            <Route path="job/:jobId" element={<JobDetails />} />
            <Route path="applicants" element={<Applicants />} />
            <Route path="interviews" element={<Interview />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Interviewer Panel */}
          <Route
            path="/interviewer"
            element={<ProtectedRoute><Layout SidebarComponent={InterviewerSidebar} /></ProtectedRoute>}
          >
            <Route index element={<InterviewerDashboard />} />
            <Route path="applicants" element={<InterviewerApplications />} />
            <Route path="interviews" element={<InterviewerInterviews />} />
            <Route path="profile" element={<InterviewerProfile />} />
          </Route>

          {/* Candidate Panel */}
          <Route path="/candidate" element={<ProtectedRoute><CandidateLayout /></ProtectedRoute>}>
            <Route index element={<CandidateDashboard />} />
            <Route path="dashboard" element={<CandidateDashboard />} />
            <Route path="jobs" element={<CandidateJobs />} />
            <Route path="job/:jobId" element={<CandidateJobDescription />} />
            <Route path="applications" element={<CandidateApplications />} />
            <Route path="interviews" element={<CandidateInterviews />} />
            <Route path="profile" element={<CandidateProfile />} />
          </Route>

          {/* 404 Page */}
          <Route path="*" element={<Notfound />} />
        </Routes>
      </main>

      {!hideGlobalFooter && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
};

export default App;
