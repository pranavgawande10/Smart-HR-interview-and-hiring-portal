import { useState, useEffect } from "react";
import { Calendar, Clock, RefreshCw, CheckCircle, Video, X, AlertCircle, MessageSquare, XCircle, ExternalLink } from "lucide-react";
import axios from "axios";

const InterviewerInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showReschedule, setShowReschedule] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false); // Controls the Feedback Modal
  const [formData, setFormData] = useState({ date: "", time: "", meetingLink: "", feedback: "", result: "PASS" });

  const gradient = "linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%)";
  const getAxiosConfig = () => ({
    withCredentials: true,
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchActiveInterviews = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/v1/interviewer/my-interviews", getAxiosConfig());
      const active = (res.data.interviews || []).filter(i => 
        i.status === "SCHEDULED" || i.candidateResponse === "REQUEST_RESCHEDULE"
      );
      setInterviews(active);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchActiveInterviews(); }, []);

  // DECISION 1: Accept & Reschedule
  const handleReschedule = async () => {
    if (!formData.date || !formData.time) return alert("Please select a new date and time.");
    try {
      await axios.put(`http://localhost:3001/api/v1/interviewer/reschedule/${selected._id}`, {
        date: formData.date, 
        time: formData.time,
        meetingLink: formData.meetingLink,
        reason: "Interviewer accepted reschedule request."
      }, getAxiosConfig());
      
      setShowReschedule(false);
      setFormData({ date: "", time: "", meetingLink: "", feedback: "", result: "PASS" });
      fetchActiveInterviews();
      alert("Interview updated successfully.");
    } catch (err) { alert(err.response?.data?.message || "Update failed"); }
  };

  // DECISION 2: Decline & Maintain Original Date
  const handleDeclineReschedule = async (interview) => {
    if (!window.confirm("Keep original schedule and decline this request?")) return;
    
    const originalDateObj = new Date(interview.scheduledAt);
    const dateStr = originalDateObj.toISOString().split('T')[0];
    const timeStr = originalDateObj.toTimeString().split(' ')[0].substring(0, 5);

    try {
      await axios.put(`http://localhost:3001/api/v1/interviewer/reschedule/${interview._id}`, {
        date: dateStr, 
        time: timeStr,
        meetingLink: interview.meetingLink, 
        reason: "Interviewer maintained original slot."
      }, getAxiosConfig());
      
      fetchActiveInterviews();
      alert("Maintained original schedule. Candidate notified.");
    } catch (err) { alert("Failed to decline request."); }
  };

  // COMPLETE INTERVIEW - Matches your backend route exactly
  const handleComplete = async () => {
    if (!formData.feedback) return alert("Please provide feedback remarks.");
    try {
      await axios.patch(`http://localhost:3001/api/v1/interviewer/complete-interview/${selected._id}`, {
        feedback: formData.feedback, 
        result: formData.result
      }, getAxiosConfig());
      
      alert("Interview completed successfully!");
      setShowFeedback(false);
      setFormData({ ...formData, feedback: "", result: "PASS" }); // Reset form
      fetchActiveInterviews();
    } catch (err) { 
      alert(err.response?.data?.message || "Failed to complete interview."); 
    }
  };

  // Helper function to safely format the meeting link
  const formatMeetingLink = (link) => {
    if (!link) return "#";
    return link.startsWith("http://") || link.startsWith("https://") ? link : `https://${link}`;
  };

  if (loading) return <div style={{ padding: "50px", textAlign: "center" }}>Loading...</div>;

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "30px", padding: "30px", background: gradient, borderRadius: "20px", color: "white" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "700" }}>Active Interviews</h1>
        <p>Manage your pipeline and join online sessions directly.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "24px" }}>
        {interviews.map(i => {
          const isRequest = i.candidateResponse === "REQUEST_RESCHEDULE";
          
          return (
            <div key={i._id} style={{ 
              background: "white", borderRadius: "16px", 
              border: isRequest ? "2px solid #f59e0b" : "1px solid #eee", 
              padding: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0 }}>{i.candidate?.name}</h3>
                {isRequest && (
                  <span style={{ background: "#fef3c7", color: "#d97706", padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "800" }}>
                    ⚠️ REQUESTED
                  </span>
                )}
              </div>

              <div style={{ display: "flex", gap: "10px", margin: "10px 0" }}>
                <span style={{ fontSize: "12px", background: "#f0fdf4", color: "#166534", padding: "4px 8px", borderRadius: "5px", fontWeight: "600" }}>{i.job?.title}</span>
                <span style={{ fontSize: "12px", background: "#eff6ff", color: "#1e40af", padding: "4px 8px", borderRadius: "5px", fontWeight: "600" }}>Round {i.roundNumber}</span>
              </div>

              {isRequest && (
                <div style={{ background: "#fefce8", padding: "12px", borderRadius: "10px", marginBottom: "15px", border: "1px solid #fef3c7" }}>
                  <p style={{ margin: 0, fontSize: "13px", color: "#92400e", fontWeight: "600" }}>Candidate's Reason:</p>
                  <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#b45309", fontStyle: "italic" }}>"{i.rescheduleReason}"</p>
                </div>
              )}

              <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px", fontSize: "13px", marginBottom: "15px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <Calendar size={14} color="#64748b" /> {new Date(i.scheduledAt).toLocaleDateString()}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Clock size={14} color="#64748b" /> {new Date(i.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                
                {/* Cleaned up Meeting Link Visibility */}
                {i.meetingLink && (
                  <div style={{ marginTop: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                    <a href={formatMeetingLink(i.meetingLink)} target="_blank" rel="noopener noreferrer" 
                      style={{ display: "flex", alignItems: "center", gap: "8px", color: "#0d9488", textDecoration: "none", fontWeight: "700" }}>
                      <Video size={16} /> Join Interview Session
                    </a>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                {isRequest ? (
                  <>
                    <button onClick={() => { setSelected(i); setFormData({...formData, meetingLink: i.meetingLink}); setShowReschedule(true); }} 
                      style={{ flex: 1, padding: "10px", borderRadius: "8px", cursor: "pointer", background: "#f59e0b", color: "white", border: "none", fontWeight: "600" }}>
                      <RefreshCw size={14} style={{ marginRight: '5px' }} /> Accept
                    </button>
                    <button onClick={() => handleDeclineReschedule(i)} 
                      style={{ flex: 1, padding: "10px", borderRadius: "8px", cursor: "pointer", background: "white", color: "#ef4444", border: "1px solid #ef4444", fontWeight: "600" }}>
                      <XCircle size={14} style={{ marginRight: '5px' }} /> Decline
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setSelected(i); setShowReschedule(true); }} style={{ flex: 1, padding: "10px", borderRadius: "8px", cursor: "pointer", background: "white", color: "#475569", border: "1px solid #ddd", fontWeight: "600" }}>Reschedule</button>
                    <button onClick={() => { setSelected(i); setShowFeedback(true); }} style={{ flex: 1, padding: "10px", background: gradient, color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>Feedback</button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reschedule Modal */}
      {showReschedule && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "white", padding: "24px", borderRadius: "16px", width: "450px", maxWidth: "90%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <h3 style={{ margin: 0 }}>Update Schedule</h3>
              <button onClick={() => setShowReschedule(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>New Date</label>
              <input type="date" onChange={e => setFormData({...formData, date: e.target.value})} style={{ width: "100%", padding: "12px", marginTop: "5px", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>New Time</label>
              <input type="time" onChange={e => setFormData({...formData, time: e.target.value})} style={{ width: "100%", padding: "12px", marginTop: "5px", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>Meeting Link</label>
              <input type="text" value={formData.meetingLink} placeholder="Paste new Link here" onChange={e => setFormData({...formData, meetingLink: e.target.value})} style={{ width: "100%", padding: "12px", marginTop: "5px", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
            </div>

            <button onClick={handleReschedule} style={{ width: "100%", padding: "14px", background: gradient, color: "white", border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer" }}>
              Update Interview
            </button>
          </div>
        </div>
      )}

      {/* NEW: Feedback & Complete Modal */}
      {showFeedback && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "white", padding: "24px", borderRadius: "16px", width: "450px", maxWidth: "90%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <h3 style={{ margin: 0 }}>Complete Interview</h3>
              <button onClick={() => setShowFeedback(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "20px" }}>
              Provide feedback for <strong>{selected?.candidate?.name}</strong>.
            </p>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>Interview Result</label>
              <select 
                value={formData.result} 
                onChange={e => setFormData({...formData, result: e.target.value})} 
                style={{ width: "100%", padding: "12px", marginTop: "5px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "white" }}
              >
                <option value="PASS">PASS - Candidate cleared this round</option>
                <option value="FAIL">FAIL - Candidate rejected</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>Feedback Remarks</label>
              <textarea 
                rows="4"
                value={formData.feedback} 
                placeholder="Enter detailed feedback on the candidate's performance..." 
                onChange={e => setFormData({...formData, feedback: e.target.value})} 
                style={{ width: "100%", padding: "12px", marginTop: "5px", borderRadius: "8px", border: "1px solid #e2e8f0", resize: "vertical" }} 
              />
            </div>

            <button onClick={handleComplete} style={{ width: "100%", padding: "14px", background: formData.result === 'PASS' ? '#10b981' : '#ef4444', color: "white", border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer" }}>
              Submit Feedback & Complete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewerInterviews;