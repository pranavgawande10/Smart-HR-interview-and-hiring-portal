// Import necessary modules from React, Lucide icons for UI, and axios for API calls
import { useState, useEffect } from "react";
import { FileText, ChevronDown } from "lucide-react";
import axios from "axios";

// Main component to display and manage applicants for all jobs
const Applicants = () => {
  // State variables to store fetched data
  const [jobs, setJobs] = useState([]);               // List of jobs posted by the company
  const [applicants, setApplicants] = useState([]);   // List of all applicants across jobs
  const [interviewers, setInterviewers] = useState([]); // List of available interviewers
  const [activeTabs, setActiveTabs] = useState({});   // Tracks which tab (total/shortlisted/selected) is active per jobId
  
  // Modal state for creating a new interview round
  const [roundModalOpen, setRoundModalOpen] = useState(false);
  const [selectedApplicantForRound, setSelectedApplicantForRound] = useState(null);
  const [roundData, setRoundData] = useState({ roundName: "", isFinalRound: false });

  // Helper function to get axios configuration with authentication token
  const getAxiosConfig = () => ({
    withCredentials: true,
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  // Fetches jobs, applicants, and interviewers from backend APIs
  const fetchData = async () => {
    try {
      // 1. Fetch Jobs from port 3000
      const jobsRes = await axios.get("http://localhost:3000/job/myjobs", getAxiosConfig());
      const fetchedJobs = jobsRes.data.map(j => ({
        id: j._id,
        title: j.title,
        company: j.companyName || "Your Company",
        location: j.location,
        vacancies: j.vacancies
      }));
      setJobs(fetchedJobs);

      // 2. Fetch Applicants for each job from port 3001
      // For each job, get its applications and map to a simpler structure
      const appsPromises = fetchedJobs.map(job =>
        axios.get(`http://localhost:3001/api/v1/application/job/${job.id}`, getAxiosConfig())
          .then(res => {
            return res.data.applications.map(app => ({
              id: app._id,
              name: app.fullName,
              jobId: app.job,
              status: app.status === "applied" ? "pending" : app.status,
              resumeUrl: app.resume,
              rounds: app.lastRoundName !== "None" ? [{ roundName: app.lastRoundName }] : [],
              assignedInterviewerId: app.assignedInterviewerId || null,
              lastInterviewId: app.lastInterviewId || null
            }));
          }).catch(err => [])
      );
       
      const appsArrays = await Promise.all(appsPromises);
      setApplicants(appsArrays.flat());

      // 3. Fetch Interviewers from port 3001
      const intRes = await axios.get("http://localhost:3001/api/v1/hr/interviewers", getAxiosConfig());
      setInterviewers(intRes.data.interviewers.map(i => ({
        id: i._id,
        name: i.name
      })));

    } catch (err) {
      console.error("Failed to load applicants", err);
    }
  };

  // Fetch all data when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Helper to change the active tab for a specific job card
  const handleTabChange = (jobId, tab) => {
    setActiveTabs(prev => ({ ...prev, [jobId]: tab }));
  };

  // Updates the status of an applicant (shortlist, select, reject)
  const updateApplicantStatus = async (applicantId, newStatus) => {
    try {
      // Backend expects "applied" instead of "pending"
      const backendStatus = newStatus === "pending" ? "applied" : newStatus;
      await axios.patch(
        `http://localhost:3001/api/v1/application/status/${applicantId}`,
        { status: backendStatus },
        getAxiosConfig()
      );
      
      // Optimistically update local state
      const updated = applicants.map(app => 
        app.id === applicantId ? { ...app, status: newStatus } : app
      );
      setApplicants(updated);
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Status update failed");
    }
  };

  // Assigns an interviewer to an existing interview round
  const assignInterviewer = async (applicantId, interviewId, interviewerId) => {
    if (!interviewId) {
      alert("No active interview round exists for this candidate. Create a round first!");
      return;
    }
    if (!interviewerId) return;

    try {
      await axios.put(
        `http://localhost:3001/api/v1/hr/assign-round/${interviewId}`,
        { interviewerId },
        getAxiosConfig()
      );
      alert("Interviewer manually assigned to the round!");
      fetchData();  // Refresh data to reflect changes
      console.log(err.response?.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to assign interviewer");
    }
  };

  // Opens the modal to create a new interview round for a selected applicant
  const openRoundModal = (applicant) => {
    setSelectedApplicantForRound(applicant);
    setRoundData({ roundName: "", isFinalRound: false });
    setRoundModalOpen(true);
  };

  // Saves the new round details and sends request to backend
  const handleSaveRound = async () => {
    if (!selectedApplicantForRound || !roundData.roundName) return;

    try {
      await axios.post(
        `http://localhost:3001/api/v1/hr/create-round/${selectedApplicantForRound.id}`,
        {
          round: "TECHNICAL", // Defaulting to TECHNICAL per backend enum
          isFinalRound: roundData.isFinalRound
        },
        getAxiosConfig()
      );
      setRoundModalOpen(false);
      fetchData(); // Refresh to fetch updated status
      alert("Round created successfully");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create round");
    }
  };

  // Opens the applicant's resume in a new tab if available
  const viewResume = (applicant) => {
    if(applicant.resumeUrl && applicant.resumeUrl !== "#") {
      window.open(applicant.resumeUrl, "_blank");
    } else {
      alert("No valid resume URL attached to this applicant.");
    }
  };

  // JSX rendering of the entire component
  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      
      {/* 1. Page Heading with gradient background matching Dashboard/Interviews style */}
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
        {/* Show message if no jobs exist */}
        {jobs.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", background: "white", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <p style={{ color: "#64748b" }}>No active job postings found. Please create a job to view applicants.</p>
          </div>
        )}

        {/* 2. Iterate over each job and display a card with tabs and applicant tables */}
        {jobs.map(job => {
          // Filter applicants for this specific job
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

              {/* 3. Three Tabs inside each Job Card: Total, Shortlisted, Selected */}
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

              {/* Tab Content - renders different tables based on active tab */}
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
                                  
                                  {/* Dropdown to change applicant status */}
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

                {/* SHORTLISTED CANDIDATES TAB - shows interviewer assignment and round creation */}
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

                {/* SELECTED APPLICANTS TAB - displays final selected candidates */}
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
                                
                                {/* Position (job title) */}
                                <td style={{ padding: "16px 24px", color: "#475569" }}>
                                  {job.title}
                                </td>

                                {/* Status badge */}
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
                                
                                {/* Actions: View Resume button */}
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

      {/* Create Round Modal - appears when "Create Round" button is clicked */}
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
            
            {/* Round name input */}
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
            
            {/* Checkbox for final round */}
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

            {/* Modal action buttons */}
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