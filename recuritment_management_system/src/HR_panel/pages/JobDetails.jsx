import { useParams, Link } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  Award,
  Users,
  Clock,
} from "lucide-react";

// Sample job data (in real app, this would come from an API/state)
const jobData = {
  
};

const JobDetails = () => {
  const { jobId } = useParams();
  const job = jobData[jobId];

  if (!job) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Job not found</h2>
        <Link to="/hr/jobs" style={{ color: "#0369a1" }}>
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "30px 20px" }}>
      {/* Back Button */}
      <Link
        to="/hr/jobs"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          color: "rgb(20, 184, 166)",
          textDecoration: "none",
          marginBottom: "20px",
          fontSize: "15px",
          fontWeight: "500",
        }}
      >
        ← Back to Job Postings
      </Link>

      {/* Main Content */}
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        {/* Company Header - Teal Gradient */}
        <div
          style={{
            background:
              "linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%)",
            padding: "40px",
            color: "white",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                background: "white",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "15px",
              }}
            >
              <img
                src={job.logo}
                alt={job.company}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <div>
              <h1
                style={{
                  fontSize: "36px",
                  fontWeight: "700",
                  marginBottom: "8px",
                }}
              >
                {job.title}
              </h1>
              <p
                style={{
                  fontSize: "18px",
                  opacity: "0.9",
                  marginBottom: "15px",
                }}
              >
                {job.company}
              </p>
              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "14px",
                  }}
                >
                  <MapPin size={16} /> {job.location}
                </span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "14px",
                  }}
                >
                  <Clock size={16} /> {job.postedDate}
                </span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "14px",
                  }}
                >
                  <Briefcase size={16} /> {job.employmentType}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Job Details Body */}
        <div style={{ padding: "40px" }}>
          {/* Quick Info Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
              marginBottom: "40px",
            }}
          >
            <div
              style={{
                background: "#f8fafc",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
              }}
            >
              <DollarSign
                size={20}
                color="rgb(20, 184, 166)"
                style={{ marginBottom: "8px" }}
              />
              <p
                style={{
                  color: "#64748b",
                  fontSize: "14px",
                  marginBottom: "4px",
                }}
              >
                Salary
              </p>
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#0f172a",
                }}
              >
                {job.salary}
              </p>
            </div>
            <div
              style={{
                background: "#f8fafc",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
              }}
            >
              <Briefcase
                size={20}
                color="rgb(20, 184, 166)"
                style={{ marginBottom: "8px" }}
              />
              <p
                style={{
                  color: "#64748b",
                  fontSize: "14px",
                  marginBottom: "4px",
                }}
              >
                Experience
              </p>
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#0f172a",
                }}
              >
                {job.experienceLevel}
              </p>
            </div>
            <div
              style={{
                background: "#f8fafc",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
              }}
            >
              <Users
                size={20}
                color="rgb(20, 184, 166)"
                style={{ marginBottom: "8px" }}
              />
              <p
                style={{
                  color: "#64748b",
                  fontSize: "14px",
                  marginBottom: "4px",
                }}
              >
                Job Type
              </p>
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#0f172a",
                }}
              >
                {job.employmentType}
              </p>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: "40px" }}>
            <h2
              style={{
                fontSize: "22px",
                fontWeight: "600",
                color: "#0f172a",
                marginBottom: "16px",
              }}
            >
              Job Description
            </h2>
            <p
              style={{ fontSize: "16px", lineHeight: "1.7", color: "#334155" }}
            >
              {job.description}
            </p>
          </div>

          {/* Two Column Layout */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "30px",
              marginBottom: "40px",
            }}
          >
            {/* Responsibilities */}
            <div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#0f172a",
                  marginBottom: "16px",
                }}
              >
                Responsibilities
              </h3>
              <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
                {job.responsibilities.map((item, index) => (
                  <li
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      marginBottom: "12px",
                      fontSize: "15px",
                      color: "#334155",
                    }}
                  >
                    <span
                      style={{ color: "rgb(20, 184, 166)", fontSize: "18px" }}
                    >
                      •
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#0f172a",
                  marginBottom: "16px",
                }}
              >
                Requirements
              </h3>
              <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
                {job.requirements.map((item, index) => (
                  <li
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      marginBottom: "12px",
                      fontSize: "15px",
                      color: "#334155",
                    }}
                  >
                    <span
                      style={{ color: "rgb(20, 184, 166)", fontSize: "18px" }}
                    >
                      •
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Skills */}
          <div style={{ marginBottom: "40px" }}>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#0f172a",
                marginBottom: "16px",
              }}
            >
              Required Skills
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {job.skills.map((skill, index) => (
                <span
                  key={index}
                  style={{
                    background: "#f0fdf4",
                    color: "rgb(20, 184, 166)",
                    padding: "8px 16px",
                    borderRadius: "30px",
                    fontSize: "14px",
                    fontWeight: "500",
                    border: "1px solid rgba(20, 184, 166, 0.2)",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div style={{ marginBottom: "40px" }}>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#0f172a",
                marginBottom: "16px",
              }}
            >
              Benefits & Perks
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "15px",
              }}
            >
              {job.benefits.map((benefit, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px",
                    background: "#f8fafc",
                    borderRadius: "10px",
                  }}
                >
                  <span
                    style={{ color: "rgb(20, 184, 166)", fontSize: "18px" }}
                  >
                    ✓
                  </span>
                  <span style={{ fontSize: "14px", color: "#334155" }}>
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* About Company */}
          <div style={{ marginBottom: "40px" }}>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#0f172a",
                marginBottom: "16px",
              }}
            >
              About {job.company}
            </h3>
            <p
              style={{
                fontSize: "15px",
                lineHeight: "1.7",
                color: "#334155",
                background: "#f8fafc",
                padding: "20px",
                borderRadius: "12px",
              }}
            >
              {job.about}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
