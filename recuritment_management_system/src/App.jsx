import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="grow ">
          <Routes>
            <Route path="/" element={<Home />} />
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
            <Route path="/support/helpcenter"  element={<HelpCenter/>}/>
            <Route path="/support/privacypolicy"  element={<PrivacyPolicy/>}/>
            <Route path="/support/termscondition"  element={<TermsConditions/>}/>
            <Route path="/login/candidate/forgot" element={<CandidateForgotPass/>}/>
            <Route path="/login/hr/forgot" element={<HrForgotPass/>}/>
            <Route path="/login/interviewer/forgot" element={<InterviewerForgotPass/>}/>
            <Route path="/login/admin/forgot" element={<AdminForgotPass/>}/>
          </Routes>
        </main>
        
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
