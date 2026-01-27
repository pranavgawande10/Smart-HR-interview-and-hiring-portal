import { useState } from "react";
import Card from "../components/Card";
import "./Jobposting.css";

const Jobposting = () => {
  const [search, setSearch] = useState("");

  const jobOpenings = [
    {
      companyName: "Google",
      post: "Software Engineer",
      tag1: "Full Time",
      tag2: "Junior Level",
      datePosted: "2 days ago",
      pay: "4500/hour",
      location: "Mumbai, India",
      brandLogo:
        "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    },
    {
      companyName: "Amazon",
      post: "Backend Developer",
      tag1: "Full Time",
      tag2: "Mid Level",
      datePosted: "1 day ago",
      pay: "5000/hour",
      location: "Hyderabad, India",
      brandLogo:
        "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    },
   /* {
      companyName: "Microsoft",
      post: "Cloud Engineer",
      tag1: "Full Time",
      tag2: "Senior Level",
      datePosted: "4 days ago",
      pay: "6500/hour",
      location: "Pune, India",
      brandLogo:
        "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    },*/
  ];

  const filteredJobs = jobOpenings.filter(
    (job) =>
      job.companyName.toLowerCase().includes(search.toLowerCase()) ||
      job.post.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="jobposting-page">
      {/* HEADER */}
     <div className="jobposting-header">
     <div className="header-left">
     <h1>Job Postings</h1>
     <p>Manage and track all open positions</p>
     </div>

  <button className="button-create">Create +</button>
</div>


      {/* SEARCH */}
      <div className="jobposting-search">
        <input
          type="text"
          placeholder="Search by company or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* CARDS */}
      <div className="jobposting-grid">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job, index) => (
            <Card key={index} {...job} />
          ))
        ) : (
          <p className="no-results">No job postings found.</p>
        )}
      </div>
    </div>
  );
};

export default Jobposting;
