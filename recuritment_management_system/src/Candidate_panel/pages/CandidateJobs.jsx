import { useState, useEffect } from "react";
import JobCard from "../../Candidate_panel/components/Card";
import { Search } from "lucide-react";
import axios from "axios";

const CandidateJobs = () => {
  const [search, setSearch] = useState("");
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/v1/jobs/all-jobs");
        const jobsArray = res.data.data || res.data; // Handles both structures securely
        const mapped = jobsArray.map(job => ({
          _id: job._id,
          company: job.createdBy?.companyName || "Unknown Company",
          post: job.title,
          tag1: "Full Time",
          tag2: job.location,
          datePosted: new Date(job.createdAt || Date.now()).toLocaleDateString(),
          pay: "Competitive",
          location: job.location,
          brandLogo: "https://img.icons8.com/color/48/domain.png",
        }));
        setAllJobs(mapped);
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
    <div>
      <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>
        Browse Jobs
      </h1>
      <p style={{ fontSize: "16px", color: "#64748b", marginBottom: "30px" }}>
        Find your dream job from thousands of opportunities
      </p>

      {/* Search Bar */}
      <div style={{
        display: "flex",
        gap: "16px",
        marginBottom: "30px",
      }}>
        <div style={{
          flex: "1",
          display: "flex",
          alignItems: "center",
          background: "white",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "0 16px",
        }}>
          <Search size={20} color="#64748b" />
          <input
            type="text"
            placeholder="Search by job title, company, or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              outline: "none",
              fontSize: "15px",
            }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>Loading jobs...</div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "20px",
        }}>
          {filteredJobs.map((job) => (
            <JobCard key={job._id} {...job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidateJobs;