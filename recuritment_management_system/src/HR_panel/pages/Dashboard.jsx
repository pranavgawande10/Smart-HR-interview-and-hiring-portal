import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [stats, setStats] = useState([
    { title: "Active Jobs", value: 12, change: "+20%", type: "up" },
    { title: "Total Applicants", value: 248, change: "+15%", type: "up" },
    { title: "Interviews Scheduled", value: 18, change: "+8%", type: "up" },
    { title: "Hired This Month", value: 7, change: "+70%", type: "up" },
  ]);

  const [recentApplicants, setRecentApplicants] = useState([]);

  const getAxiosConfig = () => ({
    withCredentials: true,
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchData = async () => {
    try {
      // Fetch Jobs
      const jobsRes = await axios.get("http://localhost:3000/job/myjobs", getAxiosConfig());
      const fetchedJobs = jobsRes.data;
      
      // Fetch Applications
      const appsPromises = fetchedJobs.map(job =>
        axios.get(`http://localhost:3001/api/v1/application/job/${job._id}`, getAxiosConfig())
          .then(res => res.data.applications.map(app => ({
            name: app.fullName,
            role: job.title, // display job title as role
            status: app.status === "applied" ? "Pending" : 
                    app.status === "shortlisted" ? "Shortlisted" : 
                    app.status === "interview" ? "Interview" : 
                    app.status === "selected" ? "Hired" : "Rejected",
            date: new Date(app.createdAt || Date.now()).toISOString().split('T')[0]
          })))
          .catch(() => [])
      );
      
      const appsArrays = await Promise.all(appsPromises);
      const allApps = appsArrays.flat();
      
      // Compute total hired
      const hiredCount = allApps.filter(a => a.status === "Hired").length;
      const interviewCount = allApps.filter(a => a.status === "Interview").length;

      setStats([
        { title: "Active Jobs", value: fetchedJobs.length, change: "Current", type: "up" },
        { title: "Total Applicants", value: allApps.length, change: "Total", type: "up" },
        { title: "Interviews Active", value: interviewCount, change: "Total", type: "up" },
        { title: "Total Hired", value: hiredCount, change: "Total", type: "up" },
      ]);

      setRecentApplicants(allApps.slice(0, 5)); // show latest 5
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{
        marginBottom: "30px",
        padding: "25px",
        background: "linear-gradient(135deg,  rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%)",
        borderRadius: "16px",
        color: "white",
        boxShadow: "0 4px 20px rgba(102, 126, 234, 0.3)"
      }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px", color: "white" }}>
          Welcome back, Alex!
        </h1>
        <p style={{ fontSize: "16px", opacity: "0.9", margin: "0", color: "rgba(255, 255, 255, 0.9)" }}>
          Here's what's happening with your hiring pipeline today.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
        marginBottom: "40px"
      }}>
        {stats.map((stat, index) => (
          <div key={index} style={{
            background: "white",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
            border: "1px solid #e2e8f0",
            transition: "transform 0.3s, box-shadow 0.3s"
          }}>
            <h3 style={{
              fontSize: "14px",
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "8px",
              fontWeight: "600"
            }}>
              {stat.title}
            </h3>
            <div style={{
              fontSize: "36px",
              fontWeight: "800",
              color: "#0f172a",
              marginBottom: "8px",
              lineHeight: "1"
            }}>
              {stat.value}
            </div>
            <div style={{
              fontSize: "14px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: stat.type === "up" ? "#10b981" : "#ef4444"
            }}>
              {stat.type === "up" ? "↑" : "↓"} {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
        {/* Recent Applicants */}
        <div style={{
          background: "white",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
          border: "1px solid #e2e8f0"
        }}>
          <h2 style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#0f172a",
            marginBottom: "20px",
            paddingBottom: "12px",
            borderBottom: "1px solid #e2e8f0"
          }}>
            Recent Applicants
          </h2>
          
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "#f8fafc" }}>
                <tr>
                  <th style={{
                    textAlign: "left",
                    padding: "12px 16px",
                    fontSize: "13px",
                    color: "#64748b",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    borderBottom: "2px solid #e2e8f0"
                  }}>Name</th>
                  <th style={{
                    textAlign: "left",
                    padding: "12px 16px",
                    fontSize: "13px",
                    color: "#64748b",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    borderBottom: "2px solid #e2e8f0"
                  }}>Position</th>
                  <th style={{
                    textAlign: "left",
                    padding: "12px 16px",
                    fontSize: "13px",
                    color: "#64748b",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    borderBottom: "2px solid #e2e8f0"
                  }}>Status</th>
                  <th style={{
                    textAlign: "left",
                    padding: "12px 16px",
                    fontSize: "13px",
                    color: "#64748b",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    borderBottom: "2px solid #e2e8f0"
                  }}>Applied</th>
                </tr>
              </thead>
              <tbody>
                {recentApplicants.length > 0 ? (
                  recentApplicants.map((app, index) => (
                    <tr key={index} style={{ transition: "background 0.3s" }}>
                      <td style={{ padding: "16px", borderBottom: "1px solid #e2e8f0", fontSize: "14px", color: "#334155" }}>
                        {app.name}
                      </td>
                      <td style={{ padding: "16px", borderBottom: "1px solid #e2e8f0", fontSize: "14px", color: "#334155" }}>
                        {app.role}
                      </td>
                      <td style={{ padding: "16px", borderBottom: "1px solid #e2e8f0", fontSize: "14px", color: "#334155" }}>
                        <span style={{
                          padding: "6px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.3px",
                          background: app.status === "Interview" ? "#dbeafe" : 
                                    app.status === "Pending" ? "#fef3c7" : "#dcfce7",
                          color: app.status === "Interview" ? "#1d4ed8" : 
                                app.status === "Pending" ? "#92400e" : "#166534"
                        }}>
                          {app.status}
                        </span>
                      </td>
                      <td style={{ padding: "16px", borderBottom: "1px solid #e2e8f0", fontSize: "14px", color: "#334155" }}>
                        {app.date}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", padding: "20px", color: "#94a3b8" }}>
                      Loading applicants...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Interviews */}
        
      </div>
    </div>
  );
};

export default Dashboard;