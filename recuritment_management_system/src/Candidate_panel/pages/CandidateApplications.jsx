import { useState, useEffect } from "react";
import { 
  Briefcase, 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  ChevronRight
} from "lucide-react";

const CandidateApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Load applications from localStorage
    const savedApplications = localStorage.getItem("candidateApplications");
    if (savedApplications) {
      setApplications(JSON.parse(savedApplications));
    } else {
      // Sample applications data
      const sampleApplications = [
        {
          id: 1,
          jobTitle: "Software Engineer",
          company: "Google",
          location: "Mumbai, India",
          appliedDate: "2024-03-15",
          status: "reviewing",
          salary: "₹4,500/hour",
          jobType: "Full Time",
          experience: "Junior Level",
          applicationStatus: "Application under review",
          interviewDate: null,
          feedback: null
        },
        {
          id: 2,
          jobTitle: "Backend Developer",
          company: "Amazon",
          location: "Hyderabad, India",
          appliedDate: "2024-03-14",
          status: "interview",
          salary: "₹5,000/hour",
          jobType: "Full Time",
          experience: "Mid Level",
          applicationStatus: "Interview scheduled",
          interviewDate: "2024-03-25",
          interviewTime: "10:00 AM",
          interviewLink: "https://meet.google.com/abc-defg-hij",
          feedback: null
        },
        {
          id: 3,
          jobTitle: "Frontend Developer",
          company: "Microsoft",
          location: "Bangalore, India",
          appliedDate: "2024-03-13",
          status: "shortlisted",
          salary: "₹6,000/hour",
          jobType: "Full Time",
          experience: "Senior Level",
          applicationStatus: "Shortlisted for next round",
          interviewDate: "2024-03-28",
          interviewTime: "2:00 PM",
          interviewLink: "https://meet.google.com/xyz-abcd-efg",
          feedback: null
        },
        {
          id: 4,
          jobTitle: "UI/UX Designer",
          company: "TCS",
          location: "Pune, India",
          appliedDate: "2024-03-10",
          status: "rejected",
          salary: "₹3,500/hour",
          jobType: "Full Time",
          experience: "Junior Level",
          applicationStatus: "Application not selected",
          interviewDate: null,
          feedback: "We appreciate your interest but have moved forward with other candidates."
        },
        {
          id: 5,
          jobTitle: "DevOps Engineer",
          company: "Infosys",
          location: "Chennai, India",
          appliedDate: "2024-03-08",
          status: "hired",
          salary: "₹7,000/hour",
          jobType: "Full Time",
          experience: "Senior Level",
          applicationStatus: "Offer extended - Congratulations!",
          interviewDate: "2024-03-20",
          interviewTime: "11:00 AM",
          interviewLink: "https://meet.google.com/ijk-lmno-pqr",
          feedback: "Excellent technical skills and communication. Welcome to the team!"
        }
      ];
      setApplications(sampleApplications);
      localStorage.setItem("candidateApplications", JSON.stringify(sampleApplications));
    }
    setLoading(false);
  }, []);

  const getStatusBadge = (status) => {
    const styles = {
      reviewing: { color: "#3b82f6", bg: "#dbeafe", label: "Under Review", icon: Clock },
      interview: { color: "#8b5cf6", bg: "#ede9fe", label: "Interview Scheduled", icon: Calendar },
      shortlisted: { color: "#f59e0b", bg: "#fef3c7", label: "Shortlisted", icon: CheckCircle },
      hired: { color: "#10b981", bg: "#d1fae5", label: "Selected", icon: CheckCircle },
      rejected: { color: "#ef4444", bg: "#fee2e2", label: "Not Selected", icon: XCircle }
    };
    const config = styles[status] || styles.reviewing;
    const Icon = config.icon;
    return (
      <span style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        background: config.bg,
        color: config.color,
        padding: "6px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "500"
      }}>
        <Icon size={12} />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredApplications = applications.filter(app => {
    if (filter === "all") return true;
    return app.status === filter;
  });

  const stats = {
    total: applications.length,
    reviewing: applications.filter(a => a.status === "reviewing").length,
    interview: applications.filter(a => a.status === "interview").length,
    hired: applications.filter(a => a.status === "hired").length
  };

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "400px"
      }}>
        <p style={{ color: "#64748b" }}>Loading your applications...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      
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
          My Applications
        </h1>
        <p style={{ fontSize: "16px", opacity: "0.9", margin: "0", color: "rgba(255, 255, 255, 0.9)" }}>
          Track the status of all your job applications
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
        marginBottom: "30px"
      }}>
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
        }}>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "8px" }}>Total Applications</p>
          <h3 style={{ fontSize: "32px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>{stats.total}</h3>
        </div>
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
        }}>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "8px" }}>Under Review</p>
          <h3 style={{ fontSize: "32px", fontWeight: "bold", color: "#3b82f6", margin: 0 }}>{stats.reviewing}</h3>
        </div>
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
        }}>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "8px" }}>Interviews</p>
          <h3 style={{ fontSize: "32px", fontWeight: "bold", color: "#8b5cf6", margin: 0 }}>{stats.interview}</h3>
        </div>
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
        }}>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "8px" }}>Selected</p>
          <h3 style={{ fontSize: "32px", fontWeight: "bold", color: "#10b981", margin: 0 }}>{stats.hired}</h3>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: "flex",
        gap: "12px",
        marginBottom: "24px",
        flexWrap: "wrap",
        borderBottom: "1px solid #e2e8f0",
        paddingBottom: "12px"
      }}>
        {["all", "reviewing", "interview", "shortlisted", "hired", "rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              background: filter === tab ? "linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%)" : "transparent",
              color: filter === tab ? "white" : "#64748b",
              border: "none",
              borderRadius: "8px",
              padding: "8px 20px",
              fontSize: "14px",
              fontWeight: filter === tab ? "600" : "500",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "60px",
          background: "white",
          borderRadius: "12px",
          border: "1px solid #e2e8f0"
        }}>
          <Briefcase size={48} style={{ color: "#94a3b8", marginBottom: "16px" }} />
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", marginBottom: "8px" }}>
            No applications found
          </h3>
          <p style={{ color: "#64748b" }}>
            You haven't applied for any jobs yet. Browse jobs and start your journey!
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {filteredApplications.map((application) => (
            <div
              key={application.id}
              style={{
                background: "white",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                overflow: "hidden",
                transition: "all 0.3s ease",
                cursor: "pointer"
              }}
              onClick={() => setSelectedApplication(application)}
            >
              <div style={{ padding: "20px" }}>
                {/* Header */}
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
                      {application.jobTitle}
                    </h3>
                    <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
                      {application.company}
                    </p>
                  </div>
                  {getStatusBadge(application.status)}
                </div>

                {/* Details */}
                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "20px",
                  marginBottom: "16px",
                  paddingBottom: "16px",
                  borderBottom: "1px solid #f1f5f9"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <MapPin size={16} style={{ color: "#94a3b8" }} />
                    <span style={{ fontSize: "14px", color: "#475569" }}>{application.location}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Briefcase size={16} style={{ color: "#94a3b8" }} />
                    <span style={{ fontSize: "14px", color: "#475569" }}>{application.jobType}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Clock size={16} style={{ color: "#94a3b8" }} />
                    <span style={{ fontSize: "14px", color: "#475569" }}>{application.experience}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Calendar size={16} style={{ color: "#94a3b8" }} />
                    <span style={{ fontSize: "14px", color: "#475569" }}>
                      Applied on {formatDate(application.appliedDate)}
                    </span>
                  </div>
                </div>

                {/* Status Message */}
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
                    {application.applicationStatus}
                  </div>
                  <button style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "transparent",
                    border: "none",
                    color: "rgb(20, 184, 166)",
                    fontSize: "13px",
                    fontWeight: "500",
                    cursor: "pointer"
                  }}>
                    View Details
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Application Details Modal */}
      {selectedApplication && (
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
        }} onClick={() => setSelectedApplication(null)}>
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
                Application Details
              </h2>
              <button 
                onClick={() => setSelectedApplication(null)} 
                style={{ background: "transparent", border: "none", fontSize: "24px", cursor: "pointer", color: "#64748b" }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#0f172a", marginBottom: "12px" }}>
                Job Information
              </h3>
              <div style={{ display: "grid", gap: "12px" }}>
                <div><strong>Position:</strong> {selectedApplication.jobTitle}</div>
                <div><strong>Company:</strong> {selectedApplication.company}</div>
                <div><strong>Location:</strong> {selectedApplication.location}</div>
                <div><strong>Salary:</strong> {selectedApplication.salary}</div>
                <div><strong>Job Type:</strong> {selectedApplication.jobType}</div>
                <div><strong>Experience Level:</strong> {selectedApplication.experience}</div>
                <div><strong>Applied on:</strong> {formatDate(selectedApplication.appliedDate)}</div>
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#0f172a", marginBottom: "12px" }}>
                Application Status
              </h3>
              <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "8px" }}>
                {getStatusBadge(selectedApplication.status)}
                <p style={{ marginTop: "12px", fontSize: "14px", color: "#475569" }}>
                  {selectedApplication.applicationStatus}
                </p>
                {selectedApplication.feedback && (
                  <p style={{ marginTop: "12px", fontSize: "14px", color: "#475569", paddingTop: "12px", borderTop: "1px solid #e2e8f0" }}>
                    <strong>Feedback:</strong> {selectedApplication.feedback}
                  </p>
                )}
              </div>
            </div>

            {selectedApplication.interviewDate && (
              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#0f172a", marginBottom: "12px" }}>
                  Interview Details
                </h3>
                <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "8px" }}>
                  <div><strong>Date:</strong> {selectedApplication.interviewDate}</div>
                  <div style={{ marginTop: "8px" }}><strong>Time:</strong> {selectedApplication.interviewTime}</div>
                  {selectedApplication.interviewLink && (
                    <div style={{ marginTop: "12px" }}>
                      <a 
                        href={selectedApplication.interviewLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-block",
                          background: "linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%)",
                          color: "white",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          textDecoration: "none",
                          fontSize: "14px",
                          fontWeight: "500"
                        }}
                      >
                        Join Interview
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
              <button 
                onClick={() => setSelectedApplication(null)} 
                style={{ flex: 1, padding: "12px", border: "1px solid #e2e8f0", borderRadius: "8px", background: "white", cursor: "pointer" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateApplications;