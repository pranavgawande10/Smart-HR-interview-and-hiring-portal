import { useEffect, useState } from "react";

const Dashboard = () => {
  const [stats, setStats] = useState([
    { title: "Active Jobs", value: 12, change: "+20%", type: "up" },
    { title: "Total Applicants", value: 248, change: "+15%", type: "up" },
    { title: "Interviews Scheduled", value: 18, change: "+8%", type: "up" },
    { title: "Hired This Month", value: 7, change: "+70%", type: "up" },
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
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{
        marginBottom: "30px",
        padding: "25px",
        background: "linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(13, 148, 136) 100%)",
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
            Upcoming Interviews
          </h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { name: "Sarah Johnson", role: "Frontend Developer", time: "10:00 AM" },
              { name: "Robert Brown", role: "DevOps Engineer", time: "2:00 PM" },
              { name: "Lisa Wang", role: "Backend Developer", time: "4:30 PM" }
            ].map((interview, index) => (
              <div key={index} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px",
                background: "#f8fafc",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                transition: "all 0.3s"
              }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a", marginBottom: "4px" }}>
                    {interview.name}
                  </h4>
                  <p style={{ fontSize: "13px", color: "#64748b", margin: "0" }}>
                    {interview.role}
                  </p>
                </div>
                <div style={{
                  background: "white",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#0f172a",
                  border: "1px solid #e2e8f0"
                }}>
                  {interview.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;