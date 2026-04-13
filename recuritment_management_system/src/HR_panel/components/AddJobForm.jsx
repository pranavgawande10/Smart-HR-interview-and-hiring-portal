import { useState } from "react";
import { X } from "lucide-react";

const AddJobForm = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    vacancies: 1,
    skillsrequired: [""],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleArrayChange = (index, value) => {
    const newArray = [...formData.skillsrequired];
    newArray[index] = value;
    setFormData({ ...formData, skillsrequired: newArray });
  };

  const addArrayItem = () => {
    setFormData({ ...formData, skillsrequired: [...formData.skillsrequired, ""] });
  };

  const removeArrayItem = (index) => {
    const newArray = formData.skillsrequired.filter((_, i) => i !== index);
    setFormData({ ...formData, skillsrequired: newArray });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filter out empty items from arrays
    const cleanedData = {
      ...formData,
      skillsrequired: formData.skillsrequired.filter(item => item.trim() !== ""),
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
              Job Details
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#4b5563", marginBottom: "6px" }}>
                  Job Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Software Engineer"
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

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#4b5563", marginBottom: "6px" }}>
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Detailed job description..."
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px", marginBottom: "20px" }}>
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
                  placeholder="e.g., Mumbai, India or Remote"
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

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#4b5563", marginBottom: "6px" }}>
                  Vacancies *
                </label>
                <input
                  type="number"
                  name="vacancies"
                  value={formData.vacancies}
                  onChange={handleChange}
                  required
                  min="1"
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

            {/* Skills Required */}
            <div style={{ marginBottom: "30px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", marginBottom: "20px", paddingBottom: "10px", borderBottom: "1px solid #e2e8f0" }}>
                Skills Required
              </h3>
              {formData.skillsrequired.map((item, index) => (
                <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange(index, e.target.value)}
                    style={{
                      flex: "1",
                      padding: "10px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      fontSize: "14px",
                    }}
                    placeholder={`Skill ${index + 1}`}
                  />
                  {formData.skillsrequired.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index)}
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
                onClick={addArrayItem}
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