import { useState, useEffect } from "react";
import { 
  Calendar, Clock, Users, CheckCircle, XCircle, Video, List, User, 
  ChevronRight, TrendingUp, ChevronDown, FileText, Star, Award
} from "lucide-react";

const Interview = () => {
  const [interviews, setInterviews] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("hrInterviews") || "[]");
    
    // Fallback dummy data if no interviews exist
    if (saved.length === 0) {
      const dummyData = [
        {
          id: 1,
          candidateName: "Sarah Johnson",
          position: "Frontend Developer",
          date: "Oct 25, 2024",
          time: "10:00 AM",
          interviewers: ["John Doe (Tech Lead)"],
          roundName: "Technical Round",
          status: "Scheduled",
          link: "https://meet.google.com/abc-defg-hij"
        },
        {
          id: 2,
          candidateName: "Priya Sharma",
          position: "Product Manager",
          date: "Oct 18, 2024",
          time: "11:30 AM",
          interviewers: ["Sarah Wilson"],
          roundName: "Final Round",
          status: "Completed",
          submittedFeedback: {
            rating: 5,
            technicalSkills: "Excellent product sense and architecture design.",
            communicationSkills: "Very clear articulation of past experiences.",
            overallFeedback: "Strong candidate, fits the role perfectly.",
            result: "Selected"
          }
        },
        {
          id: 3,
          candidateName: "Michael Chen",
          position: "Backend Developer",
          date: "Oct 26, 2024",
          time: "2:00 PM",
          interviewers: ["Jane Smith (HR)"],
          roundName: "HR Round",
          status: "Scheduled",
          link: "https://meet.google.com/xyz-abcd-efg"
        }
      ];
      setInterviews(dummyData);
      localStorage.setItem("hrInterviews", JSON.stringify(dummyData));
    } else {
      setInterviews(saved);
    }

    // Optional listener if interviewing happens in real-time
    const handleStorage = () => {
      const updated = JSON.parse(localStorage.getItem("hrInterviews") || "[]");
      if (updated.length > 0) setInterviews(updated);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const updateStatus = (id, newStatus) => {
    const updated = interviews.map(i => i.id === id ? { ...i, status: newStatus } : i);
    setInterviews(updated);
    localStorage.setItem("hrInterviews", JSON.stringify(updated));
  };

  const getStatusBadge = (status) => {
    const s = status ? status.toLowerCase() : "scheduled";
    // Blue, Green, Purple, Gold mapping as requested
    if (s === "scheduled") return <span style={{ background: "#dbeafe", color: "#2563eb", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>Scheduled</span>;
    if (s === "completed") return <span style={{ background: "#d1fae5", color: "#059669", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>Completed</span>;
    if (s === "final") return <span style={{ background: "#f3e8ff", color: "#7e22ce", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>Final</span>;
    if (s === "hired") return <span style={{ background: "#fef08a", color: "#854d0e", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>Hired</span>;
    
    // Fallbacks just in case
    if (s === "cancelled") return <span style={{ background: "#fee2e2", color: "#dc2626", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>Cancelled</span>;
    return <span style={{ background: "#f1f5f9", color: "#475569", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>{status}</span>;
  };

  const handleJoinMeeting = (link) => {
    if (link) window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleViewDetails = (interview) => {
    setSelectedInterview(interview);
  };

  const upcomingInterviews = interviews.filter(i => (i.status || "").toLowerCase() === "scheduled");
  const pastInterviews = interviews.filter(i => (i.status || "").toLowerCase() !== "scheduled");

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      
      {/* 1. Page Heading */}
      <div style={{
        marginBottom: "30px",
        padding: "25px",
        background: "linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%)",
        borderRadius: "16px",
        color: "white",
        boxShadow: "0 4px 20px rgba(20, 184, 166, 0.3)"
      }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px", color: "white" }}>
          Interviews Dashboard
        </h1>
        <p style={{ fontSize: "16px", opacity: "0.9", margin: "0", color: "rgba(255, 255, 255, 0.9)" }}>
          Manage your scheduled meetings, change statuses, and review feedback.
        </p>
      </div>

      {/* 2. Top Summary Stat Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "24px",
        marginBottom: "40px"
      }}>
        <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" }}>
          <p style={{ color: "#64748b", fontSize: "14px", fontWeight: "600", textTransform: "uppercase", marginBottom: "8px", letterSpacing: "0.5px" }}>Total Interviews</p>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <h3 style={{ fontSize: "36px", fontWeight: "800", color: "#0f172a", margin: 0 }}>{interviews.length}</h3>
          </div>
        </div>

        <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" }}>
          <p style={{ color: "#64748b", fontSize: "14px", fontWeight: "600", textTransform: "uppercase", marginBottom: "8px", letterSpacing: "0.5px" }}>Scheduled</p>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <h3 style={{ fontSize: "36px", fontWeight: "800", color: "#3b82f6", margin: 0 }}>{upcomingInterviews.length}</h3>
            <span style={{ color: "#64748b", fontSize: "14px", fontWeight: "500" }}>Upcoming</span>
          </div>
        </div>

        <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" }}>
          <p style={{ color: "#64748b", fontSize: "14px", fontWeight: "600", textTransform: "uppercase", marginBottom: "8px", letterSpacing: "0.5px" }}>Completed & Beyond</p>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <h3 style={{ fontSize: "36px", fontWeight: "800", color: "#10b981", margin: 0 }}>{pastInterviews.length}</h3>
            <span style={{ color: "#10b981", fontSize: "14px", fontWeight: "600" }}>Tracked</span>
          </div>
        </div>
      </div>

      {/* Helper to render an Interview Card */}
      {(() => {
        const renderCard = (interview) => (
          <div key={interview.id} style={{
            background: "white", borderRadius: "16px", padding: "24px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0",
            display: "flex", flexDirection: "column", justifyContent: "space-between"
          }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px 0" }}>{interview.candidateName}</h3>
                  <p style={{ margin: 0, fontSize: "14px", color: "#64748b", fontWeight: "500" }}>{interview.position}</p>
                </div>
                {getStatusBadge(interview.status || "Scheduled")}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#475569" }}>
                  <Calendar size={18} color="#94a3b8" />
                  <span>{interview.date} {interview.time && `at ${interview.time}`}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#475569" }}>
                  <User size={18} color="#94a3b8" />
                  <span>{(interview.interviewers || []).join(", ") || interview.interviewer || "Unassigned"}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#475569" }}>
                  <List size={18} color="#94a3b8" />
                  <span style={{ fontWeight: "500", color: "#0f172a" }}>{interview.roundName || "General Round"}</span>
                </div>
                
                {/* Instant Status Dropdown for HR */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#0f172a", marginTop: "4px" }}>
                  <Award size={18} color="#20b8a6" />
                  <div style={{ position: "relative", flex: 1 }}>
                    <select 
                      value={interview.status || "Scheduled"}
                      onChange={(e) => updateStatus(interview.id, e.target.value)}
                      style={{ 
                        width: "100%", padding: "6px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", 
                        fontSize: "13px", fontWeight: "600", color: "#334155", appearance: "none", cursor: "pointer", background: "white" 
                      }}
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                      <option value="Final">Final</option>
                      <option value="Hired">Hired</option>
                    </select>
                    <ChevronDown size={14} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#64748b" }} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", borderTop: "1px solid #f1f5f9", paddingTop: "20px" }}>
              {interview.link && (
                <button 
                  onClick={() => handleJoinMeeting(interview.link)}
                  style={{
                    flex: 1, padding: "10px 0", background: "linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%)",
                    color: "white", border: "none", borderRadius: "8px", fontWeight: "600", fontSize: "14px",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px"
                  }}
                >
                  <Video size={16} /> Join
                </button>
              )}
              <button 
                onClick={() => handleViewDetails(interview)}
                style={{
                  flex: 1, padding: "10px 0", background: "white", color: "#475569", 
                  border: "1px solid #cbd5e1", borderRadius: "8px", fontWeight: "600", fontSize: "14px",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px"
                }}
              >
                View Details <ChevronRight size={16} />
              </button>
            </div>
          </div>
        );

        return (
          <>
            {/* Upcoming Interviews */}
            <div style={{ marginBottom: "50px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "20px", paddingBottom: "10px", borderBottom: "2px solid #e2e8f0" }}>
                Upcoming Interviews
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "20px" }}>
                {upcomingInterviews.length === 0 ? <p style={{ color: "#64748b" }}>No upcoming interviews scheduled.</p> : upcomingInterviews.map(renderCard)}
              </div>
            </div>

            {/* Past/Updated Interviews */}
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "20px", paddingBottom: "10px", borderBottom: "2px solid #e2e8f0" }}>
                Past / Updated States
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "20px" }}>
                {pastInterviews.length === 0 ? <p style={{ color: "#64748b" }}>No historical interviews tracked yet.</p> : pastInterviews.map(renderCard)}
              </div>
            </div>
          </>
        );
      })()}

      {/* Details Modal */}
      {selectedInterview && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
          display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "20px"
        }} onClick={() => setSelectedInterview(null)}>
          <div style={{ background: "white", borderRadius: "24px", width: "550px", maxWidth: "90%", maxHeight: "85vh", overflowY: "auto", padding: "30px" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #f1f5f9", paddingBottom: "20px" }}>
              <div>
                <h2 style={{ fontSize: "24px", fontWeight: "700", margin: "0 0 8px 0" }}>{selectedInterview.candidateName}</h2>
                <p style={{ color: "#64748b", margin: 0, fontWeight: "500" }}>{selectedInterview.position}</p>
              </div>
              {getStatusBadge(selectedInterview.status)}
            </div>
            
            <div style={{ marginBottom: "25px" }}>
              <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                <h4 style={{ margin: "0 0 15px 0", fontSize: "15px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", color: "#0f172a" }}><Calendar size={18} color="#20b8a6"/> Interview Set</h4>
                <div style={{ display: "grid", gap: "10px", fontSize: "14px", color: "#334155" }}>
                  <div><strong style={{ color: "#0f172a" }}>Date / Time:</strong> {selectedInterview.date} {selectedInterview.time && `at ${selectedInterview.time}`}</div>
                  <div><strong style={{ color: "#0f172a" }}>Interviewer:</strong> {(selectedInterview.interviewers || []).join(", ") || selectedInterview.interviewer || "Unassigned"}</div>
                  <div><strong style={{ color: "#0f172a" }}>Round:</strong> {selectedInterview.roundName || "General Round"}</div>
                </div>
              </div>

              {/* Parsed Feedback block if exists */}
              {selectedInterview.submittedFeedback ? (
                <div style={{ padding: "20px", background: "#f0fdf4", borderRadius: "12px", border: "1px solid #dcfce7" }}>
                  <h4 style={{ margin: "0 0 15px 0", fontSize: "15px", fontWeight: "700", color: "#166534", display: "flex", alignItems: "center", gap: "8px" }}>
                    <FileText size={18}/> Interviewer Feedback
                  </h4>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "15px" }}>
                    <span style={{ fontWeight: "600", fontSize: "14px", color: "#166534" }}>Rating:</span>
                    <div style={{ display: "flex", gap: "2px" }}>
                      {[1,2,3,4,5].map(star => (
                        <Star key={star} size={16} fill={star <= selectedInterview.submittedFeedback.rating ? "#f59e0b" : "none"} color={star <= selectedInterview.submittedFeedback.rating ? "#f59e0b" : "#cbd5e1"} />
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "grid", gap: "12px", fontSize: "14px" }}>
                    <div>
                      <strong style={{ color: "#14532d", display: "block", marginBottom: "4px" }}>Technical Edge:</strong>
                      <span style={{ color: "#166534" }}>{selectedInterview.submittedFeedback.technicalSkills}</span>
                    </div>
                    <div>
                      <strong style={{ color: "#14532d", display: "block", marginBottom: "4px" }}>Communication:</strong>
                      <span style={{ color: "#166534" }}>{selectedInterview.submittedFeedback.communicationSkills}</span>
                    </div>
                    <div>
                      <strong style={{ color: "#14532d", display: "block", marginBottom: "4px" }}>Overall Summary:</strong>
                      <span style={{ color: "#166534" }}>{selectedInterview.submittedFeedback.overallFeedback}</span>
                    </div>
                    <div style={{ marginTop: "10px", padding: "10px", background: "white", borderRadius: "8px", fontWeight: "600", color: "#15803d", display: "inline-block" }}>
                      Interviewer Suggestion: {selectedInterview.submittedFeedback.result}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: "20px", background: "#f1f5f9", borderRadius: "12px", textAlign: "center", color: "#64748b" }}>
                  <FileText size={24} style={{ opacity: 0.5, marginBottom: "8px" }} />
                  <p style={{ margin: 0, fontSize: "14px" }}>No formal feedback submitted yet.</p>
                </div>
              )}
            </div>
            <button onClick={() => setSelectedInterview(null)} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%)", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "600", transition: "opacity 0.2s" }} onMouseEnter={e => e.currentTarget.style.opacity = 0.9} onMouseLeave={e => e.currentTarget.style.opacity = 1}>Close Window</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Interview;