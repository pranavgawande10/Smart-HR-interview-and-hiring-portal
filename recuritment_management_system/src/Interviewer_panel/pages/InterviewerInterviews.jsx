import { useState, useEffect } from "react";
import { Calendar, Clock, RefreshCw, CheckCircle, FileText, X, Video, Star, Eye } from "lucide-react";
import axios from "axios";

const InterviewerInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  const [showReschedule, setShowReschedule] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [rescheduleData, setRescheduleData] = useState({ date: "", time: "" });

  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    feedback: "",
    result: "Pass"
  });

  const [showViewFeedback, setShowViewFeedback] = useState(false);

  const gradient = "linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%)";

  const getAxiosConfig = () => ({
    withCredentials: true,
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchInterviews = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/v1/interviewer/my-interviews", getAxiosConfig());
      const mapped = (res.data.interviews || []).map(i => ({
        id: i._id,
        candidateName: i.candidate?.name || "Unknown",
        position: i.job?.title || "Role",
        roundName: `Round ${i.roundNumber}${i.isFinalRound ? ' (Final)' : ''}`,
        date: i.scheduledAt ? new Date(i.scheduledAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : "N/A",
        time: i.scheduledAt ? new Date(i.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A",
        type: i.mode || "Online",
        status: i.status === "SCHEDULED" ? "Scheduled" : i.status === "COMPLETED" ? "Completed" : i.status,
        submittedFeedback: i.result ? { result: i.result, feedback: i.feedback } : null
      }));
      setInterviews(mapped);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch interviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // const handleRescheduleSubmit = async () => {
  //   if (!rescheduleData.date || !rescheduleData.time || !rescheduleData.reason) {
  //     alert("Please fill all details.");
  //     return;
  //   }
  //   try {
  //     await axios.put(`http://localhost:3001/api/v1/interviewer/reschedule/${selectedInterview.id}`, {
  //       date: rescheduleData.date,
  //       time: rescheduleData.time,
  //       reason: rescheduleData.reason
  //     }, getAxiosConfig());
  //     setShowReschedule(false);
  //     showToast("Interview successfully rescheduled.");
  //     fetchInterviews();
  //   } catch (err) {
  //     console.error(err);
  //     alert(err.response?.data?.message || "Failed to reschedule server");
  //   }
  // };


  
  const handleRescheduleSubmit = async () => {
  if (
    !rescheduleData.date?.trim() ||
    !rescheduleData.time?.trim() 
  ) {
    alert("Please fill all details.");
    return;
  }

  try {
    await axios.put(
      `http://localhost:3001/api/v1/interviewer/reschedule/${selectedInterview.id}`,
      {
        date: rescheduleData.date,
        time: rescheduleData.time,
      },
      getAxiosConfig()
    );

    setShowReschedule(false);
    setRescheduleData({
      date: "",
      time: "",
    });
    showToast("Interview successfully rescheduled.");
    fetchInterviews();
  } catch (err) {
    console.error("Reschedule error:", err);
    alert(err.response?.data?.message || "Failed to reschedule interview");
  }
};

  const handleFeedbackSubmit = async () => {
    if (!feedbackData.feedback) {
      alert("Please enter feedback.");
      return;
    }
    
    try {
      await axios.patch(`http://localhost:3001/api/v1/interviewer/complete-interview/${selectedInterview.id}`, {
        feedback: feedbackData.feedback,
        result: feedbackData.result.toUpperCase()
      }, getAxiosConfig());
      setShowFeedback(false);
      showToast("Feedback submitted. HR has been notified.");
      fetchInterviews();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit feedback");
    }
  };



  if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}><p>Loading...</p></div>;

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto", position: "relative", minHeight: "100vh" }}>
      
      {/* Toast */}
      {toastMessage && (
        <div style={{
          position: "fixed", top: "20px", right: "20px", background: "#10b981", color: "white",
          padding: "15px 25px", borderRadius: "10px", fontWeight: "600", zIndex: 9999,
          boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)", display: "flex", alignItems: "center", gap: "10px"
        }}>
          <CheckCircle size={20} /> {toastMessage}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: "30px", padding: "30px", background: gradient, borderRadius: "20px", color: "white", boxShadow: "0 10px 30px rgba(20, 184, 166, 0.2)" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "8px" }}>My Interviews</h1>
        <p style={{ fontSize: "16px", opacity: "0.9", margin: "0" }}>Manage your assigned schedules and submit structured feedback.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "24px" }}>
        {interviews.map(interview => (
          <div key={interview.id} style={{
            background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
               <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "700", margin: "0 0 5px 0", color: "#0f172a" }}>{interview.candidateName}</h3>
                  <div style={{ color: "#64748b", fontSize: "14px", marginBottom: "8px" }}>{interview.position}</div>
                  <span style={{ background: "#e0f2fe", color: "#0284c7", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }}>
                    {interview.roundName || "General Round"}
                  </span>
               </div>
               <div>
                 <span style={{
                   background: ((interview.status || "") === "Scheduled") ? "#dbeafe" :
                               ((interview.status || "") === "Completed") ? "#dcfce7" :
                               ((interview.status || "") === "Rescheduled") ? "#ffedd5" :
                               ((interview.status || "") === "Rejected") ? "#fee2e2" :
                               ((interview.status || "") === "Cancelled") ? "#f3f4f6" : "#fef3c7",
                   color: ((interview.status || "") === "Scheduled") ? "#2563eb" :
                          ((interview.status || "") === "Completed") ? "#16a34a" :
                          ((interview.status || "") === "Rescheduled") ? "#ea580c" :
                          ((interview.status || "") === "Rejected") ? "#dc2626" :
                          ((interview.status || "") === "Cancelled") ? "#4b5563" : "#d97706",
                   padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
                   display: "inline-block"
                 }}>{interview.status || "Assigned"}</span>
               </div>
            </div>

            <div style={{ background: "#f8fafc", padding: "15px", borderRadius: "12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
               <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#475569" }}><Calendar size={14} color="#94a3b8" /> {interview.date}</div>
               <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#475569" }}><Clock size={14} color="#94a3b8" /> {interview.time}</div>
               <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#475569", gridColumn: "span 2" }}><Video size={14} color="#94a3b8" /> Mode: {interview.type}</div>
            </div>

            <div style={{ display: "grid", gap: "10px" }}>
              {(interview.status || "").toLowerCase() !== "completed" && (
                 <button onClick={() => { setSelectedInterview(interview); setRescheduleData({ date: "", time: "" }); setShowReschedule(true); console.log("Selected interview:", interview);}}
                  style={{ padding: "10px", background: "white", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: "8px", cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  <RefreshCw size={14} /> Reschedule
                </button>
              )}
              
              {((interview.status || "").toLowerCase() !== "completed" || !interview.submittedFeedback) && (
                <button onClick={() => { setSelectedInterview(interview); setFeedbackData({ feedback: "", result: "Pass" }); setShowFeedback(true); }}
                  style={{ padding: "10px", background: gradient, color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  <CheckCircle size={14} /> Mark as Completed
                </button>
              )}

              {((interview.status || "").toLowerCase() === "completed" && interview.submittedFeedback) && (
                <button onClick={() => { setSelectedInterview(interview); setShowViewFeedback(true); }}
                  style={{ padding: "12px", background: "#f1f5f9", color: "#334155", border: "1px solid #e2e8f0", borderRadius: "8px", cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  <Eye size={16} /> View Feedback
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Reschedule Modal */}
      {showReschedule && selectedInterview && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ background: "white", borderRadius: "20px", maxWidth: "450px", width: "100%", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>Reschedule Interview</h2>
              <button onClick={() => setShowReschedule(false)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={24} /></button>
            </div>
            
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "5px" }}>New Date</label>
              <input type="date" value={rescheduleData.date} onChange={(e) => setRescheduleData({...rescheduleData, date: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "5px" }}>New Time</label>
              <input type="time" value={rescheduleData.time} onChange={(e) => setRescheduleData({...rescheduleData, time: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
            </div>
            {/* <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "5px" }}>Reason for Rescheduling</label>
              <textarea rows="3" value={rescheduleData.reason} onChange={(e) => setRescheduleData({...rescheduleData, reason: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", resize: "vertical" }} />
            </div> */}
            <button onClick={handleRescheduleSubmit} style={{ width: "100%", padding: "14px", background: gradient, color: "white", border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer" }}>Confirm Reschedule</button>
          </div>
        </div>
      )}

      {/* Write Feedback Modal */}
      {showFeedback && selectedInterview && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ background: "white", borderRadius: "20px", maxWidth: "500px", width: "100%", padding: "24px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #e2e8f0", paddingBottom: "15px" }}>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>Complete Interview <span style={{ color: "#0d9488" }}>({selectedInterview.candidateName})</span></h2>
              <button onClick={() => setShowFeedback(false)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={24} /></button>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "5px" }}>Feedback</label>
              <textarea rows="5" placeholder="Enter your feedback here..." value={feedbackData.feedback} onChange={(e) => setFeedbackData({...feedbackData, feedback: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", resize: "vertical" }} />
            </div>

            <div style={{ marginBottom: "25px" }}>
               <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "5px" }}>Result</label>
               <select value={feedbackData.result} onChange={(e) => setFeedbackData({...feedbackData, result: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "white", fontSize: "15px", fontWeight: "600" }}>
                  <option value="Pass">Pass</option>
                  <option value="Fail">Fail</option>
               </select>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setShowFeedback(false)} style={{ flex: 1, padding: "12px", background: "#f1f5f9", color: "#334155", border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={handleFeedbackSubmit} style={{ flex: 1, padding: "12px", background: gradient, color: "white", border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
                <CheckCircle size={18} /> Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Feedback Modal */}
      {showViewFeedback && selectedInterview && selectedInterview.submittedFeedback && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ background: "white", borderRadius: "20px", maxWidth: "450px", width: "100%", padding: "30px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", borderBottom: "1px solid #e2e8f0", paddingBottom: "15px" }}>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>Submitted Feedback <span style={{ color: "#0d9488" }}>({selectedInterview.candidateName})</span></h2>
              <button onClick={() => setShowViewFeedback(false)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={24} /></button>
            </div>

            <div style={{ marginBottom: "20px" }}>
               <strong style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}>Feedback</strong>
               <div style={{ background: "#f1f5f9", padding: "15px", borderRadius: "10px", color: "#334155", fontSize: "14px", whiteSpace: "pre-wrap" }}>
                 {selectedInterview.submittedFeedback.feedback || selectedInterview.submittedFeedback.overallFeedback || "No feedback provided"}
               </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px", background: selectedInterview.submittedFeedback.result === 'Pass' ? "#dcfce7" : "#fee2e2", borderRadius: "12px" }}>
               <strong style={{ color: selectedInterview.submittedFeedback.result === 'Pass' ? "#166534" : "#991b1b" }}>Final Decision</strong>
               <span style={{ fontWeight: "700", color: selectedInterview.submittedFeedback.result === 'Pass' ? "#166534" : "#991b1b", fontSize: "18px" }}>
                 {selectedInterview.submittedFeedback.result.toUpperCase()}
               </span>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
};

export default InterviewerInterviews;