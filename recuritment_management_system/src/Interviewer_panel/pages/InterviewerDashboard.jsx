import { useState, useEffect } from "react";
import { Calendar, Clock, Users, CheckCircle, Video, TrendingUp, UserCheck, CheckSquare, List } from "lucide-react";
import axios from "axios";

const InterviewerDashboard = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gradient aligning with HR dashboard requirements
  const gradient = "linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%)";
  const currentInterviewer = localStorage.getItem("userName") || "Interviewer";

  const getAxiosConfig = () => ({
    withCredentials: true,
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/v1/interviewer/my-interviews", getAxiosConfig());
        setInterviews(res.data.interviews || []);
      } catch (err) {
        console.error("Dashboard Fetch Error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const totalAssigned = interviews.length;
  const scheduled = interviews.filter(i => i.status === "SCHEDULED").length;
  const completed = interviews.filter(i => i.status === "COMPLETED").length;
  // Let's assume pending feedback means they are scheduled but dates have passed, or simply anything not COMPLETED.
  // Actually, wait, if they have result/feedback already it's completed.
  // Let's consider pending feedback as any interview that is SCHEDULED and in the past, but we will just map logically.
  const now = new Date();
  const pendingFeedback = interviews.filter(i => i.status === "SCHEDULED" && new Date(i.scheduledAt) < now).length;

  const todaysSchedule = interviews
    .filter(i => i.status === "SCHEDULED" && new Date(i.scheduledAt).toDateString() === now.toDateString())
    .map(i => ({
      id: i._id,
      candidateName: i.candidate?.name || "Unknown",
      position: i.job?.title || "Role",
      roundName: `Round ${i.roundNumber}${i.isFinalRound ? ' (Final)' : ''}`,
      time: new Date(i.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " — 30 min",
      type: i.mode || "Online",
      status: "Scheduled"
    }));
  
  const recentCompleted = interviews
    .filter(i => i.status === "COMPLETED")
    .sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .map(i => ({
      id: i._id,
      candidateName: i.candidate?.name || "Unknown",
      position: i.job?.title || "Role",
      roundName: `Round ${i.roundNumber}`,
      date: new Date(i.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      resultBadge: { 
        text: i.result || "Pass", 
        color: i.result === "PASS" ? "#166534" : "#991b1b", 
        bg: i.result === "PASS" ? "#dcfce7" : "#fee2e2" 
      }
    }));

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f8fafc" }}>
        <p style={{ color: "#64748b" }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto", minHeight: "100vh" }}>
      
      {/* Welcome Header */}
      <div style={{
        marginBottom: "30px",
        padding: "25px",
        background: gradient,
        borderRadius: "16px",
        color: "white",
        boxShadow: "0 4px 20px rgba(20, 184, 166, 0.3)"
      }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px", color: "white" }}>
          Good morning, {currentInterviewer.split(' ')[0]}! 👋
        </h1>
        <p style={{ fontSize: "16px", opacity: "0.9", margin: "0", color: "rgba(255, 255, 255, 0.9)" }}>
          Here's what's happening with your interviews today.
        </p>
      </div>

      {/* 4 Summary Stat Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "20px",
        marginBottom: "35px"
      }}>
        <div style={{ background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <p style={{ color: "#64748b", margin: 0, fontSize: "14px", fontWeight: "600", textTransform: "uppercase" }}>Total Assigned</p>
            <Users size={20} color="#3b82f6" />
          </div>
          <h3 style={{ fontSize: "32px", fontWeight: "800", color: "#0f172a", margin: 0 }}>{totalAssigned}</h3>
        </div>
        
        <div style={{ background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <p style={{ color: "#64748b", margin: 0, fontSize: "14px", fontWeight: "600", textTransform: "uppercase" }}>Scheduled</p>
            <Calendar size={20} color="#20b8a6" />
          </div>
          <h3 style={{ fontSize: "32px", fontWeight: "800", color: "#0f172a", margin: 0 }}>{scheduled}</h3>
        </div>

        <div style={{ background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <p style={{ color: "#64748b", margin: 0, fontSize: "14px", fontWeight: "600", textTransform: "uppercase" }}>Completed</p>
            <CheckCircle size={20} color="#10b981" />
          </div>
          <h3 style={{ fontSize: "32px", fontWeight: "800", color: "#0f172a", margin: 0 }}>{completed}</h3>
        </div>

        <div style={{ background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <p style={{ color: "#64748b", margin: 0, fontSize: "14px", fontWeight: "600", textTransform: "uppercase" }}>Pending Feedback</p>
            <CheckSquare size={20} color="#f59e0b" />
          </div>
          <h3 style={{ fontSize: "32px", fontWeight: "800", color: "#0f172a", margin: 0 }}>{pendingFeedback}</h3>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "30px" }}>
        
        {/* Today's Schedule Section */}
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "20px", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px" }}>
            Today's Schedule
          </h2>
          {todaysSchedule.length === 0 ? (
            <div style={{ background: "white", padding: "30px", borderRadius: "12px", border: "1px solid #e2e8f0", textAlign: "center", color: "#64748b" }}>
              <Calendar size={40} style={{ opacity: 0.5, marginBottom: "10px" }} />
              <p style={{ margin: 0 }}>No interviews scheduled for today.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px" }}>
              {todaysSchedule.map((interview) => (
                <div key={interview.id} style={{
                  background: "white", borderRadius: "12px", padding: "20px", 
                  border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  display: "flex", alignItems: "flex-start", gap: "15px"
                }}>
                  <div style={{ background: "#f0fdfa", padding: "12px", borderRadius: "12px", textAlign: "center", minWidth: "140px", border: "1px solid #ccfbf1", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    <Clock size={16} color="#0d9488" style={{ marginBottom: "6px" }} />
                    <div style={{ color: "#0d9488", fontWeight: "700", fontSize: "13px", whiteSpace: "nowrap" }}>{interview.time}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                       <h4 style={{ margin: "0", fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>{interview.candidateName}</h4>
                       <span style={{ background: "#dbeafe", color: "#2563eb", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }}>{interview.status}</span>
                    </div>
                    <p style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#64748b", fontWeight: "500" }}>{interview.position}</p>
                    <div style={{ display: "flex", gap: "10px" }}>
                       <span style={{ background: "#e0f2fe", color: "#0284c7", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                         <List size={12} /> {interview.roundName}
                       </span>
                       <span style={{ background: "#f1f5f9", color: "#475569", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                         <Video size={12} /> Mode: {interview.type}
                       </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div style={{ marginTop: "10px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "20px", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px" }}>
            Recent Activity
          </h2>
          {recentCompleted.length === 0 ? (
            <div style={{ background: "white", padding: "30px", borderRadius: "12px", border: "1px solid #e2e8f0", textAlign: "center", color: "#64748b" }}>
              <TrendingUp size={40} style={{ opacity: 0.5, marginBottom: "10px" }} />
              <p style={{ margin: 0 }}>No recent completed interviews with feedback.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "15px" }}>
              {recentCompleted.slice(0, 5).map(interview => (
                <div key={interview.id} style={{
                  background: "white", padding: "16px 20px", borderRadius: "12px",
                  border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#f1f5f9", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "600", color: "#64748b" }}>
                      {interview.candidateName.charAt(0)}
                    </div>
                    <div>
                      <h4 style={{ margin: "0 0 4px 0", fontSize: "15px", fontWeight: "600", color: "#0f172a" }}>{interview.candidateName}</h4>
                      <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>Conducted on {interview.date} for {interview.position} • {interview.roundName}</p>
                    </div>
                  </div>
                  <div>
                     <span style={{ background: interview.resultBadge.bg, color: interview.resultBadge.color, padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
                       {interview.resultBadge.text}
                     </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default InterviewerDashboard;