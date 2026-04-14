import { useState, useEffect } from "react";
import { Calendar, Clock, RefreshCw, CheckCircle, FileText, X, Video, Star, Eye } from "lucide-react";

const InterviewerInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  const [showReschedule, setShowReschedule] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [rescheduleData, setRescheduleData] = useState({ date: "", time: "", reason: "" });

  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    feedback: "",
    result: "Pass"
  });

  const [showViewFeedback, setShowViewFeedback] = useState(false);

  const gradient = "linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%)";
  const currentInterviewer = "John Doe (Tech Lead)";

  const fetchInterviews = () => {
    const saved = JSON.parse(localStorage.getItem("hrInterviews") || "[]");
    
    if (saved.length === 0) {
      const dummy = [
        {
          id: 201, candidateName: "David Miller", position: "Full Stack Engineer", roundName: "Technical Round", date: "2024-04-18", time: "10:00 AM", type: "Online", status: "Scheduled", interviewers: [currentInterviewer]
        },
        {
          id: 202, candidateName: "Sophie Clark", position: "Product Designer", roundName: "Portfolio Review", date: "2024-04-17", time: "02:00 PM", type: "Offline", status: "Completed", interviewers: [currentInterviewer]
        },
        {
          id: 203, candidateName: "Lucas Wright", position: "Backend Lead", roundName: "System Design", date: "2024-04-15", time: "11:00 AM", type: "Online", status: "Completed", interviewers: [currentInterviewer],
          submittedFeedback: {
            rating: 4, technicalSkills: "Strong DB knowledge", communicationSkills: "Clear and precise", overallFeedback: "Good fit for the team", result: "Pass"
          }
        }
      ];
      setInterviews(dummy);
      localStorage.setItem("hrInterviews", JSON.stringify(dummy));
    } else {
      const myInts = saved.filter(i => (i.interviewers || []).includes(currentInterviewer) || i.interviewer === currentInterviewer);
      setInterviews(myInts);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInterviews();
    window.addEventListener("localInterviewsChanged", fetchInterviews);
    return () => window.removeEventListener("localInterviewsChanged", fetchInterviews);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const updateStatus = (interviewId, newStatus) => {
    const updated = interviews.map(i => i.id === interviewId ? { ...i, status: newStatus } : i);
    setInterviews(updated);
    
    const hrInts = JSON.parse(localStorage.getItem("hrInterviews") || "[]");
    const merged = hrInts.map(h => h.id === interviewId ? { ...h, status: newStatus } : h);
    localStorage.setItem("hrInterviews", JSON.stringify(merged));
    window.dispatchEvent(new Event("localInterviewsChanged"));
  };

  const handleRescheduleSubmit = () => {
    if (!rescheduleData.date || !rescheduleData.time || !rescheduleData.reason) {
      alert("Please fill all details.");
      return;
    }
    const updated = interviews.map(i => i.id === selectedInterview.id ? { 
      ...i, 
      date: rescheduleData.date, 
      time: rescheduleData.time, 
      rescheduleReason: rescheduleData.reason,
      status: "Rescheduled"
    } : i);
    
    setInterviews(updated);
    const hrInts = JSON.parse(localStorage.getItem("hrInterviews") || "[]");
    const merged = hrInts.map(h => h.id === selectedInterview.id ? { 
      ...h, 
      date: rescheduleData.date, 
      time: rescheduleData.time,
      status: "Rescheduled"
    } : h);
    localStorage.setItem("hrInterviews", JSON.stringify(merged));
    window.dispatchEvent(new Event("localInterviewsChanged"));
    
    setShowReschedule(false);
    showToast("Interview successfully rescheduled.");
  };

  const handleFeedbackSubmit = () => {
    if (!feedbackData.feedback) {
      alert("Please enter feedback.");
      return;
    }

    const payload = { ...feedbackData, timestamp: new Date().toISOString() };
    
    const updated = interviews.map(i => i.id === selectedInterview.id ? { ...i, status: "Completed", submittedFeedback: payload } : i);
    setInterviews(updated);

    const hrInts = JSON.parse(localStorage.getItem("hrInterviews") || "[]");
    const merged = hrInts.map(h => h.id === selectedInterview.id ? { ...h, status: "Completed", submittedFeedback: payload } : h);
    localStorage.setItem("hrInterviews", JSON.stringify(merged));
    window.dispatchEvent(new Event("localInterviewsChanged"));

    // Send to HR Notification System
    const notifs = JSON.parse(localStorage.getItem("hrNotifications") || "[]");
    notifs.push({
      id: Date.now(),
      message: `${selectedInterview.candidateName} Feedback Submitted: ${payload.result}`,
      result: payload.result,
      timestamp: new Date().toISOString(),
      read: false
    });
    localStorage.setItem("hrNotifications", JSON.stringify(notifs));

    setShowFeedback(false);
    showToast("Feedback submitted. HR has been notified.");
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
                <button onClick={() => { setSelectedInterview(interview); setRescheduleData({ date: "", time: "", reason: "" }); setShowReschedule(true); }}
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
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "5px" }}>Reason for Rescheduling</label>
              <textarea rows="3" value={rescheduleData.reason} onChange={(e) => setRescheduleData({...rescheduleData, reason: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", resize: "vertical" }} />
            </div>
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