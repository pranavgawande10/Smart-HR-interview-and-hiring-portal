import { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  Video, 
  Phone, 
  MapPin, 
  Users, 
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  RefreshCw,
  MoreVertical
} from "lucide-react";
import axios from "axios";

const CandidateInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedInterviewForAction, setSelectedInterviewForAction] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);
  
  const [rescheduleData, setRescheduleData] = useState({
    reason: ""
  });
  
  const [cancelData, setCancelData] = useState({
    reason: ""
  });
  const [notification, setNotification] = useState(null);

  const tealGradient = "linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%)";

  const getAxiosConfig = () => ({
    withCredentials: true,
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });

  const fetchInterviews = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/v1/candidates/my-interviews", getAxiosConfig());
      
      const mapped = res.data.interviews
        .filter(inv => inv.status !== "COMPLETED") 
        .map(inv => ({
          id: inv._id,
          jobTitle: inv.job?.title || "Unknown Base",
          company: inv.job?.company || "Unknown Company",
          interviewer: inv.interviewer?.name || "Pending Interviewer",
          date: inv.scheduledAt ? new Date(inv.scheduledAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : "Not Set",
          time: inv.scheduledAt ? new Date(inv.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Not Set",
          duration: "60",
          type: (inv.mode || "video").toLowerCase(),
          link: inv.meetingLink || "",
          location: inv.location || "",
          status: inv.status === "SCHEDULED" && inv.candidateResponse === "REQUEST_RESCHEDULE" ? "reschedule_requested" : inv.status === "CANCELLED" ? "cancellation_requested" : inv.status.toLowerCase(),
          notes: inv.location || "Pending instructions.",
          feedback: inv.feedback || ""
        }));
        
      setInterviews(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleRescheduleRequest = async () => {
    if (!rescheduleData.reason.trim()) {
      showNotification("Please provide a reason for the reschedule request.", "error");
      return;
    }

    try {
      await axios.patch(`http://localhost:3001/api/v1/candidates/request-reschedule/${selectedInterviewForAction.id}`, {
        reason: rescheduleData.reason
      }, getAxiosConfig());
      
      showNotification("Reschedule request sent. The interviewer will assign a new time.", "success");
      fetchInterviews();
      setShowRescheduleModal(false);
      setSelectedInterviewForAction(null);
      setRescheduleData({ reason: "" }); 
      setShowDropdown(null);
    } catch (err) {
      showNotification("Failed to send reschedule request", "error");
    }
  };

  const handleCancelRequest = async () => {
    if (!cancelData.reason) {
      showNotification("Please provide a reason", "error");
      return;
    }

    try {
      await axios.patch(`http://localhost:3001/api/v1/candidates/respond/${selectedInterviewForAction.id}`, {
        response: "REJECTED",
        reason: cancelData.reason
      }, getAxiosConfig());
      
      showNotification("Cancellation request sent successfully!", "success");
      fetchInterviews();
      setShowCancelModal(false);
      setSelectedInterviewForAction(null);
      setCancelData({ reason: "" });
      setShowDropdown(null);
    } catch (err) {
      showNotification("Failed to cancel interview", "error");
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      scheduled: { color: "#3b82f6", bg: "#dbeafe", label: "Scheduled" },
      reschedule_requested: { color: "#f59e0b", bg: "#fef3c7", label: "Reschedule Requested" },
      cancellation_requested: { color: "#f59e0b", bg: "#fef3c7", label: "Cancellation Requested" }
    };
    const config = styles[status] || styles.scheduled;
    return (
      <span style={{
        display: "inline-flex",
        alignItems: "center",
        background: config.bg,
        color: config.color,
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "500"
      }}>
        {config.label}
      </span>
    );
  };

  const getInterviewTypeIcon = (type) => {
    const icons = { video: Video, phone: Phone, inperson: MapPin };
    const Icon = icons[type] || Video;
    return <Icon size={16} />;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <p style={{ color: "#64748b" }}>Loading your interviews...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      
      {notification && (
        <div style={{
          position: "fixed", top: "20px", right: "20px",
          background: notification.type === "success" ? "#10b981" : "#ef4444",
          color: "white", padding: "12px 20px", borderRadius: "8px", zIndex: 1000,
        }}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div style={{
        marginBottom: "30px", padding: "25px",
        background: tealGradient,
        borderRadius: "16px", color: "white", boxShadow: "0 4px 20px rgba(20, 184, 166, 0.3)"
      }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px", color: "white" }}>
          My Active Interviews
        </h1>
        <p style={{ fontSize: "16px", opacity: "0.9", margin: "0", color: "rgba(255, 255, 255, 0.9)" }}>
          Manage your upcoming scheduled interviews
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {interviews.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", background: "white", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <Calendar size={48} style={{ color: "#94a3b8", marginBottom: "16px" }} />
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", marginBottom: "8px" }}>
              No active interviews
            </h3>
            <p style={{ color: "#64748b" }}>You don't have any interviews scheduled currently.</p>
          </div>
        ) : (
          interviews.map((interview) => (
            <div key={interview.id} style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
              <div style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", gap: "12px" }}>
                  <div>
                    <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", marginBottom: "4px" }}>{interview.jobTitle}</h3>
                    <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>{interview.company}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {getStatusBadge(interview.status)}
                    {interview.status === "scheduled" && (
                      <div style={{ position: "relative" }}>
                        <button onClick={() => setShowDropdown(showDropdown === interview.id ? null : interview.id)} style={{ background: "transparent", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "6px", cursor: "pointer" }}>
                          <MoreVertical size={16} color="#64748b" />
                        </button>
                        {showDropdown === interview.id && (
                          <div style={{ position: "absolute", top: "35px", right: "0", background: "white", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", border: "1px solid #e2e8f0", zIndex: 10, minWidth: "180px" }}>
                            <button onClick={() => { setSelectedInterviewForAction(interview); setShowRescheduleModal(true); setShowDropdown(null); }} style={{ width: "100%", padding: "10px 16px", textAlign: "left", background: "transparent", border: "none", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px", color: "#f59e0b" }}>
                              <RefreshCw size={14} /> Request Reschedule
                            </button>
                            <button onClick={() => { setSelectedInterviewForAction(interview); setShowCancelModal(true); setShowDropdown(null); }} style={{ width: "100%", padding: "10px 16px", textAlign: "left", background: "transparent", border: "none", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px", color: "#ef4444", borderTop: "1px solid #e2e8f0" }}>
                              <XCircle size={14} /> Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Calendar size={16} style={{ color: "#94a3b8" }} />
                    <span style={{ fontSize: "14px", color: "#475569" }}>{formatDate(interview.date)}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Clock size={16} style={{ color: "#94a3b8" }} />
                    <span style={{ fontSize: "14px", color: "#475569" }}>{interview.time}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {getInterviewTypeIcon(interview.type)}
                    <span style={{ fontSize: "14px", color: "#475569" }}>{interview.type} Interview</span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                  <div style={{ background: "#f8fafc", padding: "8px 12px", borderRadius: "8px", fontSize: "13px", color: "#475569", flex: 1 }}>{interview.notes}</div>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    {/* ADDED: Join Button on the card */}
                    {interview.link && (
                      <a 
                        href={interview.link.startsWith("http") ? interview.link : `https://${interview.link}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          textDecoration: "none",
                          background: tealGradient,
                          color: "white",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        <Video size={14} /> Join Now
                      </a>
                    )}

                    <button onClick={() => setSelectedInterview(interview)} style={{ background: "transparent", border: "none", color: "rgb(20, 184, 166)", fontSize: "13px", fontWeight: "500", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                      View Details <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1001, padding: "20px" }}>
          <div style={{ background: "white", borderRadius: "16px", maxWidth: "450px", width: "100%", padding: "24px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px" }}>Request Reschedule</h2>
            <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "20px" }}>
              Please explain why you cannot attend. The interviewer will be notified and will propose a new date/time.
            </p>
            
            <textarea 
              placeholder="Provide your reason here..." 
              value={rescheduleData.reason} 
              onChange={(e) => setRescheduleData({ reason: e.target.value })} 
              style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "8px", height: "120px", marginBottom: "20px", resize: "none" }} 
            />

            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => { setShowRescheduleModal(false); setRescheduleData({ reason: "" }); }} style={{ flex: 1, padding: "12px", background: "#f1f5f9", border: "none", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleRescheduleRequest} style={{ flex: 1, padding: "12px", background: tealGradient, color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>Send Request</button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedInterview && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }} onClick={() => setSelectedInterview(null)}>
          <div style={{ background: "white", borderRadius: "16px", maxWidth: "500px", width: "100%", padding: "24px" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>Interview Details</h2>
              <button onClick={() => setSelectedInterview(null)} style={{ background: "transparent", border: "none", fontSize: "24px", cursor: "pointer" }}>×</button>
            </div>
            <div style={{ display: "grid", gap: "12px", fontSize: "15px" }}>
              <div><strong>Company:</strong> {selectedInterview.company}</div>
              <div><strong>Interviewer:</strong> {selectedInterview.interviewer}</div>
              <div><strong>Date:</strong> {formatDate(selectedInterview.date)}</div>
              <div><strong>Time:</strong> {selectedInterview.time}</div>
            </div>
            <button onClick={() => setSelectedInterview(null)} style={{ width: "100%", marginTop: "24px", padding: "12px", background: tealGradient, color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateInterviews;