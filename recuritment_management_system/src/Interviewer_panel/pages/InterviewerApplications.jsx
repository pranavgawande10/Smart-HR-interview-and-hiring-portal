import { useState, useEffect, useMemo } from "react";
import { Search, Calendar, Briefcase, Plus, X, Clock, Video, FileText, CheckCircle, ChevronDown, User, MapPin, Mail } from "lucide-react";
import axios from "axios";

const InterviewerApplications = () => {
  const [interviews, setInterviews] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [scheduleData, setScheduleData] = useState({
    date: "",
    time: "",
    duration: "60",
    mode: "Online",
    link: "",
    notes: ""
  });

  const gradient = "linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%)";

  const getAxiosConfig = () => ({
    withCredentials: true,
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchApps = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/v1/interviewer/my-interviews", getAxiosConfig());
      const mapped = (res.data.interviews || []).map(i => ({
        id: i._id,
        candidateName: i.candidate?.name || "Unknown",
        position: i.job?.title || "Role",
        company: i.job?.company || "",
        roundName: `Round ${i.roundNumber}${i.isFinalRound ? ' (Final)' : ''}`,
        status: i.status === "ASSIGNED" || i.status === "PENDING" ? "Assigned" : i.status === "SCHEDULED" ? "Scheduled" : i.status === "COMPLETED" ? "Completed" : i.status,
        date: i.scheduledAt ? new Date(i.scheduledAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : "",
        time: i.scheduledAt ? new Date(i.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
        assignedDate: new Date(i.createdAt).toLocaleDateString()
      }));
      setInterviews(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const openScheduleModal = (candidate) => {
    setSelectedCandidate(candidate);
    setScheduleData({ date: "", time: "", duration: "60", mode: "Online", link: "", notes: "" });
    setShowModal(true);
  };

  const handleScheduleSubmit = async () => {
    if (!scheduleData.date || !scheduleData.time) {
      alert("Please select a date and time to schedule.");
      return;
    }

    try {
      await axios.post(`http://localhost:3001/api/v1/interviewer/schedule/${selectedCandidate.id}`, {
        date: scheduleData.date,
        time: scheduleData.time,
        mode: scheduleData.mode,
        meetingLink: scheduleData.link,
        location: scheduleData.notes
      }, getAxiosConfig());
      
      setShowModal(false);
      fetchApps();
      alert("Interview Successfully Scheduled!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to schedule interview.");
    }
  };

  const updateStatus = async (id, newStatus) => {
    // 1. Update the local UI state immediately so the card disappears 
    setInterviews(interviews.map(i => i.id === id ? { ...i, status: newStatus } : i));
    
    // 2. Add your backend API call here to persist the status change in the database
    // try {
    //   await axios.patch(`http://localhost:3001/api/v1/interviewer/status/${id}`, { status: newStatus }, getAxiosConfig());
    // } catch (err) {
    //   console.error("Failed to update status on the server", err);
    // }
  };

  const filtered = useMemo(() => {
    return interviews.filter(app => {
      // Check if candidate matches search
      const matchesSearch = app.candidateName?.toLowerCase().includes(search.toLowerCase()) || 
                            app.position?.toLowerCase().includes(search.toLowerCase());
                            
      // Ensure the status is NOT "Completed"
      const isNotCompleted = (app.status || "").toLowerCase() !== "completed";
      
      return matchesSearch && isNotCompleted;
    });
  }, [interviews, search]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p style={{ color: "#64748b" }}>Loading applications...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto", minHeight: "100vh" }}>
      
      {/* Header */}
      <div style={{
        marginBottom: "30px", padding: "30px", background: gradient, borderRadius: "20px", color: "white", boxShadow: "0 10px 30px rgba(20, 184, 166, 0.2)"
      }}>
        <h1 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "8px" }}>
          Applications Queue
        </h1>
        <p style={{ fontSize: "16px", opacity: "0.9", margin: "0" }}>
          Review candidates assigned to you and schedule their interview rounds.
        </p>
      </div>

      <div style={{ background: "white", borderRadius: "16px", padding: "20px", marginBottom: "24px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center" }}>
         <Search size={18} style={{ color: "#94a3b8", marginRight: "10px" }} />
         <input
            type="text"
            placeholder="Search by candidate name or position..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", border: "none", outline: "none", fontSize: "15px" }}
         />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px" }}>
        {filtered.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "#64748b" }}>
            No active applications in your queue.
          </div>
        ) : (
          filtered.map(app => (
            <div key={app.id} style={{
              background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "24px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)", transition: "transform 0.2s"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
                 <div>
                    <h3 style={{ fontSize: "18px", fontWeight: "700", margin: "0 0 5px 0", color: "#0f172a" }}>{app.candidateName}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748b", fontSize: "14px" }}>
                      <Briefcase size={14} /> {app.position} • {app.company || "Company"}
                    </div>
                 </div>
                 {/* Status Dropdown Logic */}
                 <div style={{ position: "relative", alignSelf: "flex-start" }}>
                   <select 
                     value={app.status || "Assigned"} 
                     onChange={(e) => updateStatus(app.id, e.target.value)}
                     style={{
                       appearance: "none",
                       background: (app.status === "Scheduled") ? "#dbeafe" : 
                                   (app.status === "Completed") ? "#dcfce7" : 
                                   (app.status === "Rejected") ? "#fee2e2" : 
                                   (app.status === "Cancelled") ? "#f3f4f6" : 
                                   (app.status === "Rescheduled") ? "#ffedd5" : "#fef3c7",
                       color: (app.status === "Scheduled") ? "#2563eb" : 
                              (app.status === "Completed") ? "#16a34a" : 
                              (app.status === "Rejected") ? "#dc2626" : 
                              (app.status === "Cancelled") ? "#4b5563" : 
                              (app.status === "Rescheduled") ? "#ea580c" : "#d97706",
                       padding: "6px 28px 6px 14px", 
                       borderRadius: "20px", 
                       border: "none", 
                       fontSize: "12px", 
                       fontWeight: "700", 
                       cursor: "pointer", 
                       outline: "none",
                       transition: "background 0.3s ease, color 0.3s ease"
                     }}>
                     <option value="Assigned">Assigned</option>
                     <option value="Scheduled">Scheduled</option>
                     <option value="Completed">Completed</option>
                     <option value="Rejected">Rejected</option>
                     <option value="Cancelled">Cancelled</option>
                     <option value="Rescheduled">Rescheduled</option>
                   </select>
                   <ChevronDown size={14} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", opacity: 0.8, color: (app.status === "Scheduled") ? "#2563eb" : (app.status === "Completed") ? "#16a34a" : (app.status === "Rejected") ? "#dc2626" : (app.status === "Cancelled") ? "#4b5563" : (app.status === "Rescheduled") ? "#ea580c" : "#d97706" }} />
                 </div>
              </div>

              <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "12px", marginBottom: "20px" }}>
                <div style={{ fontSize: "13px", color: "#475569", marginBottom: "6px" }}>
                  <strong>Round:</strong> {app.roundName || "General Interview"}
                </div>
                <div style={{ fontSize: "13px", color: "#475569", marginBottom: "6px" }}>
                  <strong>Assigned By HR:</strong> {app.assignedDate || "Recently"}
                </div>
                {(app.status || "").toLowerCase() === "scheduled" && (
                  <div style={{ fontSize: "13px", color: "#2563eb", fontWeight: "600" }}>
                    Scheduled for: {app.date} at {app.time}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {((app.status || "").toLowerCase() === "assigned" || !app.status) && (
                <button 
                  onClick={() => openScheduleModal(app)}
                  style={{ width: "100%", padding: "12px", background: gradient, color: "white", border: "none", borderRadius: "10px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  <Calendar size={16} /> Schedule Interview
                </button>
              )}
              {(app.status || "").toLowerCase() === "scheduled" && (
                <button disabled style={{ width: "100%", padding: "12px", background: "#e2e8f0", color: "#64748b", border: "none", borderRadius: "10px", fontWeight: "600", cursor: "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <CheckCircle size={16} /> Interview Scheduled
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Scheduling Modal */}
      {showModal && selectedCandidate && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px"
        }}>
          <div style={{ background: "white", borderRadius: "20px", maxWidth: "500px", width: "100%", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>Schedule Interview</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={24} /></button>
            </div>

            <div style={{ padding: "15px", background: "#f8fafc", borderRadius: "12px", marginBottom: "20px" }}>
              <strong>{selectedCandidate.candidateName}</strong> - {selectedCandidate.position}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "5px" }}>Date</label>
                <input type="date" value={scheduleData.date} onChange={(e) => setScheduleData({...scheduleData, date: e.target.value})} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "5px" }}>Time</label>
                <input type="time" value={scheduleData.time} onChange={(e) => setScheduleData({...scheduleData, time: e.target.value})} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "5px" }}>Duration</label>
                <select value={scheduleData.duration} onChange={(e) => setScheduleData({...scheduleData, duration: e.target.value})} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "white" }}>
                  <option value="30">30 min</option>
                  <option value="45">45 min</option>
                  <option value="60">60 min</option>
                  <option value="90">90 min</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "5px" }}>Mode</label>
                <select value={scheduleData.mode} onChange={(e) => setScheduleData({...scheduleData, mode: e.target.value})} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "white" }}>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>
            </div>

            {scheduleData.mode === "Online" && (
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "5px" }}>Meeting Link</label>
                <div style={{ position: "relative" }}>
                  <Video size={16} style={{ position: "absolute", left: "10px", top: "12px", color: "#94a3b8" }} />
                  <input type="text" placeholder="https://meet.google.com/..." value={scheduleData.link} onChange={(e) => setScheduleData({...scheduleData, link: e.target.value})} style={{ width: "100%", padding: "10px 10px 10px 35px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
                </div>
              </div>
            )}

            <div style={{ marginBottom: "25px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "5px" }}>Notes/Instructions</label>
              <textarea rows="3" placeholder="Technical requirements or specific tasks..." value={scheduleData.notes} onChange={(e) => setScheduleData({...scheduleData, notes: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", resize: "vertical" }} />
            </div>

            <button onClick={handleScheduleSubmit} style={{ width: "100%", padding: "14px", background: gradient, color: "white", border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer" }}>
              Confirm Schedule
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default InterviewerApplications;