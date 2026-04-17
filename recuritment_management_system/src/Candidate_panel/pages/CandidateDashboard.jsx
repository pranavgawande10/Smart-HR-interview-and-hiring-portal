import { useState, useEffect } from "react";
import JobCard from "../../Candidate_panel/components/Card";
import axios from "axios";

const CandidateDashboard = () => {
  const [stats, setStats] = useState({ applications: 0, interviews: 0 });
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [userName, setUserName] = useState("Candidate");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const config = {
          withCredentials: true,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        };

        // Get Name
        const userRes = await axios.get("http://localhost:3001/api/v1/candidates/current-user", config).catch(()=>null);
        if (userRes) setUserName(userRes.data.data.name);

        const appsRes = await axios.get("http://localhost:3001/api/v1/application/my-applications", config).catch(()=>({data:{count:0}}));
        const intsRes = await axios.get("http://localhost:3001/api/v1/candidates/my-interviews", config).catch(()=>({data:{count:0}}));

        setStats({
          applications: appsRes.data.count || 0,
          interviews: intsRes.data.count || 0,
        });
        const jobsRes = await axios.get("http://localhost:3001/api/v1/jobs/all-jobs").catch(()=>({data:{data:[]}}));
        const jobsArray = jobsRes.data.data || jobsRes.data; // Extract array from standard response
        const mappedJobs = jobsArray.slice(0, 4).map(job => ({
          _id: job._id,
          company: job.createdBy?.companyName || "Company",
          post: job.title,
          tag1: "Full Time",
          tag2: job.location,
          datePosted: new Date(job.createdAt || Date.now()).toLocaleDateString(),
          pay: "Competitive",
          location: job.location,
          brandLogo: "https://img.icons8.com/color/48/domain.png",
        }));
        setRecommendedJobs(mappedJobs);

      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboardData();
  }, []);

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
          Welcome back, {userName}! 
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
          <h3 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a" }}>{stats.applications}</h3>
        </div>
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          border: "1px solid #e2e8f0",
        }}>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "8px" }}>Interviews</p>
          <h3 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a" }}>{stats.interviews}</h3>
        </div>
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          border: "1px solid #e2e8f0",
        }}>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "8px" }}>Saved Jobs</p>
          <h3 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a" }}>0</h3>
        </div>
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          border: "1px solid #e2e8f0",
        }}>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "8px" }}>Profile Views</p>
          <h3 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a" }}>0</h3>
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
          {recommendedJobs.map((job) => (
            <JobCard key={job._id} {...job} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;