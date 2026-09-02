import { useState, useEffect } from "react";
import { 
  Calendar, Clock, Users, CheckCircle, XCircle, Video, List, User, 
  ChevronRight, TrendingUp, ChevronDown, FileText, Star, Award, CalendarPlus, Edit
} from "lucide-react";
import axios from "axios";

const Interview = () => {
  const [interviews, setInterviews] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);
  
  // Scheduling States
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [interviewToSchedule, setInterviewToSchedule] = useState(null);
  const [scheduleData, setScheduleData] = useState({ date: "", time: "", meetingLink: "" });

  // Feedback & Final Decision States
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [interviewToEvaluate, setInterviewToEvaluate] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");

  const getAxiosConfig = () => ({
    withCredentials: true,
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchInterviews = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/v1/hr/my-interviews", getAxiosConfig());
      const mapped = (res.data.data || res.data.interviews || []).map(i => ({
        id: i._id,
        candidateName: i.candidate?.name || "Unknown",
        position: i.job?.title || "Role",
        date: i.scheduledAt ? new Date(i.scheduledAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : "",
        time: i.scheduledAt ? new Date(i.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
        interviewers: [(i.interviewer?.name || "Unassigned")],
        roundName: `Round ${i.roundNumber}${i.isFinalRound ? ' (Final)' : ''}`,
        status: i.status === "ASSIGNED" || i.status === "PENDING" ? "Scheduled" : i.status === "SCHEDULED" ? "Scheduled" : i.status === "COMPLETED" ? "Completed" : i.status,
        link: i.meetingLink || "",
        submittedFeedback: i.result ? {
          rating: i.feedbackRating || 5,
          technicalSkills: i.feedbackTechnical || "Evaluated by Interviewer",
          communicationSkills: i.feedbackCommunication || "Evaluated by Interviewer",
          overallFeedback: i.feedbackOverall || i.comments || i.feedback || "Feedback received",
          result: i.result
        } : null
      }));
      setInterviews(mapped);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  // --- SCHEDULING LOGIC ---
  const openScheduleModal = (interview) => {
    setInterviewToSchedule(interview);
    setScheduleData({ date: "", time: "", meetingLink: "" });
    setScheduleModalOpen(true);
  };

  const submitSchedule = async () => {
    if (!scheduleData.date || !scheduleData.time) {
      alert("Please provide at least a date and time");
      return;
    }
    try {
      await axios.post(`http://localhost:3001/api/v1/hr/schedule/${interviewToSchedule.id}`, {
        date: scheduleData.date,
        time: scheduleData.time,
        meetingLink: scheduleData.meetingLink,
        mode: "ONLINE",
        location: "Virtual"
      }, getAxiosConfig());

      alert("Interview scheduled successfully!");
      setScheduleModalOpen(false);
      fetchInterviews(); 
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to schedule interview");
    }
  };

  // --- FEEDBACK & DECISION LOGIC ---
  const openFeedbackModal = (interview) => {
    setInterviewToEvaluate(interview);
    setFeedbackText("");
    setFeedbackModalOpen(true);
  };

  const submitFinalDecision = async (decisionResult) => {
    if (!feedbackText.trim()) {
      alert("Please provide feedback before making a final decision.");
      return;
    }

    try {
      await axios.patch(`http://localhost:3001/api/v1/hr/final-decision/${interviewToEvaluate.id}`, { 
          result: decisionResult,
          feedback: feedbackText
      }, getAxiosConfig());

      alert(`Decision (${decisionResult}) submitted successfully!`);
      setFeedbackModalOpen(false);
      fetchInterviews(); // Refresh to remove the completed interview from the active dashboard
    } catch (err) {
      console.error("Evaluation Error:", err);
      // 🔥 This explicitly shows the 400 error message from your backend (e.g., "Already completed")
      alert(err.response?.data?.message || "Failed to submit decision. Please try again.");
    }
  };

  const getStatusBadge = (status) => {
    const s = status ? status.toLowerCase() : "scheduled";
    if (s === "scheduled") return <span style={{ background: "#dbeafe", color: "#2563eb", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>Scheduled</span>;
    if (s === "completed") return <span style={{ background: "#d1fae5", color: "#059669", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>Completed</span>;
    if (s === "final") return <span style={{ background: "#f3e8ff", color: "#7e22ce", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>Final</span>;
    if (s === "hired") return <span style={{ background: "#fef08a", color: "#854d0e", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>Hired</span>;
    
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
      
      {/* Header */}
      <div style={{
        marginBottom: "30px", padding: "25px", background: "linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%)",
        borderRadius: "16px", color: "white", boxShadow: "0 4px 20px rgba(20, 184, 166, 0.3)"
      }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px", color: "white" }}>
          Interviews Dashboard
        </h1>
        <p style={{ fontSize: "16px", opacity: "0.9", margin: "0", color: "rgba(255, 255, 255, 0.9)" }}>
          Manage your scheduled meetings, change statuses, and review feedback.
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginBottom: "40px"
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

      {/* Cards Render Function */}
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
                  <span>{interview.date ? `${interview.date} at ${interview.time}` : "Not Scheduled Yet"}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#475569" }}>
                  <User size={18} color="#94a3b8" />
                  <span>{(interview.interviewers || []).join(", ") || interview.interviewer || "Unassigned"}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#475569" }}>
                  <List size={18} color="#94a3b8" />
                  <span style={{ fontWeight: "500", color: "#0f172a" }}>{interview.roundName || "General Round"}</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid #f1f5f9", paddingTop: "20px" }}>
              
              <div style={{ display: "flex", gap: "10px" }}>
                {interview.link ? (
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
                ) : (
                  <button 
                    onClick={() => openScheduleModal(interview)}
                    style={{
                      flex: 1, padding: "10px 0", background: "#f1f5f9",
                      color: "#0f172a", border: "1px solid #e2e8f0", borderRadius: "8px", fontWeight: "600", fontSize: "14px",
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px"
                    }}
                  >
                    <CalendarPlus size={16} /> Schedule
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
                  Details <ChevronRight size={16} />
                </button>
              </div>

              {/* Feedback & Evaluate Button - Only visible if not already completed! */}
              {interview.status !== "COMPLETED" && (
                <button 
                  onClick={() => openFeedbackModal(interview)}
                  style={{
                    width: "100%", padding: "10px 0", background: "#fef08a", color: "#854d0e", 
                    border: "none", borderRadius: "8px", fontWeight: "700", fontSize: "14px",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px"
                  }}
                >
                  <Edit size={16} /> Evaluate & Final Decision
                </button>
              )}

            </div>
          </div>
        );

        return (
          <>
            <div style={{ marginBottom: "50px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "20px", paddingBottom: "10px", borderBottom: "2px solid #e2e8f0" }}>
                Upcoming Interviews
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "20px" }}>
                {upcomingInterviews.length === 0 ? <p style={{ color: "#64748b" }}>No upcoming interviews scheduled.</p> : upcomingInterviews.map(renderCard)}
              </div>
            </div>

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

      {/* View Details Modal */}
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
                      <strong style={{ color: "#14532d", display: "block", marginBottom: "4px" }}>Overall Summary / Feedback:</strong>
                      <span style={{ color: "#166534" }}>{selectedInterview.submittedFeedback.overallFeedback}</span>
                    </div>
                    <div style={{ marginTop: "10px", padding: "10px", background: "white", borderRadius: "8px", fontWeight: "600", color: "#15803d", display: "inline-block" }}>
                      Decision / Result: {selectedInterview.submittedFeedback.result}
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
            <button onClick={() => setSelectedInterview(null)} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%)", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "600" }}>Close Window</button>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {scheduleModalOpen && interviewToSchedule && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "white", padding: "30px", borderRadius: "16px", width: "400px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}>
            <h3 style={{ margin: "0 0 20px 0", fontSize: "20px", color: "#0f172a" }}>Schedule Interview</h3>
            <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "20px" }}>Set the date, time, and meeting link for {interviewToSchedule.candidateName}.</p>
            
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px", color: "#475569" }}>Date</label>
              <input type="date" value={scheduleData.date} onChange={(e) => setScheduleData({...scheduleData, date: e.target.value})} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none", boxSizing: "border-box" }} />
            </div>
            
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px", color: "#475569" }}>Time</label>
              <input type="time" value={scheduleData.time} onChange={(e) => setScheduleData({...scheduleData, time: e.target.value})} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "25px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px", color: "#475569" }}>Meeting Link</label>
              <input type="url" placeholder="https://meet.google.com/..." value={scheduleData.meetingLink} onChange={(e) => setScheduleData({...scheduleData, meetingLink: e.target.value})} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none", boxSizing: "border-box" }} />
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button onClick={() => setScheduleModalOpen(false)} style={{ padding: "10px 20px", background: "white", color: "#475569", border: "1px solid #e2e8f0", borderRadius: "8px", cursor: "pointer", fontWeight: "500" }}>Cancel</button>
              <button onClick={submitSchedule} style={{ padding: "10px 20px", background: "rgb(20, 184, 166)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>Schedule Now</button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback & Final Decision Modal */}
      {feedbackModalOpen && interviewToEvaluate && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "white", padding: "30px", borderRadius: "16px", width: "450px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}>
            <h3 style={{ margin: "0 0 10px 0", fontSize: "20px", color: "#0f172a" }}>Evaluate Candidate</h3>
            <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "20px" }}>
              Provide feedback and final decision for <strong>{interviewToEvaluate.candidateName}</strong> ({interviewToEvaluate.roundName}).
            </p>
            
            <div style={{ marginBottom: "25px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px", color: "#0f172a" }}>Interview Feedback Notes <span style={{color: "red"}}>*</span></label>
              <textarea 
                rows={4}
                placeholder="Write your detailed feedback here..." 
                value={feedbackText} 
                onChange={(e) => setFeedbackText(e.target.value)} 
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", boxSizing: "border-box", fontSize: "14px", fontFamily: "inherit", resize: "vertical" }} 
              />
            </div>

            <div style={{ display: "flex", gap: "12px", borderTop: "1px solid #e2e8f0", paddingTop: "20px" }}>
              <button onClick={() => setFeedbackModalOpen(false)} style={{ flex: 1, padding: "12px", background: "white", color: "#475569", border: "1px solid #cbd5e1", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>
                Cancel
              </button>
              <button onClick={() => submitFinalDecision("FAIL")} style={{ flex: 1, padding: "12px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <XCircle size={18} /> Reject
              </button>
              <button onClick={() => submitFinalDecision("PASS")} style={{ flex: 1, padding: "12px", background: "#dcfce7", color: "#166534", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <CheckCircle size={18} /> Hire / Pass
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Interview;