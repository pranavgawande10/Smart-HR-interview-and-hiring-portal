// Applicants.jsx
import { useState, useEffect } from "react";
import { Search, Filter, Download, Eye, Calendar, Mail, Phone, MapPin, Briefcase } from "lucide-react";
import PageHeader from "../components/PageHeader";

const Applicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Load applicants from localStorage
  useEffect(() => {
    const savedApplicants = localStorage.getItem("jobApplications");
    if (savedApplicants) {
      setApplicants(JSON.parse(savedApplicants));
    } else {
      // Sample applicants data
      const sampleApplicants = [
        {
          id: 1,
          name: "Sarah Johnson",
          email: "sarah.johnson@email.com",
          phone: "+91 98765 43210",
          role: "Frontend Developer",
          jobId: "techcorp-software-engineer",
          appliedDate: "2024-03-15",
          status: "interview",
          experience: "3 years",
          location: "Mumbai, India",
          coverLetter: "I'm passionate about creating beautiful and responsive web applications...",
          resumeUrl: "sarah_johnson_resume.pdf"
        },
        {
          id: 2,
          name: "Michael Chen",
          email: "michael.chen@email.com",
          phone: "+91 87654 32109",
          role: "Backend Developer",
          jobId: "techcorp-backend-developer",
          appliedDate: "2024-03-14",
          status: "pending",
          experience: "4 years",
          location: "Bangalore, India",
          coverLetter: "Experienced backend developer with expertise in Node.js and Python...",
          resumeUrl: "michael_chen_resume.pdf"
        },
        {
          id: 3,
          name: "Priya Sharma",
          email: "priya.sharma@email.com",
          phone: "+91 76543 21098",
          role: "Frontend Developer",
          jobId: "techcorp-software-engineer",
          appliedDate: "2024-03-13",
          status: "reviewed",
          experience: "2 years",
          location: "Pune, India",
          coverLetter: "Creative frontend developer with strong React skills...",
          resumeUrl: "priya_sharma_resume.pdf"
        },
        {
          id: 4,
          name: "Alex Thompson",
          email: "alex.thompson@email.com",
          phone: "+91 65432 10987",
          role: "Full Stack Developer",
          jobId: "techcorp-fullstack-developer",
          appliedDate: "2024-03-12",
          status: "rejected",
          experience: "5 years",
          location: "Hyderabad, India",
          coverLetter: "Full stack developer with experience in MERN stack...",
          resumeUrl: "alex_thompson_resume.pdf"
        },
        {
          id: 5,
          name: "Ananya Reddy",
          email: "ananya.reddy@email.com",
          phone: "+91 54321 09876",
          role: "UI/UX Designer",
          jobId: "techcorp-ui-designer",
          appliedDate: "2024-03-11",
          status: "hired",
          experience: "6 years",
          location: "Chennai, India",
          coverLetter: "Award-winning UI/UX designer with 6+ years of experience...",
          resumeUrl: "ananya_reddy_resume.pdf"
        }
      ];
      setApplicants(sampleApplicants);
      localStorage.setItem("jobApplications", JSON.stringify(sampleApplicants));
    }
  }, []);

  // Update status function
  const updateStatus = (applicantId, newStatus) => {
    const updatedApplicants = applicants.map(applicant =>
      applicant.id === applicantId ? { ...applicant, status: newStatus } : applicant
    );
    setApplicants(updatedApplicants);
    localStorage.setItem("jobApplications", JSON.stringify(updatedApplicants));
  };

  // Filter applicants based on search and status
  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch = applicant.name.toLowerCase().includes(search.toLowerCase()) ||
                          applicant.role.toLowerCase().includes(search.toLowerCase()) ||
                          applicant.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || applicant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Get status badge style
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "#f59e0b", bg: "#fef3c7", label: "Pending Review" },
      reviewed: { color: "#3b82f6", bg: "#dbeafe", label: "Reviewed" },
      interview: { color: "#8b5cf6", bg: "#ede9fe", label: "Interview" },
      hired: { color: "#10b981", bg: "#d1fae5", label: "Hired" },
      rejected: { color: "#ef4444", bg: "#fee2e2", label: "Rejected" }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span style={{
        background: config.bg,
        color: config.color,
        padding: "6px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "500",
        display: "inline-block"
      }}>
        {config.label}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status color for dropdown
  const getStatusColor = (status) => {
    const colors = {
      pending: "#f59e0b",
      reviewed: "#3b82f6",
      interview: "#8b5cf6",
      hired: "#10b981",
      rejected: "#ef4444"
    };
    return colors[status] || "#6b7280";
  };

  // Stats calculation
  const stats = {
    total: applicants.length,
    pending: applicants.filter(a => a.status === "pending").length,
    interview: applicants.filter(a => a.status === "interview").length,
    hired: applicants.filter(a => a.status === "hired").length
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
      
      {/* Header */}
      <PageHeader
        title="Applicants"
        subtitle="Track and manage candidate applications"
      />

      {/* Stats Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
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
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "8px" }}>Pending Review</p>
          <h3 style={{ fontSize: "32px", fontWeight: "bold", color: "#f59e0b", margin: 0 }}>{stats.pending}</h3>
        </div>
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
        }}>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "8px" }}>Interview Stage</p>
          <h3 style={{ fontSize: "32px", fontWeight: "bold", color: "#8b5cf6", margin: 0 }}>{stats.interview}</h3>
        </div>
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
        }}>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "8px" }}>Hired</p>
          <h3 style={{ fontSize: "32px", fontWeight: "bold", color: "#10b981", margin: 0 }}>{stats.hired}</h3>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div style={{
        background: "white",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        padding: "16px",
        marginBottom: "24px",
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", gap: "12px", flex: "1", minWidth: "250px" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "18px", height: "18px", color: "#94a3b8" }} />
            <input
              type="text"
              placeholder="Search by name, role, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px 10px 38px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none"
              }}
            />
          </div>
          <div style={{ position: "relative", minWidth: "150px" }}>
            <Filter style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "#94a3b8" }} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px 10px 36px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                background: "white",
                cursor: "pointer"
              }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending Review</option>
              <option value="reviewed">Reviewed</option>
              <option value="interview">Interview</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
        <button style={{
          background: "linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%)",
          color: "white",
          border: "none",
          borderRadius: "8px",
          padding: "10px 20px",
          fontSize: "14px",
          fontWeight: "500",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <Download size={16} />
          Export Data
        </button>
      </div>

      {/* Applicants Table */}
      <div style={{
        background: "white",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ padding: "16px", textAlign: "left", fontSize: "13px", fontWeight: "600", color: "#475569" }}>Applicant</th>
                <th style={{ padding: "16px", textAlign: "left", fontSize: "13px", fontWeight: "600", color: "#475569" }}>Role</th>
                <th style={{ padding: "16px", textAlign: "left", fontSize: "13px", fontWeight: "600", color: "#475569" }}>Applied Date</th>
                <th style={{ padding: "16px", textAlign: "left", fontSize: "13px", fontWeight: "600", color: "#475569" }}>Status</th>
                <th style={{ padding: "16px", textAlign: "center", fontSize: "13px", fontWeight: "600", color: "#475569" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplicants.map((applicant) => (
                <tr key={applicant.id} style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#fafbfc"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                >
                  <td style={{ padding: "16px" }}>
                    <div>
                      <div style={{ fontWeight: "600", color: "#0f172a", marginBottom: "4px" }}>{applicant.name}</div>
                      <div style={{ fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <Mail size={12} /> {applicant.email}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <Phone size={12} /> {applicant.phone}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <div>
                      <div style={{ fontWeight: "500", color: "#0f172a", marginBottom: "4px" }}>{applicant.role}</div>
                      <div style={{ fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Briefcase size={12} /> {applicant.experience}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "16px", color: "#475569", fontSize: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Calendar size={14} style={{ color: "#94a3b8" }} />
                      {formatDate(applicant.appliedDate)}
                    </div>
                  </td>
                  <td style={{ padding: "16px" }}>
                    {getStatusBadge(applicant.status)}
                  </td>
                  <td style={{ padding: "16px", textAlign: "center" }}>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                      <button
                        onClick={() => {
                          setSelectedApplicant(applicant);
                          setShowModal(true);
                        }}
                        style={{
                          background: "transparent",
                          border: "1px solid #e2e8f0",
                          borderRadius: "6px",
                          padding: "6px 12px",
                          fontSize: "12px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          color: "#475569"
                        }}
                      >
                        <Eye size={14} />
                        View
                      </button>
                      <select
                        value={applicant.status}
                        onChange={(e) => updateStatus(applicant.id, e.target.value)}
                        style={{
                          padding: "6px 12px",
                          border: "1px solid #e2e8f0",
                          borderRadius: "6px",
                          fontSize: "12px",
                          background: "white",
                          cursor: "pointer",
                          color: getStatusColor(applicant.status)
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="interview">Interview</option>
                        <option value="hired">Hired</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredApplicants.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>
            <p style={{ fontSize: "16px" }}>No applicants found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Applicant Details Modal */}
      {showModal && selectedApplicant && (
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
        }} onClick={() => setShowModal(false)}>
          <div style={{
            background: "white",
            borderRadius: "16px",
            maxWidth: "600px",
            width: "100%",
            maxHeight: "80vh",
            overflowY: "auto",
            padding: "24px"
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>Applicant Details</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "transparent", border: "none", fontSize: "24px", cursor: "pointer", color: "#64748b" }}>×</button>
            </div>
            
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#0f172a", marginBottom: "12px" }}>Personal Information</h3>
              <div style={{ display: "grid", gap: "12px" }}>
                <div><strong>Name:</strong> {selectedApplicant.name}</div>
                <div><strong>Email:</strong> {selectedApplicant.email}</div>
                <div><strong>Phone:</strong> {selectedApplicant.phone}</div>
                <div><strong>Location:</strong> {selectedApplicant.location}</div>
                <div><strong>Experience:</strong> {selectedApplicant.experience}</div>
                <div><strong>Applied for:</strong> {selectedApplicant.role}</div>
                <div><strong>Applied on:</strong> {formatDate(selectedApplicant.appliedDate)}</div>
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#0f172a", marginBottom: "12px" }}>Cover Letter</h3>
              <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "8px", color: "#475569", lineHeight: "1.6" }}>
                {selectedApplicant.coverLetter}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#0f172a", marginBottom: "12px" }}>Resume</h3>
              <button style={{
                background: "linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "10px 20px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <Download size={16} />
                Download Resume
              </button>
            </div>

            <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #e2e8f0", display: "flex", gap: "12px" }}>
              <select
                value={selectedApplicant.status}
                onChange={(e) => {
                  updateStatus(selectedApplicant.id, e.target.value);
                  setSelectedApplicant({ ...selectedApplicant, status: e.target.value });
                }}
                style={{
                  flex: 1,
                  padding: "10px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "14px",
                  cursor: "pointer"
                }}
              >
                <option value="pending">Pending Review</option>
                <option value="reviewed">Reviewed</option>
                <option value="interview">Schedule Interview</option>
                <option value="hired">Hire</option>
                <option value="rejected">Reject</option>
              </select>
              <button onClick={() => setShowModal(false)} style={{
                padding: "10px 24px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                background: "white",
                cursor: "pointer"
              }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applicants;