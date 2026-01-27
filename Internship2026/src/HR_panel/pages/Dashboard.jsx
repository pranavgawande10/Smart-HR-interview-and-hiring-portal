import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";

const Dashboard = () => {
  const [stats, setStats] = useState([
    { title: "Active Jobs", value: 12, change: "+20%", type: "up" },
    { title: "Total Applicants", value: 248, change: "+15%", type: "up" },
    { title: "Interviews Scheduled", value: 18, change: "+8%", type: "up" },
    { title: "Hired This Month", value: 7, change: "70%", type: "up" },
  ]);

  const [recentApplicants, setRecentApplicants] = useState([]);

  useEffect(() => {
    
    setTimeout(() => {
      setRecentApplicants([
        {
          name: "Sarah Johnson",
          role: "Frontend Developer",
          status: "Interview",
          date: "2024-01-15",
        },
        {
          name: "Michael Chen",
          role: "Product Manager",
          status: "Pending",
          date: "2024-01-14",
        },
        {
          name: "Emily Davis",
          role: "UX Designer",
          status: "Hired",
          date: "2024-01-13",
        },
      ]);
    }, 400);
  }, []);

  return (
    <Layout>
      <PageHeader
        title="Welcome back, Alex!"
        subtitle="Here's what's happening with your hiring pipeline today."
      />

      {/* Stats */}
      <div className="card-grid">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Applicants & Interviews */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "24px",
          marginTop: "32px",
        }}
      >
        {/* Recent Applicants */}
        <div className="table-card">
          <h3 style={{ marginBottom: "16px" }}>Recent Applicants</h3>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Status</th>
                <th>Applied</th>
              </tr>
            </thead>
            <tbody>
              {recentApplicants.map((app, index) => (
                <tr key={index}>
                  <td>{app.name}</td>
                  <td>{app.role}</td>
                  <td>
                    <span className={`badge ${app.status.toLowerCase()}`}>
                      {app.status}
                    </span>
                  </td>
                  <td>{app.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Upcoming Interviews */}
        <div className="card">
          <h3>Upcoming Interviews</h3>

          <InterviewItem
            name="Sarah Johnson"
            role="Frontend Developer"
            time="10:00 AM"
          />
          <InterviewItem
            name="Robert Brown"
            role="DevOps Engineer"
            time="2:00 PM"
          />
        </div>
      </div>
    </Layout>
  );
};



const StatCard = ({ title, value, change, type }) => {
  return (
    <div className="card">
      <h3>{title}</h3>
      <h2>{value}</h2>
      <p
        style={{
          marginTop: "10px",
          color: type === "up" ? "#16a34a" : "#dc2626",
          fontWeight: 600,
        }}
      >
        {type === "up" ? "↑" : "↓"} {change}
      </p>
    </div>
  );
};

const InterviewItem = ({ name, role, time }) => {
  return (
    <div
      style={{
        padding: "14px",
        marginTop: "16px",
        borderRadius: "12px",
        background: "#f8fafc",
        transition: "0.3s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#eef2ff")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#f8fafc")}
    >
      <h4>{name}</h4>
      <p style={{ fontSize: "13px", color: "#64748b" }}>{role}</p>
      <p style={{ marginTop: "6px", fontWeight: 600 }}>{time}</p>
    </div>
  );
};

export default Dashboard;
