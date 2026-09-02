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
  ChevronRight,
  X
} from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const CandidateApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/v1/application/my-applications", {
          withCredentials: true,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        
        const mapped = res.data.applications.map(app => {
          let mappedStatus = "reviewing";
          if (app.status === "rejected") mappedStatus = "rejected";
          else if (app.status === "selected") mappedStatus = "hired";
          else if (app.status === "shortlisted") mappedStatus = "shortlisted";

          return {
            id: app._id,
            jobTitle: app.job?.title || "Unknown Role",
            company: app.job?.company || "Company",
            location: app.job?.location || "Remote",
            appliedDate: app.createdAt,
            status: mappedStatus,
            salary: "Competitive",
            jobType: "Full Time",
            experience: app.job?.experience || "N/A",
            applicationStatus: `Application is ${app.status}`,
            interviewDate: null,
            feedback: null
          };
        });

        setApplications(mapped);
      } catch (err) {
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const getStatusBadge = (status) => {
    const styles = {
      reviewing: { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", label: "Under Review", icon: Clock },
      interview: { color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", label: "Interview Scheduled", icon: Calendar },
      shortlisted: { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", label: "Shortlisted", icon: CheckCircle },
      hired: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "Selected", icon: CheckCircle },
      rejected: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", label: "Not Selected", icon: XCircle }
    };
    const config = styles[status] || styles.reviewing;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 ${config.bg} ${config.color} border ${config.border} px-3 py-1.5 rounded-full text-xs font-medium`}>
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
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 p-8 bg-gradient-to-br from-teal-500 to-sky-500 rounded-2xl text-white shadow-[0_4px_20px_rgba(20,184,166,0.3)] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl pointer-events-none"></div>
        <h1 className="text-3xl font-bold mb-2 outfit-font relative z-10">
          My Applications
        </h1>
        <p className="text-white/90 relative z-10">
          Track the status of all your job applications
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
      >
        <div className="glass-card p-6 rounded-2xl border border-slate-700/50">
          <p className="text-slate-400 text-sm mb-2">Total Applications</p>
          <h3 className="text-3xl font-bold text-slate-100 m-0">{stats.total}</h3>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-slate-700/50 relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors pointer-events-none"></div>
          <p className="text-slate-400 text-sm mb-2">Under Review</p>
          <h3 className="text-3xl font-bold text-blue-400 m-0">{stats.reviewing}</h3>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-slate-700/50 relative overflow-hidden group">
          <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors pointer-events-none"></div>
          <p className="text-slate-400 text-sm mb-2">Interviews</p>
          <h3 className="text-3xl font-bold text-purple-400 m-0">{stats.interview}</h3>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-slate-700/50 relative overflow-hidden group">
          <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors pointer-events-none"></div>
          <p className="text-slate-400 text-sm mb-2">Selected</p>
          <h3 className="text-3xl font-bold text-emerald-400 m-0">{stats.hired}</h3>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex gap-3 mb-8 flex-wrap border-b border-slate-800 pb-4"
      >
        {["all", "reviewing", "interview", "shortlisted", "hired", "rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-5 py-2 rounded-lg text-sm transition-all duration-300 ${
              filter === tab 
                ? "bg-gradient-to-r from-teal-500 to-sky-500 text-white font-semibold shadow-[0_0_15px_rgba(20,184,166,0.25)]" 
                : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-700/50"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </motion.div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 glass-card rounded-2xl border border-slate-700/50"
        >
          <Briefcase size={48} className="text-slate-500 mb-4 mx-auto" />
          <h3 className="text-lg font-semibold text-slate-200 mb-2">
            No applications found
          </h3>
          <p className="text-slate-400 max-w-sm mx-auto">
            You haven't applied for any jobs matching this criteria yet.
          </p>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-4"
        >
          {filteredApplications.map((application, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (idx % 10) }}
              key={application.id}
              className="glass-card rounded-2xl border border-slate-700/50 overflow-hidden transition-all duration-300 hover:border-slate-600 hover:shadow-lg hover:-translate-y-1 cursor-pointer group"
              onClick={() => setSelectedApplication(application)}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4 flex-wrap gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-1 group-hover:text-teal-400 transition-colors">
                      {application.jobTitle}
                    </h3>
                    <p className="text-sm text-slate-400 m-0">
                      {application.company}
                    </p>
                  </div>
                  {getStatusBadge(application.status)}
                </div>

                {/* Details */}
                <div className="flex flex-wrap gap-5 mb-4 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-slate-500" />
                    <span className="text-sm text-slate-300">{application.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase size={16} className="text-slate-500" />
                    <span className="text-sm text-slate-300">{application.jobType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-slate-500" />
                    <span className="text-sm text-slate-300">{application.experience}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-slate-500" />
                    <span className="text-sm text-slate-300">
                      Applied on {formatDate(application.appliedDate)}
                    </span>
                  </div>
                </div>

                {/* Status Message */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="bg-slate-800/50 px-3 py-2 rounded-lg text-sm text-slate-300 border border-slate-700/50">
                    {application.applicationStatus}
                  </div>
                  <button className="flex items-center gap-1.5 bg-transparent border-none text-teal-400 text-sm font-medium cursor-pointer hover:text-teal-300 transition-colors">
                    View Details
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Application Details Modal */}
      <AnimatePresence>
        {selectedApplication && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4"
            onClick={() => setSelectedApplication(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-100 m-0 outfit-font">
                  Application Details
                </h2>
                <button 
                  onClick={() => setSelectedApplication(null)} 
                  className="bg-slate-700/50 hover:bg-slate-700 border-none rounded-lg p-2 cursor-pointer text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-base font-semibold text-slate-200 mb-3 border-b border-slate-700 pb-2">
                  Job Information
                </h3>
                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between"><strong className="text-slate-400">Position:</strong> <span className="text-slate-200">{selectedApplication.jobTitle}</span></div>
                  <div className="flex justify-between"><strong className="text-slate-400">Company:</strong> <span className="text-slate-200">{selectedApplication.company}</span></div>
                  <div className="flex justify-between"><strong className="text-slate-400">Location:</strong> <span className="text-slate-200">{selectedApplication.location}</span></div>
                  <div className="flex justify-between"><strong className="text-slate-400">Salary:</strong> <span className="text-slate-200">{selectedApplication.salary}</span></div>
                  <div className="flex justify-between"><strong className="text-slate-400">Job Type:</strong> <span className="text-slate-200">{selectedApplication.jobType}</span></div>
                  <div className="flex justify-between"><strong className="text-slate-400">Experience Level:</strong> <span className="text-slate-200">{selectedApplication.experience}</span></div>
                  <div className="flex justify-between"><strong className="text-slate-400">Applied on:</strong> <span className="text-slate-200">{formatDate(selectedApplication.appliedDate)}</span></div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-base font-semibold text-slate-200 mb-3 border-b border-slate-700 pb-2">
                  Application Status
                </h3>
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                  {getStatusBadge(selectedApplication.status)}
                  <p className="mt-3 text-sm text-slate-300">
                    {selectedApplication.applicationStatus}
                  </p>
                  {selectedApplication.feedback && (
                    <p className="mt-3 text-sm text-slate-300 pt-3 border-t border-slate-700/50">
                      <strong className="text-slate-400">Feedback:</strong> {selectedApplication.feedback}
                    </p>
                  )}
                </div>
              </div>

              {selectedApplication.interviewDate && (
                <div className="mb-6">
                  <h3 className="text-base font-semibold text-slate-200 mb-3 border-b border-slate-700 pb-2">
                    Interview Details
                  </h3>
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 text-sm">
                    <div className="flex justify-between mb-2"><strong className="text-slate-400">Date:</strong> <span className="text-slate-200">{selectedApplication.interviewDate}</span></div>
                    <div className="flex justify-between mb-4"><strong className="text-slate-400">Time:</strong> <span className="text-slate-200">{selectedApplication.interviewTime}</span></div>
                    {selectedApplication.interviewLink && (
                      <div className="mt-4 pt-4 border-t border-slate-700/50 text-center">
                        <a 
                          href={selectedApplication.interviewLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block bg-gradient-to-r from-teal-500 to-sky-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-all"
                        >
                          Join Interview
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setSelectedApplication(null)} 
                  className="flex-1 py-3 border border-slate-600 rounded-xl bg-slate-700/50 text-slate-200 font-medium hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CandidateApplications;