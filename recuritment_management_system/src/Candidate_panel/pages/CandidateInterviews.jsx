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
  MoreVertical,
  X
} from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

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
      scheduled: { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", label: "Scheduled" },
      reschedule_requested: { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", label: "Reschedule Requested" },
      cancellation_requested: { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", label: "Cancellation Requested" }
    };
    const config = styles[status] || styles.scheduled;
    return (
      <span className={`inline-flex items-center gap-1.5 ${config.bg} ${config.color} border ${config.border} px-3 py-1.5 rounded-full text-xs font-medium`}>
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
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="inline-block w-8 h-8 border-4 border-slate-600 border-t-sky-500 rounded-full animate-spin mb-4"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto p-4 sm:p-6"
    >
      
      {/* Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            className={`fixed top-5 right-5 z-[2000] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border ${
              notification.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 backdrop-blur-md'
                : 'bg-red-500/10 border-red-500/20 text-red-400 backdrop-blur-md'
            }`}
          >
            {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span className="font-medium text-sm">{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-2 bg-transparent border-none text-current opacity-70 hover:opacity-100 cursor-pointer">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 p-8 bg-gradient-to-br from-teal-500 to-sky-500 rounded-2xl text-white shadow-[0_4px_20px_rgba(20,184,166,0.3)] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl pointer-events-none"></div>
        <h1 className="text-3xl font-bold mb-2 outfit-font relative z-10">
          My Active Interviews
        </h1>
        <p className="text-white/90 relative z-10">
          Manage your upcoming scheduled interviews
        </p>
      </motion.div>

      <div className="flex flex-col gap-4">
        {interviews.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 glass-card rounded-2xl border border-slate-700/50"
          >
            <Calendar size={48} className="text-slate-500 mb-4 mx-auto" />
            <h3 className="text-lg font-semibold text-slate-200 mb-2">
              No active interviews
            </h3>
            <p className="text-slate-400 max-w-sm mx-auto">
              You don't have any interviews scheduled currently.
            </p>
          </motion.div>
        ) : (
          interviews.map((interview, idx) => (
            <motion.div 
              key={interview.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (idx % 10) }}
              className="glass-card rounded-2xl border border-slate-700/50 overflow-visible transition-all duration-300 hover:border-slate-600 hover:shadow-lg group"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4 gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-1 group-hover:text-teal-400 transition-colors">{interview.jobTitle}</h3>
                    <p className="text-sm text-slate-400 m-0">{interview.company}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(interview.status)}
                    {interview.status === "scheduled" && (
                      <div className="relative">
                        <button 
                          onClick={() => setShowDropdown(showDropdown === interview.id ? null : interview.id)} 
                          className="bg-slate-800/50 hover:bg-slate-700 border border-slate-700 rounded-lg p-2 cursor-pointer text-slate-400 hover:text-slate-200 transition-colors"
                        >
                          <MoreVertical size={16} />
                        </button>
                        {showDropdown === interview.id && (
                          <div className="absolute top-10 right-0 bg-slate-800 rounded-xl shadow-xl border border-slate-700 z-50 min-w-[200px] overflow-hidden py-1">
                            <button 
                              onClick={() => { setSelectedInterviewForAction(interview); setShowRescheduleModal(true); setShowDropdown(null); }} 
                              className="w-full px-4 py-3 text-left bg-transparent border-none cursor-pointer text-sm flex items-center gap-2 text-amber-400 hover:bg-slate-700/50 transition-colors"
                            >
                              <RefreshCw size={14} /> Request Reschedule
                            </button>
                            <button 
                              onClick={() => { setSelectedInterviewForAction(interview); setShowCancelModal(true); setShowDropdown(null); }} 
                              className="w-full px-4 py-3 text-left bg-transparent border-none cursor-pointer text-sm flex items-center gap-2 text-red-400 hover:bg-slate-700/50 transition-colors border-t border-slate-700"
                            >
                              <XCircle size={14} /> Cancel Interview
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-5 mb-4 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-slate-500" />
                    <span className="text-sm text-slate-300">{formatDate(interview.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-slate-500" />
                    <span className="text-sm text-slate-300">{interview.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-slate-500">{getInterviewTypeIcon(interview.type)}</div>
                    <span className="text-sm text-slate-300 capitalize">{interview.type} Interview</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="bg-slate-800/50 px-4 py-2 rounded-lg text-sm text-slate-400 border border-slate-700/50 flex-1 truncate">
                    {interview.notes}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {/* ADDED: Join Button on the card */}
                    {interview.link && (
                      <a 
                        href={interview.link.startsWith("http") ? interview.link : `https://${interview.link}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-sky-500 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-all"
                      >
                        <Video size={14} /> Join Now
                      </a>
                    )}

                    <button 
                      onClick={() => setSelectedInterview(interview)} 
                      className="bg-transparent border-none text-teal-400 text-sm font-medium cursor-pointer flex items-center gap-1 hover:text-teal-300 transition-colors"
                    >
                      View Details <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Reschedule Modal */}
      <AnimatePresence>
        {showRescheduleModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[1001] p-4"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl"
            >
              <h2 className="text-xl font-bold mb-2 text-slate-100 outfit-font">Request Reschedule</h2>
              <p className="text-sm text-slate-400 mb-6">
                Please explain why you cannot attend. The interviewer will be notified and will propose a new date/time.
              </p>
              
              <textarea 
                placeholder="Provide your reason here..." 
                value={rescheduleData.reason} 
                onChange={(e) => setRescheduleData({ reason: e.target.value })} 
                className="w-full p-4 bg-slate-900 border border-slate-700 rounded-xl h-32 mb-6 resize-none text-slate-200 placeholder-slate-500 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all" 
              />

              <div className="flex gap-3">
                <button 
                  onClick={() => { setShowRescheduleModal(false); setRescheduleData({ reason: "" }); }} 
                  className="flex-1 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-slate-200 font-medium hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleRescheduleRequest} 
                  className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-sky-500 text-white rounded-xl font-medium border-none cursor-pointer hover:shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-all"
                >
                  Send Request
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[1001] p-4"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl"
            >
              <h2 className="text-xl font-bold mb-2 text-slate-100 outfit-font">Cancel Interview</h2>
              <p className="text-sm text-slate-400 mb-6">
                Are you sure you want to cancel this interview? This action cannot be undone.
              </p>
              
              <textarea 
                placeholder="Reason for cancellation..." 
                value={cancelData.reason} 
                onChange={(e) => setCancelData({ reason: e.target.value })} 
                className="w-full p-4 bg-slate-900 border border-slate-700 rounded-xl h-32 mb-6 resize-none text-slate-200 placeholder-slate-500 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all" 
              />

              <div className="flex gap-3">
                <button 
                  onClick={() => { setShowCancelModal(false); setCancelData({ reason: "" }); }} 
                  className="flex-1 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-slate-200 font-medium hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Go Back
                </button>
                <button 
                  onClick={handleCancelRequest} 
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium border-none cursor-pointer hover:bg-red-600 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all"
                >
                  Cancel Interview
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedInterview && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4" 
            onClick={() => setSelectedInterview(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
                <h2 className="text-xl font-bold m-0 text-slate-100 outfit-font">Interview Details</h2>
                <button 
                  onClick={() => setSelectedInterview(null)} 
                  className="bg-slate-700/50 hover:bg-slate-700 border-none rounded-lg p-2 cursor-pointer text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="grid gap-4 text-sm">
                <div className="flex justify-between bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                  <strong className="text-slate-400">Company:</strong> 
                  <span className="text-slate-200">{selectedInterview.company}</span>
                </div>
                <div className="flex justify-between bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                  <strong className="text-slate-400">Interviewer:</strong> 
                  <span className="text-slate-200">{selectedInterview.interviewer}</span>
                </div>
                <div className="flex justify-between bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                  <strong className="text-slate-400">Date:</strong> 
                  <span className="text-slate-200">{formatDate(selectedInterview.date)}</span>
                </div>
                <div className="flex justify-between bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                  <strong className="text-slate-400">Time:</strong> 
                  <span className="text-slate-200">{selectedInterview.time}</span>
                </div>
                <div className="flex justify-between bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                  <strong className="text-slate-400">Status:</strong> 
                  <span className="text-slate-200">{getStatusBadge(selectedInterview.status)}</span>
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedInterview(null)} 
                className="w-full mt-8 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-100 border border-slate-600 rounded-xl font-medium cursor-pointer transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CandidateInterviews;