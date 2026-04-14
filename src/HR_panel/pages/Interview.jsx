// Interview.jsx
import { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  Video, 
  Phone, 
  MapPin, 
  Users, 
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Download
} from "lucide-react";
import PageHeader from "../components/PageHeader";

const Interview = () => {
  const [interviews, setInterviews] = useState([]);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterDate, setFilterDate] = useState("");

  // Load interviews from localStorage
  useEffect(() => {
    const savedInterviews = localStorage.getItem("hrInterviews");
    if (savedInterviews) {
      setInterviews(JSON.parse(savedInterviews));
    } else {
      // Sample interview data
      const sampleInterviews = [
        {
          id: 1,
          candidateName: "Sarah Johnson",
          candidateEmail: "sarah.johnson@email.com",
          candidatePhone: "+91 98765 43210",
          position: "Frontend Developer",
          date: "2024-03-25",
          time: "10:00 AM",
          duration: "60",
          type: "video",
          link: "https://meet.google.com/abc-defg-hij",
          status: "scheduled",
          interviewers: ["John Doe (Tech Lead)", "Jane Smith (HR)"],
          notes: "Candidate has strong React experience"
        },
        {
          id: 2,
          candidateName: "Michael Chen",
          candidateEmail: "michael.chen@email.com",
          candidatePhone: "+91 87654 32109",
          position: "Backend Developer",
          date: "2024-03-25",
          time: "2:00 PM",
          duration: "45",
          type: "inperson",
          location: "Conference Room A, 3rd Floor",
          status: "scheduled",
          interviewers: ["Robert Brown (Tech Lead)", "Sarah Wilson (HR)"],
          notes: "Focus on system design"
        },
        {
          id: 3,
          candidateName: "Priya Sharma",
          candidateEmail: "priya.sharma@email.com",
          candidatePhone: "+91 76543 21098",
          position: "UI/UX Designer",
          date: "2024-03-26",
          time: "11:30 AM",
          duration: "60",
          type: "phone",
          phoneNumber: "+91 98765 43210",
          status: "scheduled",
          interviewers: ["Emily Davis (Design Lead)"],
          notes: "Portfolio review"
        },
        {
          id: 4,
          candidateName: "Alex Thompson",
          candidateEmail: "alex.thompson@email.com",
          candidatePhone: "+91 65432 10987",
          position: "DevOps Engineer",
          date: "2024-03-24",
          time: "3:00 PM",
          duration: "90",
          type: "video",
          link: "https://meet.google.com/xyz-abcd-efg",
          status: "completed",
          interviewers: ["David Miller (DevOps Lead)"],
          notes: "Technical assessment completed",
          feedback: "Strong candidate, moving to next round"
        },
        {
          id: 5,
          candidateName: "Ananya Reddy",
          candidateEmail: "ananya.reddy@email.com",
          candidatePhone: "+91 54321 09876",
          position: "Product Manager",
          date: "2024-03-23",
          time: "12:00 PM",
          duration: "60",
          type: "video",
          link: "https://meet.google.com/ijk-lmno-pqr",
          status: "cancelled",
          interviewers: ["Mark Taylor (Product Head)"],
          notes: "Candidate rescheduled",
          cancelReason: "Technical issues on candidate's side"
        }
      ];
      setInterviews(sampleInterviews);
      localStorage.setItem("hrInterviews", JSON.stringify(sampleInterviews));
    }
  }, []);

  // Update interview status
  const updateInterviewStatus = (interviewId, newStatus) => {
    const updatedInterviews = interviews.map(interview =>
      interview.id === interviewId ? { ...interview, status: newStatus } : interview
    );
    setInterviews(updatedInterviews);
    localStorage.setItem("hrInterviews", JSON.stringify(updatedInterviews));
  };

  // Schedule new interview
  const scheduleInterview = (newInterview) => {
    const interviewWithId = {
      ...newInterview,
      id: Date.now(),
      status: "scheduled"
    };
    const updatedInterviews = [...interviews, interviewWithId];
    setInterviews(updatedInterviews);
    localStorage.setItem("hrInterviews", JSON.stringify(updatedInterviews));
    setShowScheduleForm(false);
  };

  // Filter interviews
  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = interview.candidateName.toLowerCase().includes(search.toLowerCase()) ||
                          interview.position.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterType === "all" || interview.status === filterType;
    const matchesDate = !filterDate || interview.date === filterDate;
    return matchesSearch && matchesFilter && matchesDate;
  });

  // Get upcoming interviews
  const today = new Date().toISOString().split('T')[0];
  const upcomingInterviews = interviews.filter(
    i => i.status === "scheduled" && i.date >= today
  ).length;

  const getStatusBadge = (status) => {
    const config = {
      scheduled: { color: "#3b82f6", bg: "#dbeafe", label: "Scheduled", icon: Calendar },
      completed: { color: "#10b981", bg: "#d1fae5", label: "Completed", icon: CheckCircle },
      cancelled: { color: "#ef4444", bg: "#fee2e2", label: "Cancelled", icon: XCircle },
      rescheduled: { color: "#f59e0b", bg: "#fef3c7", label: "Rescheduled", icon: AlertCircle }
    };
    const { color, bg, label, icon: Icon } = config[status] || config.scheduled;
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: bg, color: color, padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "500" }}>
        <Icon size={12} />
        {label}
      </span>
    );
  };

  const getInterviewTypeIcon = (type) => {
    const icons = {
      video: Video,
      phone: Phone,
      inperson: MapPin
    };
    const Icon = icons[type] || Video;
    return <Icon size={16} />;
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Stats
  const stats = {
    total: interviews.length,
    scheduled: interviews.filter(i => i.status === "scheduled").length,
    completed: interviews.filter(i => i.status === "completed").length,
    upcoming: upcomingInterviews
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
      
      {/* Header */}
      <PageHeader
        title="Interviews"
        subtitle="Manage and schedule candidate interviews"
      />

      {/* Stats Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "20px",
        marginBottom: "30px"
      }}>
        <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "8px" }}>Total Interviews</p>
          <h3 style={{ fontSize: "32px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>{stats.total}</h3>
        </div>
        <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "8px" }}>Scheduled</p>
          <h3 style={{ fontSize: "32px", fontWeight: "bold", color: "#3b82f6", margin: 0 }}>{stats.scheduled}</h3>
        </div>
        <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "8px" }}>Completed</p>
          <h3 style={{ fontSize: "32px", fontWeight: "bold", color: "#10b981", margin: 0 }}>{stats.completed}</h3>
        </div>
        <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "8px" }}>Upcoming</p>
          <h3 style={{ fontSize: "32px", fontWeight: "bold", color: "#f59e0b", margin: 0 }}>{stats.upcoming}</h3>
        </div>
      </div>

      {/* Actions Bar */}
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
        <div style={{ display: "flex", gap: "12px", flex: "1", minWidth: "300px" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "18px", height: "18px", color: "#94a3b8" }} />
            <input
              type="text"
              placeholder="Search by candidate or position..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "10px 12px 10px 38px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", outline: "none" }}
            />
          </div>
          <div style={{ position: "relative", minWidth: "140px" }}>
            <Filter style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "#94a3b8" }} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", background: "white", cursor: "pointer" }}
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            style={{ padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", minWidth: "150px" }}
          />
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => setShowScheduleForm(true)}
            style={{
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
            }}
          >
            <Plus size={16} />
            Schedule Interview
          </button>
          <button style={{
            background: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "10px 20px",
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Interviews Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
        gap: "20px"
      }}>
        {filteredInterviews.map((interview) => (
          <div
            key={interview.id}
            style={{
              background: "white",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              overflow: "hidden",
              transition: "all 0.3s ease",
              cursor: "pointer"
            }}
            onClick={() => setSelectedInterview(interview)}
          >
            <div style={{ padding: "20px" }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px" }}>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#0f172a", marginBottom: "4px" }}>
                    {interview.candidateName}
                  </h3>
                  <p style={{ fontSize: "13px", color: "#64748b" }}>{interview.position}</p>
                </div>
                {getStatusBadge(interview.status)}
              </div>

              {/* Details */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", color: "#475569" }}>
                  <Calendar size={16} style={{ color: "#94a3b8" }} />
                  <span>{formatDate(interview.date)}</span>
                  <Clock size={16} style={{ color: "#94a3b8", marginLeft: "8px" }} />
                  <span>{interview.time} ({interview.duration} min)</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#475569" }}>
                  {getInterviewTypeIcon(interview.type)}
                  <span>
                    {interview.type === "video" && `Video Call: ${interview.link}`}
                    {interview.type === "phone" && `Phone: ${interview.phoneNumber}`}
                    {interview.type === "inperson" && `In-person: ${interview.location}`}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#64748b" }}>
                  <Users size={14} />
                  <span>{interview.interviewers.join(", ")}</span>
                </div>
              </div>

              {/* Action Buttons */}
              {interview.status === "scheduled" && (
                <div style={{ display: "flex", gap: "12px", paddingTop: "16px", borderTop: "1px solid #f1f5f9" }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); updateInterviewStatus(interview.id, "completed"); }}
                    style={{ flex: 1, padding: "8px", background: "#10b981", color: "white", border: "none", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}
                  >
                    Mark Completed
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); updateInterviewStatus(interview.id, "cancelled"); }}
                    style={{ flex: 1, padding: "8px", background: "#ef4444", color: "white", border: "none", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredInterviews.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px", background: "white", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <Calendar size={48} style={{ color: "#94a3b8", marginBottom: "16px" }} />
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", marginBottom: "8px" }}>No interviews found</h3>
          <p style={{ color: "#64748b", marginBottom: "20px" }}>Schedule your first interview to get started</p>
          <button
            onClick={() => setShowScheduleForm(true)}
            style={{ background: "linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%)", color: "white", border: "none", borderRadius: "8px", padding: "10px 20px", cursor: "pointer" }}
          >
            + Schedule Interview
          </button>
        </div>
      )}

      {/* Interview Details Modal */}
      {selectedInterview && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px"
        }} onClick={() => setSelectedInterview(null)}>
          <div style={{ background: "white", borderRadius: "16px", maxWidth: "500px", width: "100%", maxHeight: "80vh", overflowY: "auto", padding: "24px" }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "20px" }}>Interview Details</h2>
            <div style={{ display: "grid", gap: "16px", marginBottom: "24px" }}>
              <div><strong>Candidate:</strong> {selectedInterview.candidateName}</div>
              <div><strong>Position:</strong> {selectedInterview.position}</div>
              <div><strong>Date & Time:</strong> {formatDate(selectedInterview.date)} at {selectedInterview.time}</div>
              <div><strong>Duration:</strong> {selectedInterview.duration} minutes</div>
              <div><strong>Interviewers:</strong> {selectedInterview.interviewers.join(", ")}</div>
              <div><strong>Notes:</strong> {selectedInterview.notes}</div>
              {selectedInterview.feedback && <div><strong>Feedback:</strong> {selectedInterview.feedback}</div>}
              {selectedInterview.cancelReason && <div><strong>Cancellation Reason:</strong> {selectedInterview.cancelReason}</div>}
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setSelectedInterview(null)} style={{ flex: 1, padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px", background: "white", cursor: "pointer" }}>Close</button>
              {selectedInterview.type === "video" && selectedInterview.link && (
                <a href={selectedInterview.link} target="_blank" rel="noopener noreferrer" style={{ flex: 1, textAlign: "center", padding: "10px", background: "linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%)", color: "white", borderRadius: "8px", textDecoration: "none" }}>
                  Join Meeting
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {showScheduleForm && (
        <ScheduleInterviewModal onClose={() => setShowScheduleForm(false)} onSchedule={scheduleInterview} />
      )}
    </div>
  );
};

// Schedule Interview Modal Component
const ScheduleInterviewModal = ({ onClose, onSchedule }) => {
  const [formData, setFormData] = useState({
    candidateName: "",
    candidateEmail: "",
    candidatePhone: "",
    position: "",
    date: "",
    time: "",
    duration: "60",
    type: "video",
    link: "",
    phoneNumber: "",
    location: "",
    interviewers: "",
    notes: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const interviewers = formData.interviewers.split(",").map(i => i.trim());
    onSchedule({ ...formData, interviewers });
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px"
    }} onClick={onClose}>
      <div style={{ background: "white", borderRadius: "16px", maxWidth: "500px", width: "100%", maxHeight: "80vh", overflowY: "auto", padding: "24px" }} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "20px" }}>Schedule Interview</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <input type="text" placeholder="Candidate Name *" required value={formData.candidateName} onChange={(e) => setFormData({...formData, candidateName: e.target.value})} style={{ padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
          <input type="email" placeholder="Candidate Email *" required value={formData.candidateEmail} onChange={(e) => setFormData({...formData, candidateEmail: e.target.value})} style={{ padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
          <input type="tel" placeholder="Candidate Phone" value={formData.candidatePhone} onChange={(e) => setFormData({...formData, candidatePhone: e.target.value})} style={{ padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
          <input type="text" placeholder="Position *" required value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} style={{ padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <input type="date" placeholder="Date *" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} style={{ padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
            <input type="time" placeholder="Time *" required value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} style={{ padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
          </div>
          
          <select value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} style={{ padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">60 minutes</option>
            <option value="90">90 minutes</option>
          </select>
          
          <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} style={{ padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
            <option value="video">Video Call</option>
            <option value="phone">Phone Call</option>
            <option value="inperson">In-person</option>
          </select>
          
          {formData.type === "video" && (
            <input type="url" placeholder="Meeting Link *" required value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} style={{ padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
          )}
          {formData.type === "phone" && (
            <input type="tel" placeholder="Phone Number *" required value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} style={{ padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
          )}
          {formData.type === "inperson" && (
            <input type="text" placeholder="Location *" required value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} style={{ padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
          )}
          
          <input type="text" placeholder="Interviewers (comma separated)" value={formData.interviewers} onChange={(e) => setFormData({...formData, interviewers: e.target.value})} style={{ padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
          <textarea placeholder="Notes" rows="3" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} style={{ padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px", resize: "vertical" }} />
          
          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px", background: "white", cursor: "pointer" }}>Cancel</button>
            <button type="submit" style={{ flex: 1, padding: "10px", background: "linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>Schedule</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Interview;