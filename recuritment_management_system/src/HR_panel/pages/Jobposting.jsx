import { useState, useEffect } from "react";
import Card from "../components/Card";
import AddJobForm from "../components/AddJobForm";
import { Search } from "lucide-react";

// Define your company information here
const COMPANY_INFO = {
  name: "Google", 
  logo: "https://img.icons8.com/color/48/google-logo.png",
  id: "google"
};

const Jobposting = () => {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [jobs, setJobs] = useState([]);

  // Load jobs from localStorage when component mounts
  useEffect(() => {
    const savedJobs = localStorage.getItem("hrJobs");
    if (savedJobs) {
      const allJobs = JSON.parse(savedJobs);
      // Filter to only show jobs from this company
      const companyJobs = allJobs.filter(job => job.company === COMPANY_INFO.name);
      setJobs(companyJobs);
    } else {
      // Default jobs for YOUR COMPANY ONLY
      const defaultJobs = [
        {
          id: `${COMPANY_INFO.id}-software-engineer`,
          company: COMPANY_INFO.name,
          title: "Software Engineer",
          vacancies: 3,
          datePosted: "2 days ago",
          salary: "4,500/hour",
          location: "Mumbai, India",
          brandLogo: COMPANY_INFO.logo,
          description: `We are looking for a passionate Software Engineer to join our dynamic team at ${COMPANY_INFO.name}.`,
          skillsRequired: ["React", "JavaScript", "Node.js"],
          isExpired: true
        },
        {
          id: `${COMPANY_INFO.id}-backend-developer`,
          company: COMPANY_INFO.name,
          title: "Backend Developer",
          vacancies: 2,
          datePosted: "1 day ago",
          salary: "5,000/hour",
          location: "Hyderabad, India",
          brandLogo: COMPANY_INFO.logo,
          description: `${COMPANY_INFO.name} is seeking a talented Backend Developer.`,
          skillsRequired: ["Java", "Python", "Node.js", "PostgreSQL"],
          isExpired: false
        },
        {
          id: `${COMPANY_INFO.id}-frontend-developer`,
          company: COMPANY_INFO.name,
          title: "Frontend Developer",
          vacancies: 5,
          datePosted: "3 days ago",
          salary: "6,000/hour",
          location: "Bangalore, India",
          brandLogo: COMPANY_INFO.logo,
          description: `${COMPANY_INFO.name} is looking for a Senior Frontend Developer.`,
          skillsRequired: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
          isExpired: false
        }
      ];
      setJobs(defaultJobs);
      localStorage.setItem("hrJobs", JSON.stringify(defaultJobs));
    }
  }, []);

  // Save jobs to localStorage whenever jobs change
  useEffect(() => {
    if (jobs.length > 0) {
      // Get all jobs from localStorage
      const allJobs = JSON.parse(localStorage.getItem("hrJobs") || "[]");
      // Remove old jobs from this company
      const otherJobs = allJobs.filter(job => job.company !== COMPANY_INFO.name);
      // Add updated jobs
      const updatedAllJobs = [...otherJobs, ...jobs];
      localStorage.setItem("hrJobs", JSON.stringify(updatedAllJobs));
    }
  }, [jobs]);

  // Filter jobs - only by role since company is always the same
  const filteredJobs = jobs.filter((job) =>
    (job.title || job.post || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleAddNewJob = () => {
    setShowForm(true);
  };

  const handleSaveJob = (newJob) => {
    // Create a URL-friendly ID with company name
    const jobId = `${COMPANY_INFO.id}-${newJob.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    
    // Set date posted to current time
    const datePosted = "Just now";
    
    // Create job with company info
    const jobWithCompany = {
      ...newJob,
      company: COMPANY_INFO.name,
      brandLogo: COMPANY_INFO.logo,
      id: jobId,
      datePosted: datePosted,
      isExpired: false
    };
    
    // Add the new job to the list
    const updatedJobs = [...jobs, jobWithCompany];
    setJobs(updatedJobs);
    
    // Close the form
    setShowForm(false);
  };

  // Handle delete job
  const handleDeleteJob = (jobId) => {
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      const updatedJobs = jobs.filter(job => job.id !== jobId);
      setJobs(updatedJobs);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      
      {/* Header with Title and Add Button */}
      <div style={{
        marginBottom: "30px",
        padding: "25px",
        background: "linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%)",
        borderRadius: "16px",
        color: "white",
        boxShadow: "0 4px 20px rgba(20, 184, 166, 0.3)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <img 
              src={COMPANY_INFO.logo} 
              alt={COMPANY_INFO.name}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                background: "white",
                padding: "8px",
              }}
            />
            <h1 style={{
              fontSize: "28px",
              fontWeight: "700",
              margin: 0,
              color: "white",
            }}>
              {COMPANY_INFO.name}
            </h1>
          </div>
          <p style={{
            fontSize: "16px",
            opacity: "0.9",
            margin: "0",
            color: "rgba(255, 255, 255, 0.9)",
          }}>
            Manage and track all open positions
          </p>
        </div>
        
        {/* Add New Job Button */}
        <button
          onClick={handleAddNewJob}
          style={{
            background: "white",
            color: "rgb(20, 184, 166)",
            border: "none",
            borderRadius: "10px",
            padding: "12px 24px",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
          }}
        >
          <span style={{ fontSize: "20px" }}>+</span>
          Add New Job
        </button>
      </div>

      {/* Search Bar - Updated placeholder */}
      <div style={{
        marginBottom: "30px",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        border: "1px solid #e2e8f0",
        padding: "4px",
        display: "flex",
        alignItems: "center",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          flex: "1",
          padding: "0 16px",
        }}>
          <Search size={20} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search by job role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 12px",
              border: "none",
              fontSize: "15px",
              outline: "none",
              background: "transparent",
            }}
          />
        </div>
        <button style={{
          background: "linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%)",
          color: "white",
          border: "none",
          borderRadius: "10px",
          padding: "12px 24px",
          fontSize: "14px",
          fontWeight: "600",
          cursor: "pointer",
          margin: "4px",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = "0.9";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "1";
          e.currentTarget.style.transform = "translateY(0)";
        }}>
          Search
        </button>
      </div>

      {/* Stats Row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px",
        marginBottom: "30px",
      }}>
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          border: "1px solid #e2e8f0",
        }}>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "5px" }}>Total Jobs</p>
          <h3 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", margin: "0" }}>
            {jobs.length}
          </h3>
        </div>
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          border: "1px solid #e2e8f0",
        }}>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "5px" }}>Active Applications</p>
          <h3 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", margin: "0" }}>124</h3>
        </div>
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          border: "1px solid #e2e8f0",
        }}>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "5px" }}>Hiring Rate</p>
          <h3 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", margin: "0" }}>68%</h3>
        </div>
      </div>

      {/* Jobs Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
        gap: "20px",
      }}>
        {filteredJobs.map((job) => (
          <Card 
            key={job.id} 
            {...job} 
            showDelete={true} 
            onDelete={handleDeleteJob}
            id={job.id}
          />
        ))}
      </div>

      {/* No Results Message */}
      {filteredJobs.length === 0 && (
        <div style={{
          textAlign: "center",
          padding: "60px",
          background: "white",
          borderRadius: "12px",
          border: "1px dashed #e2e8f0",
        }}>
          <p style={{ fontSize: "18px", color: "#64748b" }}>
            {search ? "No jobs found matching your search." : "No jobs posted yet. Click 'Add New Job' to create your first posting."}
          </p>
        </div>
      )}

      {/* Add Job Form Modal */}
      {showForm && (
        <AddJobForm onClose={handleCloseForm} onSave={handleSaveJob} />
      )}
    </div>
  );
};

export default Jobposting;