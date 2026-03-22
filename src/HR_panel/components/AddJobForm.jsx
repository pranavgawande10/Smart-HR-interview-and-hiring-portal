import { useState } from "react";
import { X } from "lucide-react";

const AddJobForm = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    company: "",
    post: "",
    tag1: "Full Time",
    tag2: "Junior Level",
    datePosted: "Just now",
    pay: "",
    location: "",
    brandLogo: "https://img.icons8.com/color/48/company.png", // Default logo
    employmentType: "Full Time",
    experienceLevel: "Junior Level",
    description: "",
    responsibilities: [""],
    requirements: [""],
    skills: [""],
    benefits: [""],
    about: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleArrayChange = (index, field, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const removeArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filter out empty items from arrays
    const cleanedData = {
      ...formData,
      responsibilities: formData.responsibilities.filter(item => item.trim() !== ""),
      requirements: formData.requirements.filter(item => item.trim() !== ""),
      skills: formData.skills.filter(item => item.trim() !== ""),
      benefits: formData.benefits.filter(item => item.trim() !== ""),
    };
    
    onSave(cleanedData);
  };

  return (
    <div style={{
      position: "fixed",
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
      background: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: "2000",
      backdropFilter: "blur(4px)",
    }}>
      <div style={{
        background: "white",
        borderRadius: "20px",
        width: "90%",
        maxWidth: "800px",
        maxHeight: "90vh",
        overflow: "auto",
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
      }}>
        
        {/* Header */}
        <div style={{
          padding: "20px 30px",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%)",
          color: "white",
          borderRadius: "20px 20px 0 0",
        }}>
          <h2 style={{ fontSize: "22px", fontWeight: "600", margin: "0" }}>Add New Job Posting</h2>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "white",
              borderRadius: "8px",
              padding: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "30px" }}>
          
          {/* Basic Information */}
          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", marginBottom: "20px", paddingBottom: "10px", borderBottom: "1px solid #e2e8f0" }}>
              Basic Information
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#4b5563", marginBottom: "6px" }}>
                  Company Name *
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#4b5563", marginBottom: "6px" }}>
                  Job Title *
                </label>
                <input
                  type="text"
                  name="post"
                  value={formData.post}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#4b5563", marginBottom: "6px" }}>
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Mumbai, India"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#4b5563", marginBottom: "6px" }}>
                  Salary *
                </label>
                <input
                  type="text"
                  name="pay"
                  value={formData.pay}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 4,500/hour"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#4b5563", marginBottom: "6px" }}>
                  Job Type
                </label>
                <select
                  name="tag1"
                  value={formData.tag1}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    background: "white",
                  }}
                >
                  <option>Full Time</option>
                  <option>Part Time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                  <option>Remote</option>
                  <option>Hybrid</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#4b5563", marginBottom: "6px" }}>
                  Experience Level
                </label>
                <select
                  name="tag2"
                  value={formData.tag2}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    background: "white",
                  }}
                >
                  <option>Junior Level</option>
                  <option>Mid Level</option>
                  <option>Senior Level</option>
                  <option>Lead</option>
                  <option>Manager</option>
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", marginBottom: "20px", paddingBottom: "10px", borderBottom: "1px solid #e2e8f0" }}>
              Job Description
            </h3>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                fontFamily: "inherit",
              }}
              placeholder="Describe the job role and responsibilities..."
            />
          </div>

          {/* Responsibilities */}
          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", marginBottom: "20px", paddingBottom: "10px", borderBottom: "1px solid #e2e8f0" }}>
              Responsibilities
            </h3>
            {formData.responsibilities.map((item, index) => (
              <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange(index, "responsibilities", e.target.value)}
                  style={{
                    flex: "1",
                    padding: "10px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    fontSize: "14px",
                  }}
                  placeholder={`Responsibility ${index + 1}`}
                />
                {formData.responsibilities.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem("responsibilities", index)}
                    style={{
                      background: "#fee2e2",
                      color: "#ef4444",
                      border: "none",
                      borderRadius: "6px",
                      padding: "0 12px",
                      cursor: "pointer",
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("responsibilities")}
              style={{
                background: "transparent",
                color: "rgb(20, 184, 166)",
                border: "1px dashed rgb(20, 184, 166)",
                borderRadius: "6px",
                padding: "8px 16px",
                fontSize: "14px",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              + Add Responsibility
            </button>
          </div>

          {/* Requirements */}
          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", marginBottom: "20px", paddingBottom: "10px", borderBottom: "1px solid #e2e8f0" }}>
              Requirements
            </h3>
            {formData.requirements.map((item, index) => (
              <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange(index, "requirements", e.target.value)}
                  style={{
                    flex: "1",
                    padding: "10px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    fontSize: "14px",
                  }}
                  placeholder={`Requirement ${index + 1}`}
                />
                {formData.requirements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem("requirements", index)}
                    style={{
                      background: "#fee2e2",
                      color: "#ef4444",
                      border: "none",
                      borderRadius: "6px",
                      padding: "0 12px",
                      cursor: "pointer",
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("requirements")}
              style={{
                background: "transparent",
                color: "rgb(20, 184, 166)",
                border: "1px dashed rgb(20, 184, 166)",
                borderRadius: "6px",
                padding: "8px 16px",
                fontSize: "14px",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              + Add Requirement
            </button>
          </div>

          {/* Skills */}
          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", marginBottom: "20px", paddingBottom: "10px", borderBottom: "1px solid #e2e8f0" }}>
              Skills
            </h3>
            {formData.skills.map((item, index) => (
              <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange(index, "skills", e.target.value)}
                  style={{
                    flex: "1",
                    padding: "10px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    fontSize: "14px",
                  }}
                  placeholder={`Skill ${index + 1}`}
                />
                {formData.skills.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem("skills", index)}
                    style={{
                      background: "#fee2e2",
                      color: "#ef4444",
                      border: "none",
                      borderRadius: "6px",
                      padding: "0 12px",
                      cursor: "pointer",
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("skills")}
              style={{
                background: "transparent",
                color: "rgb(20, 184, 166)",
                border: "1px dashed rgb(20, 184, 166)",
                borderRadius: "6px",
                padding: "8px 16px",
                fontSize: "14px",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              + Add Skill
            </button>
          </div>

          {/* Benefits */}
          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", marginBottom: "20px", paddingBottom: "10px", borderBottom: "1px solid #e2e8f0" }}>
              Benefits
            </h3>
            {formData.benefits.map((item, index) => (
              <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange(index, "benefits", e.target.value)}
                  style={{
                    flex: "1",
                    padding: "10px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    fontSize: "14px",
                  }}
                  placeholder={`Benefit ${index + 1}`}
                />
                {formData.benefits.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem("benefits", index)}
                    style={{
                      background: "#fee2e2",
                      color: "#ef4444",
                      border: "none",
                      borderRadius: "6px",
                      padding: "0 12px",
                      cursor: "pointer",
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("benefits")}
              style={{
                background: "transparent",
                color: "rgb(20, 184, 166)",
                border: "1px dashed rgb(20, 184, 166)",
                borderRadius: "6px",
                padding: "8px 16px",
                fontSize: "14px",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              + Add Benefit
            </button>
          </div>

          {/* About Company */}
          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", marginBottom: "20px", paddingBottom: "10px", borderBottom: "1px solid #e2e8f0" }}>
              About Company
            </h3>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              rows="3"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                fontFamily: "inherit",
              }}
              placeholder="Tell us about your company..."
            />
          </div>

          {/* Form Buttons */}
          <div style={{ display: "flex", gap: "15px", justifyContent: "flex-end", borderTop: "1px solid #e2e8f0", paddingTop: "20px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "transparent",
                color: "#64748b",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "12px 24px",
                fontSize: "15px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                background: "linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "12px 24px",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Save Job Posting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobForm;