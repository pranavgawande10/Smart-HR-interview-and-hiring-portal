import { useState, useEffect } from "react";
import JobCard from "../../Candidate_panel/components/Card";
import { Search } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

const CandidateJobs = () => {
  const [search, setSearch] = useState("");
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:3000/job/all");
        const jobsArray = res.data?.data || res.data || [];
        
        if (Array.isArray(jobsArray)) {
          const mapped = jobsArray.map(job => ({
            ...job,
            _id: job._id,
            company: job.createdBy?.companyName || "Unknown Company",
            post: job.title,
            tag1: job.jobType || "Full Time",
            tag2: job.location,
            datePosted: new Date(job.createdAt || Date.now()).toLocaleDateString(),
            pay: job.salary || "Competitive",
            location: job.location,
            brandLogo: "https://img.icons8.com/color/48/domain.png",
          }));
          setAllJobs(mapped);
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = allJobs.filter(job => 
    job.post.toLowerCase().includes(search.toLowerCase()) || 
    job.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto p-4 sm:p-6 text-slate-100 min-h-screen"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100 mb-2 outfit-font">
          Browse Jobs
        </h1>
        <p className="text-slate-400">
          Find your dream job from thousands of opportunities
        </p>
      </div>

      {/* Search Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-4 mb-10"
      >
        <div className="flex-1 flex items-center glass-card border border-slate-700/50 rounded-xl px-4 transition-all focus-within:border-sky-500 focus-within:shadow-[0_0_15px_rgba(14,165,233,0.15)]">
          <Search size={20} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search by job title, company, or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent p-3.5 border-none outline-none text-slate-200 placeholder-slate-500 text-sm font-medium"
          />
        </div>
      </motion.div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 glass-card rounded-xl border border-slate-700/50">
          <div className="inline-block w-8 h-8 border-4 border-slate-600 border-t-sky-500 rounded-full animate-spin mb-4"></div>
          <p>Loading jobs...</p>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
        >
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, idx) => (
              <motion.div 
                key={job._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * (idx % 10) }}
              >
                 <JobCard {...job} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-slate-400 glass-card rounded-xl border border-slate-700/50">
              No jobs found matching your search.
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default CandidateJobs;