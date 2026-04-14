import { useState } from "react";
import JobCard from "../../Candidate_panel/components/Card";
import { Search } from "lucide-react";

const CandidateJobs = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const allJobs = [
    {
      company: "Google",
      post: "Software Engineer",
      tag1: "Full Time",
      tag2: "Remote",
      datePosted: "2 days ago",
      pay: "4,500/hour",
      location: "Mumbai, India",
      brandLogo: "https://img.icons8.com/color/48/google-logo.png",
    },
    {
      company: "Amazon",
      post: "Backend Developer",
      tag1: "Full Time",
      tag2: "Hybrid",
      datePosted: "1 day ago",
      pay: "5,000/hour",
      location: "Hyderabad, India",
      brandLogo: "https://img.icons8.com/color/48/amazon.png",
    },
    // Add more jobs...
  ];

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

      {/* Job Cards Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
        gap: "20px",
      }}>
        {allJobs.map((job, index) => (
          <JobCard key={index} {...job} />
        ))}
      </div>
    </div>
  );
};

export default CandidateJobs;