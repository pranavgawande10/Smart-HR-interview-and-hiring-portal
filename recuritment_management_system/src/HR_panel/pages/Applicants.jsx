import { useState, useEffect } from "react";
import { FileText, ChevronDown } from "lucide-react";

const Applicants = () => {
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [interviewers, setInterviewers] = useState([]);
  const [activeTabs, setActiveTabs] = useState({}); // { jobId: "total" | "shortlisted" }
  
  // Modals state
  const [roundModalOpen, setRoundModalOpen] = useState(false);
  const [selectedApplicantForRound, setSelectedApplicantForRound] = useState(null);
  const [roundData, setRoundData] = useState({ roundName: "", isFinalRound: false });

  // Load data
  useEffect(() => {
    // 2 Dummy Job Postings as requested
    const sampleJobs = [
      {
        id: "job1",
        title: "Senior Product Designer",
        company: "Google",
        location: "San Francisco, CA",
        vacancies: 2
      },
      {
        id: "job2",
        title: "Full Stack Engineer",
        company: "Microsoft",
        location: "Seattle, WA",
        vacancies: 5
      }
    ];
    setJobs(sampleJobs);

    // Dummy applicants (2-3 per job)
    const sampleApplicants = [
      {
        id: 1,
        name: "Sarah Johnson",
        jobId: "job1",
        status: "pending",
        resumeUrl: "#",
        rounds: [],
        assignedInterviewerId: null
      },
      {
        id: 2,
        name: "Michael Chen",
        jobId: "job1",
        status: "Shortlisted",
        resumeUrl: "#",
        rounds: [{ roundName: "Technical Screen", isFinalRound: false }],
        assignedInterviewerId: 1
      },
      {
        id: 3,
        name: "Elena Rodriguez",
        jobId: "job1",
        status: "Rejected",
        resumeUrl: "#",
        rounds: [],
        assignedInterviewerId: null
      },
      {
        id: 4,
        name: "James Wilson",
        jobId: "job2",
        status: "pending",
        resumeUrl: "#",
        rounds: [],
        assignedInterviewerId: null
      },
      {
        id: 5,
        name: "Emily Davis",
        jobId: "job2",
        status: "Shortlisted",
        resumeUrl: "#",
        rounds: [{ roundName: "Behavioral Round", isFinalRound: false }, { roundName: "System Design", isFinalRound: true }],
        assignedInterviewerId: 2
      }
    ];
    setApplicants(sampleApplicants);

    // Sample interviewers
    const sampleInterviewers = [
      { id: 1, name: "John Doe", role: "Senior Technical Interviewer" },
      { id: 2, name: "Jane Smith", role: "HR Interviewer" }
    ];
    setInterviewers(sampleInterviewers);
  }, []);

  // Helpers
  const handleTabChange = (jobId, tab) => {
    setActiveTabs(prev => ({ ...prev, [jobId]: tab }));
  };

  const updateApplicantStatus = (applicantId, newStatus) => {
    const updated = applicants.map(app => 
      app.id === applicantId ? { ...app, status: newStatus } : app
    );
    setApplicants(updated);
  };

  const assignInterviewer = (applicantId, interviewerId) => {
    const updated = applicants.map(app => 
      app.id === applicantId ? { ...app, assignedInterviewerId: interviewerId } : app
    );
    setApplicants(updated);
  };

  const openRoundModal = (applicant) => {
    setSelectedApplicantForRound(applicant);
    setRoundData({ roundName: "", isFinalRound: false });
    setRoundModalOpen(true);
  };

  const handleSaveRound = () => {
    if (!selectedApplicantForRound || !roundData.roundName) return;

    const newRound = {
      roundName: roundData.roundName,
      isFinalRound: roundData.isFinalRound
    };

    const updated = applicants.map(app => {
      if (app.id === selectedApplicantForRound.id) {
        return {
          ...app,
          rounds: [...(app.rounds || []), newRound]
        };
      }
      return app;
    });

    setApplicants(updated);
    setRoundModalOpen(false);
  };

  const viewResume = (applicant) => {
    alert(`Previewing dummy resume for ${applicant.name}... Note: In a real environment, this opens a PDF viewer in a new tab or modal.`);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      
      {/* 1. Page Heading with style matching Dashboard/Interviews */}
      <div style={{
        marginBottom: "30px",
        padding: "25px",
        background: "linear-gradient(135deg,  rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%)",
        borderRadius: "16px",
        color: "white",
        boxShadow: "0 4px 20px rgba(102, 126, 234, 0.3)"
      }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px", color: "white" }}>
          Applicants Overview
        </h1>
        <p style={{ fontSize: "16px", opacity: "0.9", margin: "0", color: "rgba(255, 255, 255, 0.9)" }}>
          Manage your candidate pipeline across all active job postings.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
        {jobs.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", background: "white", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <p style={{ color: "#64748b" }}>No active job postings found. Please create a job to view applicants.</p>
          </div>
        )}

        {/* 2. Job Cards with Dummy Data */}
        {jobs.map(job => {
          // Find applicants for this job
          const jobApplicants = applicants.filter(app => app.jobId === job.id);
          const totalApplicants = jobApplicants;
          const shortlistedApplicants = jobApplicants.filter(app => app.status.toLowerCase() === "shortlisted");
          const selectedApplicants = jobApplicants.filter(app => app.status.toLowerCase() === "selected");
          
          const currentTab = activeTabs[job.id] || "total"; // default to "total"

          return (
            <div key={job.id} style={{
              background: "white",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              overflow: "hidden"
            }}>
              {/* Job Card Header */}
              <div style={{
                padding: "24px",
                borderBottom: "1px solid #e2e8f0",
                background: "linear-gradient(to right, #f8fafc, #ffffff)"
              }}>
                <h2 style={{ margin: "0 0 8px 0", fontSize: "22px", fontWeight: "700", color: "#0f172a" }}>
                  {job.title}
                </h2>
                <div style={{ display: "flex", gap: "24px", fontSize: "14px", color: "#64748b" }}>
                  <span><strong style={{ color: "#475569" }}>Company/Location:</strong> {job.company} / {job.location}</span>
                  <span><strong style={{ color: "#475569" }}>Total Candidates Applied:</strong> {totalApplicants.length}</span>
                </div>
              </div>

              {/* 3. Two Tabs inside each Job Card */}
              <div style={{
                display: "flex",
                borderBottom: "1px solid #e2e8f0",
                background: "#f1f5f9"
              }}>
                <button
                  onClick={() => handleTabChange(job.id, "total")}
                  style={{
                    padding: "16px 24px",
                    background: currentTab === "total" ? "white" : "transparent",
                    border: "none",
                    borderBottom: currentTab === "total" ? "2px solid rgb(20, 184, 166)" : "2px solid transparent",
                    fontWeight: "600",
                    color: currentTab === "total" ? "rgb(20, 184, 166)" : "#64748b",
                    cursor: "pointer",
                    fontSize: "15px",
                    transition: "all 0.2s"
                  }}
                >
                  Total Applicants ({totalApplicants.length})
                </button>
                <button
                  onClick={() => handleTabChange(job.id, "shortlisted")}
                  style={{
                    padding: "16px 24px",
                    background: currentTab === "shortlisted" ? "white" : "transparent",
                    border: "none",
                    borderBottom: currentTab === "shortlisted" ? "2px solid rgb(20, 184, 166)" : "2px solid transparent",
                    fontWeight: "600",
                    color: currentTab === "shortlisted" ? "rgb(20, 184, 166)" : "#64748b",
                    cursor: "pointer",
                    fontSize: "15px",
                    transition: "all 0.2s"
                  }}
                >
                  Shortlisted Candidates ({shortlistedApplicants.length})
                </button>
                <button
                  onClick={() => handleTabChange(job.id, "selected")}
                  style={{
                    padding: "16px 24px",
                    background: currentTab === "selected" ? "white" : "transparent",
                    border: "none",
                    borderBottom: currentTab === "selected" ? "2px solid rgb(20, 184, 166)" : "2px solid transparent",
                    fontWeight: "600",
                    color: currentTab === "selected" ? "rgb(20, 184, 166)" : "#64748b",
                    cursor: "pointer",
                    fontSize: "15px",
                    transition: "all 0.2s"
                  }}
                >
                  Selected Applicants ({selectedApplicants.length})
                </button>
              </div>

              {/* Tab Content */}
              <div style={{ padding: "0" }}>
                
                {/* TOTAL APPLICANTS TAB */}
                {currentTab === "total" && (
                  <div>
                    {totalApplicants.length === 0 ? (
                      <p style={{ textAlign: "center", color: "#94a3b8", padding: "20px" }}>No applicants yet.</p>
                    ) : (
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ background: "white", borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>
                            <th style={{ padding: "16px 24px", color: "#475569", fontWeight: "600", fontSize: "14px" }}>Applicant Name</th>
                            <th style={{ padding: "16px 24px", color: "#475569", fontWeight: "600", fontSize: "14px" }}>Status</th>
                            <th style={{ padding: "16px 24px", color: "#475569", fontWeight: "600", fontSize: "14px" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {totalApplicants.map(app => (
                            <tr key={app.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                              <td style={{ padding: "16px 24px", fontWeight: "500", color: "#0f172a" }}>{app.name}</td>
                              <td style={{ padding: "16px 24px" }}>
                                <span style={{
                                  padding: "4px 10px",
                                  borderRadius: "12px",
                                  fontSize: "12px",
                                  fontWeight: "500",
                                  background: app.status.toLowerCase() === "selected" ? "#d1fae5" : app.status.toLowerCase() === "shortlisted" ? "#fef3c7" : app.status.toLowerCase() === "rejected" ? "#fee2e2" : "#f1f5f9",
                                  color: app.status.toLowerCase() === "selected" ? "#059669" : app.status.toLowerCase() === "shortlisted" ? "#d97706" : app.status.toLowerCase() === "rejected" ? "#dc2626" : "#475569",
                                  textTransform: "capitalize"
                                }}>
                                  {app.status || "Pending"}
                                </span>
                              </td>
                              <td style={{ padding: "16px 24px" }}>
                                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                  <button onClick={() => viewResume(app)} style={{ background: "#f1f5f9", color: "#475569", border: "none", padding: "8px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "500", display: "flex", alignItems: "center", gap: "6px" }}>
                                    <FileText size={16} /> View Resume
                                  </button>
                                  
                                  <div style={{ position: "relative" }}>
                                    <select 
                                      value={app.status.toLowerCase()}
                                      onChange={(e) => updateApplicantStatus(app.id, e.target.value)}
                                      style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px", color: "#0f172a", outline: "none", cursor: "pointer", background: "white", appearance: "none", paddingRight: "30px" }}
                                    >
                                      <option value="pending" disabled hidden>Pending</option>
                                      <option value="shortlisted">Shortlisted</option>
                                      <option value="selected">Selected</option>
                                      <option value="rejected">Rejected</option>
                                    </select>
                                    <ChevronDown size={14} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#64748b" }} />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {/* SHORTLISTED CANDIDATES TAB */}
                {currentTab === "shortlisted" && (
                  <div>
                    {shortlistedApplicants.length === 0 ? (
                      <p style={{ textAlign: "center", color: "#94a3b8", padding: "40px" }}>No shortlisted candidates found for this job yet.</p>
                    ) : (
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ background: "#f0fdf4", borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>
                            <th style={{ padding: "16px 24px", color: "#166534", fontWeight: "600", fontSize: "14px" }}>Candidate Name</th>
                            <th style={{ padding: "16px 24px", color: "#166534", fontWeight: "600", fontSize: "14px" }}>Level Completed</th>
                            <th style={{ padding: "16px 24px", color: "#166534", fontWeight: "600", fontSize: "14px" }}>Assign Interviewer</th>
                            <th style={{ padding: "16px 24px", color: "#166534", fontWeight: "600", fontSize: "14px" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {shortlistedApplicants.map(app => {
                            const completedLevel = (app.rounds && app.rounds.length > 0) 
                              ? app.rounds[app.rounds.length - 1].roundName 
                              : "None";
                              
                            return (
                              <tr key={app.id} style={{ borderBottom: "1px solid #e2e8f0", background: "white" }}>
                                <td style={{ padding: "16px 24px", fontWeight: "500", color: "#0f172a" }}>{app.name}</td>
                                
                                {/* Level Completed */}
                                <td style={{ padding: "16px 24px" }}>
                                  <span style={{
                                    display: "inline-block", padding: "4px 10px", background: "#f1f5f9", 
                                    color: "#475569", borderRadius: "12px", fontSize: "12px", fontWeight: "500"
                                  }}>
                                    {completedLevel}
                                  </span>
                                </td>
                                
                                {/* Assign Interviewer Dropdown */}
                                <td style={{ padding: "16px 24px" }}>
                                  <div style={{ position: "relative", maxWidth: "200px" }}>
                                    <select
                                      value={app.assignedInterviewerId || ""}
                                      onChange={(e) => assignInterviewer(app.id, parseInt(e.target.value))}
                                      style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px", width: "100%", outline: "none", cursor: "pointer", appearance: "none", paddingRight: "30px" }}
                                    >
                                      <option value="">Unassigned</option>
                                      {interviewers.map(int => (
                                        <option key={int.id} value={int.id}>{int.name}</option>
                                      ))}
                                    </select>
                                    <ChevronDown size={14} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#64748b" }} />
                                  </div>
                                </td>
                                
                                {/* Create Round Button */}
                                <td style={{ padding: "16px 24px" }}>
                                  <button onClick={() => openRoundModal(app)} style={{ background: "linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%)", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600", boxShadow: "0 2px 4px rgba(20, 184, 166, 0.2)" }}>
                                    Create Round
                                  </button>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {/* SELECTED APPLICANTS TAB */}
                {currentTab === "selected" && (
                  <div>
                    {selectedApplicants.length === 0 ? (
                      <p style={{ textAlign: "center", color: "#94a3b8", padding: "40px" }}>No selected candidates found for this job yet.</p>
                    ) : (
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ background: "#f0fdf4", borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>
                            <th style={{ padding: "16px 24px", color: "#166534", fontWeight: "600", fontSize: "14px" }}>Candidate Name</th>
                            <th style={{ padding: "16px 24px", color: "#166534", fontWeight: "600", fontSize: "14px" }}>Position</th>
                            <th style={{ padding: "16px 24px", color: "#166534", fontWeight: "600", fontSize: "14px" }}>Status</th>
                            <th style={{ padding: "16px 24px", color: "#166534", fontWeight: "600", fontSize: "14px" }}>Level Completed</th>
                            <th style={{ padding: "16px 24px", color: "#166534", fontWeight: "600", fontSize: "14px" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedApplicants.map(app => {
                            const completedLevel = (app.rounds && app.rounds.length > 0) 
                              ? app.rounds[app.rounds.length - 1].roundName 
                              : "None";
                              
                            return (
                              <tr key={app.id} style={{ borderBottom: "1px solid #e2e8f0", background: "white" }}>
                                <td style={{ padding: "16px 24px", fontWeight: "500", color: "#0f172a" }}>{app.name}</td>
                                
                                {/* Position */}
                                <td style={{ padding: "16px 24px", color: "#475569" }}>
                                  {job.title}
                                </td>

                                {/* Status */}
                                <td style={{ padding: "16px 24px" }}>
                                  <span style={{
                                    padding: "4px 10px",
                                    borderRadius: "12px",
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    background: "#d1fae5",
                                    color: "#059669"
                                  }}>
                                    Selected
                                  </span>
                                </td>
                                
                                {/* Level Completed */}
                                <td style={{ padding: "16px 24px" }}>
                                  <span style={{
                                    display: "inline-block", padding: "4px 10px", background: "#f1f5f9", 
                                    color: "#475569", borderRadius: "12px", fontSize: "12px", fontWeight: "500"
                                  }}>
                                    {completedLevel}
                                  </span>
                                </td>
                                
                                {/* Actions */}
                                <td style={{ padding: "16px 24px" }}>
                                  <button onClick={() => viewResume(app)} style={{ background: "#f1f5f9", color: "#475569", border: "none", padding: "8px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "500", display: "flex", alignItems: "center", gap: "6px" }}>
                                    <FileText size={16} /> View Resume
                                  </button>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Round Modal */}
      {roundModalOpen && selectedApplicantForRound && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000,
          backdropFilter: "blur(4px)",
        }}>
          <div style={{
            background: "white",
            padding: "30px",
            borderRadius: "16px",
            width: "400px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}>
            <h3 style={{ margin: "0 0 20px 0", fontSize: "20px", color: "#0f172a" }}>Create Round for {selectedApplicantForRound.name}</h3>
            
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px", color: "#475569" }}>Round Name</label>
              <input 
                type="text" 
                placeholder="e.g., Technical Round 1"
                value={roundData.roundName}
                onChange={(e) => setRoundData({...roundData, roundName: e.target.value})}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none", fontSize: "14px" }}
              />
            </div>
            
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <input 
                  type="checkbox"
                  checked={roundData.isFinalRound}
                  onChange={(e) => setRoundData({...roundData, isFinalRound: e.target.checked})}
                  style={{ width: "18px", height: "18px", cursor: "pointer", accentColor: "rgb(20, 184, 166)" }}
                />
                <span style={{ fontSize: "14px", fontWeight: "500", color: "#0f172a" }}>Is Final Round?</span>
              </label>
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button 
                onClick={() => setRoundModalOpen(false)}
                style={{ padding: "10px 20px", background: "white", color: "#475569", border: "1px solid #e2e8f0", borderRadius: "8px", cursor: "pointer", fontWeight: "500" }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveRound}
                style={{ padding: "10px 20px", background: "rgb(20, 184, 166)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}
              >
                Save Round
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applicants;