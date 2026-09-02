import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Users,
  Clock,
  ChevronLeft
} from "lucide-react";
import ApplyForm from "../ApplyForm";

const CandidateJobDescription = () => {
  const { jobId } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/v1/jobs/${jobId}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
          }
        );

        setJob(res.data);
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] text-slate-300 gap-4">
        <h2 className="text-2xl font-bold">Job not found</h2>
        <Link to="/candidate/jobs" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2">
          <ChevronLeft size={16} /> Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        to="/candidate/jobs"
        className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium mb-6 transition-colors"
      >
        <ChevronLeft size={16} /> Back to Jobs
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card rounded-2xl overflow-hidden border border-slate-700/50 relative"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 p-8 border-b border-slate-700/50">
          <h1 className="text-3xl font-bold text-white mb-4 outfit-font">{job.title}</h1>
          
          <div className="flex flex-wrap gap-4 text-slate-300 text-sm">
            <span className="flex items-center gap-1.5 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
              <MapPin size={16} className="text-indigo-400" /> {job.location || 'Remote'}
            </span>
            <span className="flex items-center gap-1.5 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
              <Briefcase size={16} className="text-purple-400" /> {job.jobType || 'Full Time'}
            </span>
            <span className="flex items-center gap-1.5 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
              <Clock size={16} className="text-emerald-400" /> {new Date(job.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-xl">
              <DollarSign size={24} className="text-indigo-400 mb-2" />
              <p className="text-slate-400 text-sm">Salary</p>
              <h3 className="text-lg font-semibold text-white">{job.salary || "Not disclosed"}</h3>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-xl">
              <Users size={24} className="text-purple-400 mb-2" />
              <p className="text-slate-400 text-sm">Experience</p>
              <h3 className="text-lg font-semibold text-white">{job.experience || "Not specified"}</h3>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-xl">
              <Briefcase size={24} className="text-emerald-400 mb-2" />
              <p className="text-slate-400 text-sm">Job Type</p>
              <h3 className="text-lg font-semibold text-white">{job.jobType || "Full Time"}</h3>
            </div>
          </div>

          <h2 className="text-xl font-bold text-white mb-4 outfit-font border-b border-slate-700/50 pb-2">Job Description</h2>
          <div className="text-slate-300 leading-relaxed mb-8 whitespace-pre-wrap">
            {job.description}
          </div>

          {job.skills?.length > 0 && (
            <>
              <h2 className="text-xl font-bold text-white mb-4 outfit-font border-b border-slate-700/50 pb-2">Skills Required</h2>
              <div className="flex flex-wrap gap-2 mb-8">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </>
          )}

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setShowApplyModal(true)}
              className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] transition-all transform hover:-translate-y-1"
            >
              Apply Now
            </button>
          </div>
        </div>
      </motion.div>
      
      {showApplyModal && (
        <ApplyForm
          jobId={jobId}
          jobTitle={job.title}
          companyName={job.company}
          onClose={() => setShowApplyModal(false)}
        />
      )}
    </div>
  );
};

export default CandidateJobDescription;