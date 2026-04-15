import { useState, useEffect, useMemo } from "react";
import { Search, Calendar, Briefcase, Plus, X, Clock, Video, FileText, CheckCircle, ChevronDown, User, MapPin, Mail } from "lucide-react";

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
  const currentInterviewer = "John Doe (Tech Lead)";

  const fetchApps = () => {
    // We parse 'hrInterviews' mapping assigning candidates from HR
    const saved = JSON.parse(localStorage.getItem("hrInterviews") || "[]");
    
    // Fallback if none so we can see the UI layout
    if (saved.length === 0) {
      const dummyApps = [
        {
          id: 101, candidateName: "Emma Watson", position: "Data Scientist", company: "Company Inc", roundName: "Technical Round", status: "Assigned", assignedDate: "2024-04-10", interviewers: [currentInterviewer]
        },
        {
          id: 102, candidateName: "James Bond", position: "Security Analyst", company: "Company Inc", roundName: "System Design", status: "Assigned", assignedDate: "2024-04-11", interviewers: [currentInterviewer]
        }
      ];
      setInterviews(dummyApps);
      localStorage.setItem("hrInterviews", JSON.stringify(dummyApps));
    } else {
      // Filter ones where interviewer is assigned
      const myApps = saved.filter(i => (i.interviewers || []).includes(currentInterviewer) || i.interviewer === currentInterviewer);
      setInterviews(myApps);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApps();
    window.addEventListener("localInterviewsChanged", fetchApps);
    return () => window.removeEventListener("localInterviewsChanged", fetchApps);
  }, []);

  const openScheduleModal = (candidate) => {
    setSelectedCandidate(candidate);
    setScheduleData({ date: "", time: "", duration: "60", mode: "Online", link: "", notes: "" });
    setShowModal(true);
  };

  const handleScheduleSubmit = () => {
    if (!scheduleData.date || !scheduleData.time) {
      alert("Please select a date and time to schedule.");
      return;
    }

    const updated = interviews.map(i => {
      if (i.id === selectedCandidate.id) {
        return { 
          ...i, 
          status: "Scheduled", 
          date: scheduleData.date, 
          time: scheduleData.time, 
          duration: scheduleData.duration,
          type: scheduleData.mode,
          link: scheduleData.link,
          notes: scheduleData.notes
        };
      }
      return i;
    });

    setInterviews(updated);
    // Persist globally
    const hrInts = JSON.parse(localStorage.getItem("hrInterviews") || "[]");
    const merged = hrInts.map(h => {
      const u = updated.find(x => x.id === h.id);
      return u ? u : h;
    });
    // In case dummy data wasn't in hrInts
    updated.forEach(u => {
      if (!merged.find(m => m.id === u.id)) merged.push(u);
    });
    localStorage.setItem("hrInterviews", JSON.stringify(merged));
    window.dispatchEvent(new Event("localInterviewsChanged"));
    
    setShowModal(false);
  };

  const updateStatus = (id, newStatus) => {
    const updated = interviews.map(i => i.id === id ? { ...i, status: newStatus } : i);
    setInterviews(updated);
    
    // Persist globally
    const hrInts = JSON.parse(localStorage.getItem("hrInterviews") || "[]");
    const merged = hrInts.map(h => h.id === id ? { ...h, status: newStatus } : h);
    localStorage.setItem("hrInterviews", JSON.stringify(merged));
    window.dispatchEvent(new Event("localInterviewsChanged"));
  };

  const filtered = useMemo(() => {
    return interviews.filter(app => {
      return app.candidateName?.toLowerCase().includes(search.toLowerCase()) || 
             app.position?.toLowerCase().includes(search.toLowerCase());
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
        {filtered.map(app => (
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
        ))}
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