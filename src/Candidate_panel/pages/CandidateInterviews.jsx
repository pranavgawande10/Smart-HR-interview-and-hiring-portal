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

const CandidateInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedInterviewForAction, setSelectedInterviewForAction] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);
  const [rescheduleData, setRescheduleData] = useState({
    newDate: "",
    newTime: "",
    reason: ""
  });
  const [cancelData, setCancelData] = useState({
    reason: ""
  });
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const savedInterviews = localStorage.getItem("candidateInterviews");
    if (savedInterviews) {
      setInterviews(JSON.parse(savedInterviews));
    } else {
      const sampleInterviews = [
        {
          id: 1,
          jobTitle: "Software Engineer",
          company: "Google",
          interviewer: "John Doe (Tech Lead)",
          date: "2024-03-25",
          time: "10:00 AM",
          duration: "60",
          type: "video",
          link: "https://meet.google.com/abc-defg-hij",
          status: "scheduled",
          notes: "Technical interview focusing on React and System Design"
        },
        {
          id: 2,
          jobTitle: "Backend Developer",
          company: "Amazon",
          interviewer: "Jane Smith (HR)",
          date: "2024-03-26",
          time: "2:00 PM",
          duration: "45",
          type: "phone",
          phoneNumber: "+91 98765 43210",
          status: "scheduled",
          notes: "HR Round - Discussion about experience"
        },
        {
          id: 3,
          jobTitle: "Frontend Developer",
          company: "Microsoft",
          interviewer: "Emily Davis (Design Lead)",
          date: "2024-03-20",
          time: "11:30 AM",
          duration: "60",
          type: "video",
          link: "https://meet.google.com/xyz-abcd-efg",
          status: "completed",
          notes: "Portfolio review completed",
          feedback: "Strong technical skills. Moving to next round."
        },
        {
          id: 4,
          jobTitle: "DevOps Engineer",
          company: "Infosys",
          interviewer: "David Miller (DevOps Lead)",
          date: "2024-03-18",
          time: "3:00 PM",
          duration: "90",
          type: "inperson",
          location: "Infosys Campus, Pune",
          status: "completed",
          notes: "Technical and HR discussion",
          feedback: "Excellent performance. Congratulations!"
        }
      ];
      setInterviews(sampleInterviews);
      localStorage.setItem("candidateInterviews", JSON.stringify(sampleInterviews));
    }
    setLoading(false);
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const sendEmailNotification = (interview, action, details) => {
    const emailData = {
      to: "hr@company.com",
      subject: `Interview ${action} Request - ${interview.jobTitle} at ${interview.company}`,
      body: `Dear HR Team,\n\nCandidate has requested to ${action} the interview scheduled on ${interview.date} at ${interview.time}.\n\nInterview Details:\n- Position: ${interview.jobTitle}\n- Company: ${interview.company}\n- Original Date: ${interview.date}\n- Original Time: ${interview.time}\n\n${action === "reschedule" ? `Request Details:\n- Proposed New Date: ${details.newDate}\n- Proposed New Time: ${details.newTime}\n- Reason: ${details.reason}` : `Cancellation Reason: ${details.reason}`}\n\nPlease take necessary action.\n\nRegards,\nCandidate Portal`
    };
    
    const sentEmails = JSON.parse(localStorage.getItem("sentEmails") || "[]");
    sentEmails.push({ ...emailData, sentAt: new Date().toISOString(), interviewId: interview.id });
    localStorage.setItem("sentEmails", JSON.stringify(sentEmails));
    return true;
  };

  const handleRescheduleRequest = () => {
    if (!rescheduleData.newDate || !rescheduleData.newTime || !rescheduleData.reason) {
      showNotification("Please fill all fields", "error");
      return;
    }

    const updatedInterviews = interviews.map(interview => {
      if (interview.id === selectedInterviewForAction.id) {
        return {
          ...interview,
          status: "reschedule_requested",
          rescheduleRequest: {
            requestedDate: rescheduleData.newDate,
            requestedTime: rescheduleData.newTime,
            reason: rescheduleData.reason,
            requestedAt: new Date().toISOString()
          }
        };
      }
      return interview;
    });

    setInterviews(updatedInterviews);
    localStorage.setItem("candidateInterviews", JSON.stringify(updatedInterviews));
    sendEmailNotification(selectedInterviewForAction, "reschedule", rescheduleData);
    showNotification("Reschedule request sent successfully!", "success");
    
    setShowRescheduleModal(false);
    setSelectedInterviewForAction(null);
    setRescheduleData({ newDate: "", newTime: "", reason: "" });
    setShowDropdown(null);
  };

  const handleCancelRequest = () => {
    if (!cancelData.reason) {
      showNotification("Please provide a reason", "error");
      return;
    }

    const updatedInterviews = interviews.map(interview => {
      if (interview.id === selectedInterviewForAction.id) {
        return {
          ...interview,
          status: "cancellation_requested",
          cancelRequest: {
            reason: cancelData.reason,
            requestedAt: new Date().toISOString()
          }
        };
      }
      return interview;
    });

    setInterviews(updatedInterviews);
    localStorage.setItem("candidateInterviews", JSON.stringify(updatedInterviews));
    sendEmailNotification(selectedInterviewForAction, "cancel", cancelData);
    showNotification("Cancellation request sent successfully!", "success");
    
    setShowCancelModal(false);
    setSelectedInterviewForAction(null);
    setCancelData({ reason: "" });
    setShowDropdown(null);
  };

  const getStatusBadge = (status) => {
    const styles = {
      scheduled: { color: "#3b82f6", bg: "#dbeafe", label: "Scheduled" },
      completed: { color: "#10b981", bg: "#d1fae5", label: "Completed" },
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
      
      {/* Notification */}
      {notification && (
        <div style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          background: notification.type === "success" ? "#10b981" : "#ef4444",
          color: "white",
          padding: "12px 20px",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          zIndex: 1000,
          animation: "slideIn 0.3s ease"
        }}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div style={{
        marginBottom: "30px",
        padding: "25px",
        background: "linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%)",
        borderRadius: "16px",
        color: "white",
        boxShadow: "0 4px 20px rgba(20, 184, 166, 0.3)"
      }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px", color: "white" }}>
          My Interviews
        </h1>
        <p style={{ fontSize: "16px", opacity: "0.9", margin: "0", color: "rgba(255, 255, 255, 0.9)" }}>
          View and manage all your interviews
        </p>
      </div>

      {/* All Interviews List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {interviews.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "60px",
            background: "white",
            borderRadius: "12px",
            border: "1px solid #e2e8f0"
          }}>
            <Calendar size={48} style={{ color: "#94a3b8", marginBottom: "16px" }} />
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", marginBottom: "8px" }}>
              No interviews found
            </h3>
            <p style={{ color: "#64748b" }}>You don't have any interviews scheduled.</p>
          </div>
        ) : (
          interviews.map((interview) => (
            <div
              key={interview.id}
              style={{
                background: "white",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                overflow: "hidden",
                transition: "all 0.3s ease"
              }}
            >
              <div style={{ padding: "20px" }}>
                {/* Header with Dropdown */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "16px",
                  flexWrap: "wrap",
                  gap: "12px"
                }}>
                  <div>
                    <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", marginBottom: "4px" }}>
                      {interview.jobTitle}
                    </h3>
                    <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
                      {interview.company}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {getStatusBadge(interview.status)}
                    
                    {/* Dropdown Menu for Actions */}
                    {interview.status === "scheduled" && (
                      <div style={{ position: "relative" }}>
                        <button
                          onClick={() => setShowDropdown(showDropdown === interview.id ? null : interview.id)}
                          style={{
                            background: "transparent",
                            border: "1px solid #e2e8f0",
                            borderRadius: "6px",
                            padding: "6px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center"
                          }}
                        >
                          <MoreVertical size={16} color="#64748b" />
                        </button>
                        
                        {showDropdown === interview.id && (
                          <div style={{
                            position: "absolute",
                            top: "35px",
                            right: "0",
                            background: "white",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            border: "1px solid #e2e8f0",
                            zIndex: 10,
                            minWidth: "180px"
                          }}>
                            <button
                              onClick={() => {
                                setSelectedInterviewForAction(interview);
                                setShowRescheduleModal(true);
                                setShowDropdown(null);
                              }}
                              style={{
                                width: "100%",
                                padding: "10px 16px",
                                textAlign: "left",
                                background: "transparent",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "13px",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                color: "#f59e0b",
                                borderRadius: "8px 8px 0 0"
                              }}
                            >
                              <RefreshCw size={14} />
                              Reschedule Interview
                            </button>
                            <button
                              onClick={() => {
                                setSelectedInterviewForAction(interview);
                                setShowCancelModal(true);
                                setShowDropdown(null);
                              }}
                              style={{
                                width: "100%",
                                padding: "10px 16px",
                                textAlign: "left",
                                background: "transparent",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "13px",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                color: "#ef4444",
                                borderRadius: "0 0 8px 8px",
                                borderTop: "1px solid #e2e8f0"
                              }}
                            >
                              <XCircle size={14} />
                              Cancel Interview
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Interview Details */}
                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "20px",
                  marginBottom: "16px",
                  paddingBottom: "16px",
                  borderBottom: "1px solid #f1f5f9"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Calendar size={16} style={{ color: "#94a3b8" }} />
                    <span style={{ fontSize: "14px", color: "#475569" }}>{formatDate(interview.date)}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Clock size={16} style={{ color: "#94a3b8" }} />
                    <span style={{ fontSize: "14px", color: "#475569" }}>{interview.time} ({interview.duration} min)</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {getInterviewTypeIcon(interview.type)}
                    <span style={{ fontSize: "14px", color: "#475569" }}>
                      {interview.type === "video" ? "Video Interview" : interview.type === "phone" ? "Phone Interview" : "In-person Interview"}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Users size={16} style={{ color: "#94a3b8" }} />
                    <span style={{ fontSize: "14px", color: "#475569" }}>{interview.interviewer}</span>
                  </div>
                </div>

                {/* View Details Button */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "12px"
                }}>
                  <div style={{
                    background: "#f8fafc",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    color: "#475569"
                  }}>
                    {interview.notes}
                  </div>
                  <button
                    onClick={() => setSelectedInterview(interview)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "transparent",
                      border: "none",
                      color: "rgb(20, 184, 166)",
                      fontSize: "13px",
                      fontWeight: "500",
                      cursor: "pointer"
                    }}
                  >
                    View Details
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Interview Details Modal */}
      {selectedInterview && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px"
        }} onClick={() => setSelectedInterview(null)}>
          <div style={{
            background: "white",
            borderRadius: "16px",
            maxWidth: "500px",
            width: "100%",
            maxHeight: "80vh",
            overflowY: "auto",
            padding: "24px"
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>
                Interview Details
              </h2>
              <button onClick={() => setSelectedInterview(null)} style={{ background: "transparent", border: "none", fontSize: "24px", cursor: "pointer", color: "#64748b" }}>×</button>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "grid", gap: "12px" }}>
                <div><strong>Position:</strong> {selectedInterview.jobTitle}</div>
                <div><strong>Company:</strong> {selectedInterview.company}</div>
                <div><strong>Interviewer:</strong> {selectedInterview.interviewer}</div>
                <div><strong>Date:</strong> {formatDate(selectedInterview.date)}</div>
                <div><strong>Time:</strong> {selectedInterview.time}</div>
                <div><strong>Duration:</strong> {selectedInterview.duration} minutes</div>
                <div><strong>Type:</strong> {selectedInterview.type === "video" ? "Video Call" : selectedInterview.type === "phone" ? "Phone Call" : "In-person"}</div>
                {selectedInterview.type === "video" && selectedInterview.link && (
                  <div><strong>Meeting Link:</strong> <a href={selectedInterview.link} target="_blank" rel="noopener noreferrer" style={{ color: "rgb(20, 184, 166)" }}>Join Meeting</a></div>
                )}
                {selectedInterview.type === "phone" && selectedInterview.phoneNumber && (
                  <div><strong>Phone Number:</strong> {selectedInterview.phoneNumber}</div>
                )}
                {selectedInterview.type === "inperson" && selectedInterview.location && (
                  <div><strong>Location:</strong> {selectedInterview.location}</div>
                )}
                <div><strong>Notes:</strong> {selectedInterview.notes}</div>
                {selectedInterview.feedback && <div><strong>Feedback:</strong> {selectedInterview.feedback}</div>}
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
              <button onClick={() => setSelectedInterview(null)} style={{ flex: 1, padding: "12px", border: "1px solid #e2e8f0", borderRadius: "8px", background: "white", cursor: "pointer" }}>Close</button>
              {selectedInterview.status === "scheduled" && selectedInterview.link && (
                <a href={selectedInterview.link} target="_blank" rel="noopener noreferrer" style={{ flex: 1, textAlign: "center", padding: "12px", background: "linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%)", color: "white", borderRadius: "8px", textDecoration: "none" }}>
                  Join Meeting
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedInterviewForAction && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1001,
          padding: "20px"
        }} onClick={() => {
          setShowRescheduleModal(false);
          setSelectedInterviewForAction(null);
        }}>
          <div style={{
            background: "white",
            borderRadius: "16px",
            maxWidth: "450px",
            width: "100%",
            padding: "24px"
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "20px" }}>Reschedule Interview</h2>
            
            <div style={{ marginBottom: "20px", padding: "12px", background: "#f8fafc", borderRadius: "8px" }}>
              <p style={{ margin: 0, fontSize: "14px", color: "#475569" }}>
                <strong>Interview:</strong> {selectedInterviewForAction.jobTitle} at {selectedInterviewForAction.company}
              </p>
              <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "#475569" }}>
                <strong>Original Date:</strong> {formatDate(selectedInterviewForAction.date)} at {selectedInterviewForAction.time}
              </p>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "4px" }}>Proposed New Date *</label>
              <input type="date" value={rescheduleData.newDate} onChange={(e) => setRescheduleData({...rescheduleData, newDate: e.target.value})} style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "4px" }}>Proposed New Time *</label>
              <input type="time" value={rescheduleData.newTime} onChange={(e) => setRescheduleData({...rescheduleData, newTime: e.target.value})} style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "4px" }}>Reason for Reschedule *</label>
              <textarea rows="3" value={rescheduleData.reason} onChange={(e) => setRescheduleData({...rescheduleData, reason: e.target.value})} placeholder="Please provide a valid reason..." style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px", resize: "vertical" }} />
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => { setShowRescheduleModal(false); setSelectedInterviewForAction(null); }} style={{ flex: 1, padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px", background: "white", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleRescheduleRequest} style={{ flex: 1, padding: "10px", background: "linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>Submit Request</button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && selectedInterviewForAction && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1001,
          padding: "20px"
        }} onClick={() => {
          setShowCancelModal(false);
          setSelectedInterviewForAction(null);
        }}>
          <div style={{
            background: "white",
            borderRadius: "16px",
            maxWidth: "450px",
            width: "100%",
            padding: "24px"
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "20px" }}>Cancel Interview</h2>
            
            <div style={{ marginBottom: "20px", padding: "12px", background: "#f8fafc", borderRadius: "8px" }}>
              <p style={{ margin: 0, fontSize: "14px", color: "#475569" }}>
                <strong>Interview:</strong> {selectedInterviewForAction.jobTitle} at {selectedInterviewForAction.company}
              </p>
              <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "#475569" }}>
                <strong>Scheduled Date:</strong> {formatDate(selectedInterviewForAction.date)} at {selectedInterviewForAction.time}
              </p>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "4px" }}>Reason for Cancellation *</label>
              <textarea rows="3" value={cancelData.reason} onChange={(e) => setCancelData({...cancelData, reason: e.target.value})} placeholder="Please provide a valid reason..." style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px", resize: "vertical" }} />
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => { setShowCancelModal(false); setSelectedInterviewForAction(null); }} style={{ flex: 1, padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px", background: "white", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleCancelRequest} style={{ flex: 1, padding: "10px", background: "#ef4444", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>Submit Cancellation</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default CandidateInterviews;