import { useState, useEffect } from "react";
import JobCard from "../../Candidate_panel/components/Card";
import axios from "axios";
import { motion } from "framer-motion";
import { Briefcase, FileText, Bookmark, Eye } from "lucide-react";

const CandidateDashboard = () => {
  const [stats, setStats] = useState({ applications: 0, interviews: 0 });
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [userName, setUserName] = useState("Candidate");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Get Name
        const userRes = await axios.get("http://localhost:3001/api/v1/candidates/current-user", config).catch(() => null);
        if (userRes) {
          const fetchedName = userRes.data.message?.name || userRes.data.data?.name;
          if (fetchedName) {
            setUserName(fetchedName);
            localStorage.setItem("userName", fetchedName);
          }
        }

        const appsRes = await axios.get("http://localhost:3001/api/v1/application/my-applications", config).catch(() => ({ data: { count: 0 } }));
        const intsRes = await axios.get("http://localhost:3001/api/v1/candidates/my-interviews", config).catch(() => ({ data: { count: 0 } }));

        setStats({
          applications: appsRes.data?.count || 0,
          interviews: intsRes.data?.count || 0,
        });
        
        const jobsRes = await axios.get("http://localhost:3000/job/all").catch(() => ({ data: { data: [] } }));
        const jobsArray = jobsRes.data?.data || jobsRes.data || []; // Extract array from standard response
        
        if (Array.isArray(jobsArray)) {
          const mappedJobs = jobsArray.slice(0, 4).map(job => ({
            _id: job._id,
            company: job.createdBy?.companyName || "Company",
            post: job.title,
            tag1: "Full Time",
            tag2: job.location,
            datePosted: new Date(job.createdAt || Date.now()).toLocaleDateString(),
            pay: "Competitive",
            location: job.location,
            brandLogo: "https://img.icons8.com/color/48/domain.png",
          }));
          setRecommendedJobs(mappedJobs);
        }

      } catch (err) {
        console.error("Dashboard Error:", err);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto p-4 sm:p-6 text-slate-100"
    >
      {/* Welcome Section */}
      <motion.div 
        className="glass-card rounded-2xl p-8 mb-8 relative overflow-hidden border border-slate-700/50"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Animated background blobs */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-teal-500 rounded-full blur-[80px] opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-sky-500 rounded-full blur-[80px] opacity-20 animate-blob animation-delay-2000"></div>
        
        <h1 className="text-3xl font-bold mb-2 outfit-font relative z-10">
          Welcome back, <span className="text-gradient">{userName}</span>!
        </h1>
        <p className="text-slate-400 relative z-10">Here is what's happening with your job applications today.</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Applications", value: stats.applications, icon: FileText, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Interviews", value: stats.interviews, icon: Briefcase, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Saved Jobs", value: 0, icon: Bookmark, color: "text-purple-400", bg: "bg-purple-500/10" },
          { label: "Profile Views", value: 0, icon: Eye, color: "text-pink-400", bg: "bg-pink-500/10" }
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            className="glass-card p-6 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all duration-300 group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + (idx * 0.1) }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon size={20} className={stat.color} />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-100 group-hover:text-white transition-colors">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Recommended Jobs Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mb-10"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold outfit-font text-slate-100 flex items-center gap-2">
            Recommended Jobs
            <div className="h-1 w-12 bg-sky-500 rounded-full ml-2"></div>
          </h2>
          <a href="/candidate/jobs" className="text-sm px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-sky-400 hover:text-sky-300 font-medium transition-colors border border-slate-700/50">
            View All
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {recommendedJobs.length > 0 ? (
            recommendedJobs.map((job, idx) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + (idx * 0.1) }}
              >
                <JobCard {...job} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-slate-400 glass-card rounded-xl border border-slate-700/50">
              No recommended jobs found at the moment.
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CandidateDashboard;