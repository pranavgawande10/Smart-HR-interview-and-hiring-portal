import { useState, useEffect } from "react";
import { FileText, ChevronDown, UserCheck } from "lucide-react";
import axios from "axios";

const Applicants = () => {
  const [jobs, setJobs] = useState([]);               
  const [applicants, setApplicants] = useState([]);   
  const [interviewers, setInterviewers] = useState([]); 
  const [activeTabs, setActiveTabs] = useState({});   
  
  const [roundModalOpen, setRoundModalOpen] = useState(false);
  const [selectedApplicantForRound, setSelectedApplicantForRound] = useState(null);
  const [roundData, setRoundData] = useState({ roundName: "", isFinalRound: false });

  const getAxiosConfig = () => ({
    withCredentials: true,
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchData = async () => {
    try {
      // 1. Fetch Jobs
      const jobsRes = await axios.get("http://localhost:3000/job/myjobs", getAxiosConfig());
      const fetchedJobs = jobsRes.data.map(j => ({
        id: j._id,
        title: j.title,
        company: j.companyName || "Your Company",
        location: j.location,
        vacancies: j.vacancies
      }));
      setJobs(fetchedJobs);

      // 2. Fetch Applicants
      const appsPromises = fetchedJobs.map(job =>
        axios.get(`http://localhost:3001/api/v1/application/job/${job.id}`, getAxiosConfig())
          .then(res => {
            return res.data.applications.map(app => {
              return {
                id: app._id,
                name: app.fullName,
                jobId: app.job,
                status: app.status === "applied" ? "pending" : app.status,
                resumeUrl: app.resume,
                // Maps to the dynamically updated backend field
                roundsCount: app.roundsCompleted || 0, 
                assignedInterviewerId: app.assignedInterviewerId || null,
                lastInterviewId: app.lastInterviewId || null,
                isFinalRound: app.isFinalRound || false 
              };
            });
          }).catch(err => [])
      );
       
      const appsArrays = await Promise.all(appsPromises);
      setApplicants(appsArrays.flat());

      // 3. Fetch Interviewers
      const intRes = await axios.get("http://localhost:3001/api/v1/hr/interviewers", getAxiosConfig());
      setInterviewers(intRes.data.interviewers.map(i => ({
        id: i._id,
        name: i.name
      })));

    } catch (err) {
      console.error("Failed to load applicants", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTabChange = (jobId, tab) => {
    setActiveTabs(prev => ({ ...prev, [jobId]: tab }));
  };

  const updateApplicantStatus = async (applicantId, newStatus) => {
    try {
      const backendStatus = newStatus === "pending" ? "applied" : newStatus;
      await axios.patch(
        `http://localhost:3001/api/v1/application/status/${applicantId}`,
        { status: backendStatus },
        getAxiosConfig()
      );
      
      const updated = applicants.map(app => 
        app.id === applicantId ? { ...app, status: newStatus } : app
      );
      setApplicants(updated);
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Status update failed");
    }
  };

  const assignInterviewer = async (applicantId, interviewId, interviewerId) => {
    if (!interviewId) {
      alert("No active interview round exists for this candidate. Create a round first!");
      return;
    }
    if (!interviewerId) return;

    try {
      await axios.put(
        `http://localhost:3001/api/v1/hr/assign-round/${interviewId}`,
        { interviewerId: interviewerId === "HR_SELF" ? undefined : interviewerId },
        getAxiosConfig()
      );
      alert(interviewerId === "HR_SELF" ? "Assigned to yourself successfully!" : "Interviewer manually assigned!");
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to assign interviewer");
    }
  };

  const openRoundModal = (applicant) => {
    setSelectedApplicantForRound(applicant);
    setRoundData({ roundName: "", isFinalRound: false });
    setRoundModalOpen(true);
  };

  const handleSaveRound = async () => {
    if (!selectedApplicantForRound || !roundData.roundName) return;

    try {
      await axios.post(
        `http://localhost:3001/api/v1/hr/create-round/${selectedApplicantForRound.id}`,
        {
          round: "TECHNICAL", 
          isFinalRound: roundData.isFinalRound
        },
        getAxiosConfig()
      );
      setRoundModalOpen(false);
      fetchData(); 
      alert("Round created successfully");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create round");
    }
  };

  const viewResume = (applicant) => {
    if(applicant.resumeUrl && applicant.resumeUrl !== "#") {
      window.open(applicant.resumeUrl, "_blank");
    } else {
      alert("No valid resume URL attached to this applicant.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      
      <div style={{
        marginBottom: "30px", padding: "25px", background: "linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%)",
        borderRadius: "16px", color: "white", boxShadow: "0 4px 20px rgba(20, 184, 166, 0.3)"
      }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px", color: "white" }}>Applicants Overview</h1>
        <p style={{ fontSize: "16px", opacity: "0.9", margin: "0" }}>Manage your candidate pipeline across all active job postings.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
        {jobs.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", background: "white", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <p style={{ color: "#64748b" }}>No active job postings found.</p>
          </div>
        )}

        {jobs.map(job => {
          const jobApplicants = applicants.filter(app => app.jobId === job.id);
          const totalApplicants = jobApplicants;
          const shortlistedApplicants = jobApplicants.filter(app => ["shortlisted", "interview"].includes(app.status.toLowerCase()));
          const selectedApplicants = jobApplicants.filter(app => app.status.toLowerCase() === "selected");
          
          const currentTab = activeTabs[job.id] || "total";

          return (
            <div key={job.id} style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", overflow: "hidden" }}>
              <div style={{ padding: "24px", borderBottom: "1px solid #e2e8f0", background: "linear-gradient(to right, #f8fafc, #ffffff)" }}>
                <h2 style={{ margin: "0 0 8px 0", fontSize: "22px", fontWeight: "700", color: "#0f172a" }}>{job.title}</h2>
                <div style={{ display: "flex", gap: "24px", fontSize: "14px", color: "#64748b" }}>
                  <span><strong style={{ color: "#475569" }}>Company/Location:</strong> {job.company} / {job.location}</span>
                  <span><strong style={{ color: "#475569" }}>Total Candidates Applied:</strong> {totalApplicants.length}</span>
                </div>
              </div>

              <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", background: "#f1f5f9" }}>
                <button onClick={() => handleTabChange(job.id, "total")} style={{ padding: "16px 24px", background: currentTab === "total" ? "white" : "transparent", border: "none", borderBottom: currentTab === "total" ? "2px solid rgb(20, 184, 166)" : "2px solid transparent", fontWeight: "600", color: currentTab === "total" ? "rgb(20, 184, 166)" : "#64748b", cursor: "pointer", fontSize: "15px" }}>
                  Total Applicants ({totalApplicants.length})
                </button>
                <button onClick={() => handleTabChange(job.id, "shortlisted")} style={{ padding: "16px 24px", background: currentTab === "shortlisted" ? "white" : "transparent", border: "none", borderBottom: currentTab === "shortlisted" ? "2px solid rgb(20, 184, 166)" : "2px solid transparent", fontWeight: "600", color: currentTab === "shortlisted" ? "rgb(20, 184, 166)" : "#64748b", cursor: "pointer", fontSize: "15px" }}>
                  Shortlisted Candidates ({shortlistedApplicants.length})
                </button>
                <button onClick={() => handleTabChange(job.id, "selected")} style={{ padding: "16px 24px", background: currentTab === "selected" ? "white" : "transparent", border: "none", borderBottom: currentTab === "selected" ? "2px solid rgb(20, 184, 166)" : "2px solid transparent", fontWeight: "600", color: currentTab === "selected" ? "rgb(20, 184, 166)" : "#64748b", cursor: "pointer", fontSize: "15px" }}>
                  Selected Applicants ({selectedApplicants.length})
                </button>
              </div>

              <div style={{ padding: "0" }}>
                {currentTab === "total" && (
                  <div>
                    {totalApplicants.length === 0 ? <p style={{ textAlign: "center", color: "#94a3b8", padding: "20px" }}>No applicants yet.</p> : (
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
                                <span style={{ padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "500", textTransform: "capitalize", background: app.status.toLowerCase() === "selected" ? "#d1fae5" : ["shortlisted", "interview"].includes(app.status.toLowerCase()) ? "#fef3c7" : app.status.toLowerCase() === "rejected" ? "#fee2e2" : "#f1f5f9", color: app.status.toLowerCase() === "selected" ? "#059669" : ["shortlisted", "interview"].includes(app.status.toLowerCase()) ? "#d97706" : app.status.toLowerCase() === "rejected" ? "#dc2626" : "#475569" }}>
                                  {app.status || "Pending"}
                                </span>
                              </td>
                              <td style={{ padding: "16px 24px" }}>
                                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                  <button onClick={() => viewResume(app)} style={{ background: "#f1f5f9", color: "#475569", border: "none", padding: "8px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "500", display: "flex", alignItems: "center", gap: "6px" }}><FileText size={16} /> View Resume</button>
                                  <div style={{ position: "relative" }}>
                                    <select value={app.status.toLowerCase()} onChange={(e) => updateApplicantStatus(app.id, e.target.value)} style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px", color: "#0f172a", outline: "none", cursor: "pointer", background: "white", appearance: "none", paddingRight: "30px" }}>
                                      <option value="pending" disabled hidden>Pending</option>
                                      <option value="shortlisted">Shortlisted</option>
                                      <option value="interview" disabled hidden>In Interview</option>
                                      <option value="selected" disabled hidden>Selected</option>
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

                {currentTab === "shortlisted" && (
                  <div>
                    {shortlistedApplicants.length === 0 ? <p style={{ textAlign: "center", color: "#94a3b8", padding: "40px" }}>No shortlisted candidates.</p> : (
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ background: "#f0fdf4", borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>
                            <th style={{ padding: "16px 24px", color: "#166534", fontWeight: "600", fontSize: "14px" }}>Candidate Name</th>
                            <th style={{ padding: "16px 24px", color: "#166534", fontWeight: "600", fontSize: "14px" }}>Levels Completed</th>
                            <th style={{ padding: "16px 24px", color: "#166534", fontWeight: "600", fontSize: "14px" }}>Assign Interviewer</th>
                            <th style={{ padding: "16px 24px", color: "#166534", fontWeight: "600", fontSize: "14px" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {shortlistedApplicants.map(app => (
                            <tr key={app.id} style={{ borderBottom: "1px solid #e2e8f0", background: "white" }}>
                              <td style={{ padding: "16px 24px", fontWeight: "500", color: "#0f172a" }}>{app.name}</td>
                              
                              <td style={{ padding: "16px 24px" }}>
                                <span style={{ display: "inline-block", padding: "4px 10px", background: "#f1f5f9", color: "#475569", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }}>
                                  {app.roundsCount}
                                </span>
                              </td>
                              
                              <td style={{ padding: "16px 24px" }}>
                                {app.isFinalRound ? (
                                  app.assignedInterviewerId ? (
                                    <span style={{ color: "#059669", fontWeight: "600", fontSize: "13px", display: "flex", alignItems: "center", gap: "4px" }}>
                                      <UserCheck size={16} /> Assigned to You
                                    </span>
                                  ) : (
                                    <button 
                                      onClick={() => assignInterviewer(app.id, app.lastInterviewId, "HR_SELF")}
                                      style={{ background: "#e0f2fe", color: "#0369a1", border: "none", padding: "8px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}
                                    >
                                      Assign to Me (HR)
                                    </button>
                                  )
                                ) : (
                                  <div style={{ position: "relative", maxWidth: "200px" }}>
                                    <select
                                      value={app.assignedInterviewerId || ""}
                                      onChange={(e) => assignInterviewer(app.id, app.lastInterviewId, e.target.value)}
                                      style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px", width: "100%", outline: "none", cursor: "pointer", appearance: "none", paddingRight: "30px", background: "white", color: "#0f172a" }}
                                    >
                                      <option value="">Unassigned</option>
                                      {interviewers.map(int => (
                                        <option key={int.id} value={int.id}>{int.name}</option>
                                      ))}
                                    </select>
                                    <ChevronDown size={14} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#64748b" }} />
                                  </div>
                                )}
                              </td>
                              
                              <td style={{ padding: "16px 24px" }}>
                                <button onClick={() => openRoundModal(app)} style={{ background: "linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%)", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600", boxShadow: "0 2px 4px rgba(20, 184, 166, 0.2)" }}>
                                  Create Round
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {currentTab === "selected" && (
                  <div>
                    {selectedApplicants.length === 0 ? <p style={{ textAlign: "center", color: "#94a3b8", padding: "40px" }}>No selected candidates found.</p> : (
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                         <thead>
                          <tr style={{ background: "#f0fdf4", borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>
                            <th style={{ padding: "16px 24px", color: "#166534", fontWeight: "600", fontSize: "14px" }}>Candidate Name</th>
                            <th style={{ padding: "16px 24px", color: "#166534", fontWeight: "600", fontSize: "14px" }}>Status</th>
                            <th style={{ padding: "16px 24px", color: "#166534", fontWeight: "600", fontSize: "14px" }}>Levels Completed</th>
                            <th style={{ padding: "16px 24px", color: "#166534", fontWeight: "600", fontSize: "14px" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedApplicants.map(app => (
                            <tr key={app.id} style={{ borderBottom: "1px solid #e2e8f0", background: "white" }}>
                              <td style={{ padding: "16px 24px", fontWeight: "500", color: "#0f172a" }}>{app.name}</td>
                              <td style={{ padding: "16px 24px" }}><span style={{ padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "500", background: "#d1fae5", color: "#059669" }}>Selected</span></td>
                              <td style={{ padding: "16px 24px" }}><span style={{ display: "inline-block", padding: "4px 10px", background: "#f1f5f9", color: "#475569", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }}>{app.roundsCount}</span></td>
                              <td style={{ padding: "16px 24px" }}><button onClick={() => viewResume(app)} style={{ background: "#f1f5f9", color: "#475569", border: "none", padding: "8px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "500", display: "flex", alignItems: "center", gap: "6px" }}><FileText size={16} /> View Resume</button></td>
                            </tr>
                          ))}
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

      {roundModalOpen && selectedApplicantForRound && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "white", padding: "30px", borderRadius: "16px", width: "400px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}>
            <h3 style={{ margin: "0 0 20px 0", fontSize: "20px", color: "#0f172a" }}>Create Round for {selectedApplicantForRound.name}</h3>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px", color: "#475569" }}>Round Name</label>
              <input type="text" placeholder="e.g., Technical Round 1" value={roundData.roundName} onChange={(e) => setRoundData({...roundData, roundName: e.target.value})} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none", fontSize: "14px", boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <input type="checkbox" checked={roundData.isFinalRound} onChange={(e) => setRoundData({...roundData, isFinalRound: e.target.checked})} style={{ width: "18px", height: "18px", cursor: "pointer", accentColor: "rgb(20, 184, 166)" }} />
                <span style={{ fontSize: "14px", fontWeight: "500", color: "#0f172a" }}>Is Final Round?</span>
              </label>
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button onClick={() => setRoundModalOpen(false)} style={{ padding: "10px 20px", background: "white", color: "#475569", border: "1px solid #e2e8f0", borderRadius: "8px", cursor: "pointer", fontWeight: "500" }}>Cancel</button>
              <button onClick={handleSaveRound} style={{ padding: "10px 20px", background: "rgb(20, 184, 166)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>Save Round</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applicants;