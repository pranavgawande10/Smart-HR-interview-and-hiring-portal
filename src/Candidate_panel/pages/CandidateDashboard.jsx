import { useState } from "react";
import JobCard from "../../Candidate_panel/components/Card"; 

const CandidateDashboard = () => {
  const [savedJobs, setSavedJobs] = useState([]);

  const recommendedJobs = [
    {
      company: "Google",
      post: "Software Engineer",
      tag1: "Full Time",
      tag2: "Remote",
      datePosted: "2 days ago",
      pay: "4,500/hour",
      location: "Mumbai, India",
      brandLogo: "https://img.icons8.com/color/48/google-logo.png",
    },
    {
      company: "Amazon",
      post: "Backend Developer",
      tag1: "Full Time",
      tag2: "Hybrid",
      datePosted: "1 day ago",
      pay: "5,000/hour",
      location: "Hyderabad, India",
      brandLogo: "https://img.icons8.com/color/48/amazon.png",
    },
    {
      company: "Microsoft",
      post: "Frontend Developer",
      tag1: "Full Time",
      tag2: "Remote",
      datePosted: "3 days ago",
      pay: "4,800/hour",
      location: "Bangalore, India",
      brandLogo: "https://img.icons8.com/color/48/microsoft.png",
    },
    {
      company: "TCS",
      post: "React Developer",
      tag1: "Contract",
      tag2: "On-site",
      datePosted: "5 days ago",
      pay: "3,500/hour",
      location: "Pune, India",
      brandLogo: "https://img.icons8.com/color/48/tata-consultancy-services.png",
    },
  ];

  return (
    <div>
      {/* Welcome Section */}
      <div style={{
        background: "linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%)",
        borderRadius: "16px",
        padding: "30px",
        color: "white",
        marginBottom: "30px",
      }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "10px" }}>
          Welcome back, Candidate! 
        </h1>
        <p style={{ fontSize: "16px", opacity: "0.9" }}>
          Here are your recommended jobs based on your profile.
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
        marginBottom: "30px",
      }}>
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          border: "1px solid #e2e8f0",
        }}>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "8px" }}>Applications</p>
          <h3 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a" }}>12</h3>
        </div>
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          border: "1px solid #e2e8f0",
        }}>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "8px" }}>Interviews</p>
          <h3 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a" }}>4</h3>
        </div>
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          border: "1px solid #e2e8f0",
        }}>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "8px" }}>Saved Jobs</p>
          <h3 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a" }}>8</h3>
        </div>
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          border: "1px solid #e2e8f0",
        }}>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "8px" }}>Profile Views</p>
          <h3 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a" }}>45</h3>
        </div>
      </div>

      {/* Recommended Jobs Section - Same Cards as HR Panel */}
      <div style={{ marginBottom: "40px" }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "20px" 
        }}>
          <h2 style={{ fontSize: "22px", fontWeight: "600", color: "#0f172a" }}>
            Recommended Jobs For You
          </h2>
          <a href="/candidate/jobs" style={{ color: "#8b5cf6", textDecoration: "none" }}>
            View All →
          </a>
        </div>
        
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "20px",
        }}>
          {recommendedJobs.map((job, index) => (
            <JobCard key={index} {...job} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;