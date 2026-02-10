import { useState } from "react";
import Card from "../components/Card";
import "./Jobposting.css";

const Jobposting = () => {
  const [search, setSearch] = useState("");

  const jobs = [
    {
      company: "Google",
      post: "Software Engineer",
      tag1: "Full Time",
      tag2: "Junior Level",
      datePosted: "2 days ago",
      pay: "₹4,500/hour",
      location: "Mumbai, India",
      brandLogo: "https://img.icons8.com/color/48/google-logo.png",
    },
    {
      company: "Amazon",
      post: "Backend Developer",
      tag1: "Full Time",
      tag2: "Mid Level",
      datePosted: "1 day ago",
      pay: "₹5,000/hour",
      location: "Hyderabad, India",
      brandLogo: "https://img.icons8.com/color/48/amazon.png",
    },
    {
      company: "Microsoft",
      post: "Frontend Developer",
      tag1: "Full Time",
      tag2: "Senior Level",
      datePosted: "3 days ago",
      pay: "₹6,000/hour",
      location: "Bangalore, India",
      brandLogo: "https://img.icons8.com/color/48/microsoft.png",
    },
    {
      company: "Apple",
      post: "iOS Developer",
      tag1: "Contract",
      tag2: "Mid Level",
      datePosted: "4 days ago",
      pay: "₹5,500/hour",
      location: "Delhi, India",
      brandLogo: "https://img.icons8.com/color/48/mac-os.png",
    },
  ];

  const filteredJobs = jobs.filter((job) =>
    job.company.toLowerCase().includes(search.toLowerCase()) ||
    job.post.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="jobposting-page">
      {/* Header */}
      <div className="jobposting-header">
        <div className="header-left">
          <h1>Job Postings</h1>
          <p>Manage and track all open positions</p>
        </div>
        <button className="add-job-btn">+ Add New Job</button>
      </div>

      {/* Search */}
      <div className="jobposting-search">
        <input
          type="text"
          placeholder="Search by company or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Cards */}
      <div className="jobposting-grid">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job, index) => (
            <Card key={index} {...job} />
          ))
        ) : (
          <div className="no-results">
            <p>No jobs found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobposting;