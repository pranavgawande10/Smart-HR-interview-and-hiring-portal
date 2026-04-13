// ApplyForm.jsx
import { useState } from "react";
import { X, Upload, FileText, Send, CheckCircle, User, Mail, Phone, AlertCircle, Briefcase } from "lucide-react";

const ApplyForm = ({ jobTitle, companyName, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
    resume: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Name must be at least 3 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else {
      const phoneDigits = formData.phone.replace(/\D/g, '');
      if (phoneDigits.length !== 10) {
        newErrors.phone = "Please enter a valid 10-digit phone number";
      }
    }

    // Cover Letter validation
    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter = "Cover letter is required";
    } else if (formData.coverLetter.trim().length < 50) {
      newErrors.coverLetter = "Cover letter should be at least 50 characters";
    }

    // Resume validation
    if (!formData.resume) {
      newErrors.resume = "Resume is required";
    } else if (formData.resume.type !== "application/pdf") {
      newErrors.resume = "Only PDF files are allowed";
    } else if (formData.resume.size > 5 * 1024 * 1024) {
      newErrors.resume = "File size should be less than 5MB";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, resume: file }));
      if (errors.resume) {
        setErrors(prev => ({ ...prev, resume: "" }));
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setFormData(prev => ({ ...prev, resume: file }));
      if (errors.resume) {
        setErrors(prev => ({ ...prev, resume: "" }));
      }
    } else {
      setErrors(prev => ({ ...prev, resume: "Only PDF files are allowed" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        console.log("Application submitted:", {
          jobTitle,
          companyName,
          ...formData
        });
        setIsSubmitting(false);
        setIsSubmitted(true);
        
        setTimeout(() => {
          onClose();
        }, 2500);
      }, 1500);
    }
  };

  if (isSubmitted) {
    return (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}>
        <div style={{
          backgroundColor: "white",
          borderRadius: "1rem",
          maxWidth: "28rem",
          width: "100%",
          padding: "2rem",
          textAlign: "center",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}>
          <div style={{
            width: "5rem",
            height: "5rem",
            backgroundColor: "#dcfce7",
            borderRadius: "9999px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
          }}>
            <CheckCircle style={{ width: "2.5rem", height: "2.5rem", color: "#16a34a" }} />
          </div>
          <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "0.75rem" }}>
            Application Submitted!
          </h3>
          <p style={{ color: "#4b5563", marginBottom: "0.5rem" }}>
            Thank you for applying to <strong style={{ color: "#0d9488" }}>{jobTitle}</strong>
            {companyName && ` at ${companyName}`}
          </p>
          <p style={{ color: "#6b7280", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
            We'll review your application and get back to you within 5-7 business days.
          </p>
          <button
            onClick={onClose}
            style={{
              width: "100%",
              padding: "0.75rem 1.5rem",
              background: "linear-gradient(135deg, #0d9488 0%, #3b82f6 100%)",
              color: "white",
              borderRadius: "0.75rem",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "1rem",
      overflowY: "auto",
    }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: "1rem",
        maxWidth: "56rem",
        width: "100%",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      }}>
        {/* Header */}
        <div style={{
          position: "sticky",
          top: 0,
          backgroundColor: "white",
          borderBottom: "1px solid #e5e7eb",
          padding: "1.25rem 1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10,
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
              <Briefcase style={{ width: "1.25rem", height: "1.25rem", color: "#0d9488" }} />
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#111827" }}>
                Apply for {jobTitle}
              </h2>
            </div>
            <p style={{ fontSize: "0.875rem", color: "#4b5563" }}>
              {companyName && (
                <>at <strong style={{ color: "#0d9488" }}>{companyName}</strong> • </>
              )}
              Please fill in your details to complete the application
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: "0.5rem",
              borderRadius: "0.5rem",
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <X style={{ width: "1.25rem", height: "1.25rem", color: "#6b7280" }} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Full Name */}
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: "#374151", marginBottom: "0.5rem" }}>
              Full Name <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <User style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", width: "1.25rem", height: "1.25rem", color: "#9ca3af" }} />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                style={{
                  width: "100%",
                  padding: "0.75rem 0.75rem 0.75rem 2.5rem",
                  border: `1px solid ${errors.fullName ? "#ef4444" : "#d1d5db"}`,
                  borderRadius: "0.75rem",
                  outline: "none",
                  fontSize: "0.875rem",
                }}
              />
            </div>
            {errors.fullName && (
              <p style={{ marginTop: "0.25rem", fontSize: "0.75rem", color: "#ef4444", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <AlertCircle style={{ width: "0.75rem", height: "0.75rem" }} />
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: "#374151", marginBottom: "0.5rem" }}>
              Email Address <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <Mail style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", width: "1.25rem", height: "1.25rem", color: "#9ca3af" }} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                style={{
                  width: "100%",
                  padding: "0.75rem 0.75rem 0.75rem 2.5rem",
                  border: `1px solid ${errors.email ? "#ef4444" : "#d1d5db"}`,
                  borderRadius: "0.75rem",
                  outline: "none",
                  fontSize: "0.875rem",
                }}
              />
            </div>
            {errors.email && (
              <p style={{ marginTop: "0.25rem", fontSize: "0.75rem", color: "#ef4444", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <AlertCircle style={{ width: "0.75rem", height: "0.75rem" }} />
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: "#374151", marginBottom: "0.5rem" }}>
              Phone Number <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <Phone style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", width: "1.25rem", height: "1.25rem", color: "#9ca3af" }} />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 12345 67890"
                style={{
                  width: "100%",
                  padding: "0.75rem 0.75rem 0.75rem 2.5rem",
                  border: `1px solid ${errors.phone ? "#ef4444" : "#d1d5db"}`,
                  borderRadius: "0.75rem",
                  outline: "none",
                  fontSize: "0.875rem",
                }}
              />
            </div>
            {errors.phone && (
              <p style={{ marginTop: "0.25rem", fontSize: "0.75rem", color: "#ef4444", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <AlertCircle style={{ width: "0.75rem", height: "0.75rem" }} />
                {errors.phone}
              </p>
            )}
          </div>

          {/* Cover Letter */}
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: "#374151", marginBottom: "0.5rem" }}>
              About You / Cover Letter <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <textarea
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              rows="6"
              placeholder="Tell us about yourself, your experience, skills, and why you're interested in this position..."
              style={{
                width: "100%",
                padding: "0.75rem",
                border: `1px solid ${errors.coverLetter ? "#ef4444" : "#d1d5db"}`,
                borderRadius: "0.75rem",
                outline: "none",
                fontSize: "0.875rem",
                resize: "vertical",
                fontFamily: "inherit",
              }}
            />
            {errors.coverLetter && (
              <p style={{ marginTop: "0.25rem", fontSize: "0.75rem", color: "#ef4444", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <AlertCircle style={{ width: "0.75rem", height: "0.75rem" }} />
                {errors.coverLetter}
              </p>
            )}
            <div style={{ marginTop: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem", color: "#6b7280" }}>
              <span>Minimum 50 characters</span>
              <span style={{ color: formData.coverLetter.length >= 50 ? "#16a34a" : "#9ca3af" }}>
                {formData.coverLetter.length}/50 characters
              </span>
            </div>
          </div>

          {/* Resume Upload */}
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: "#374151", marginBottom: "0.5rem" }}>
              Resume (PDF) <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              style={{
                position: "relative",
                border: `2px dashed ${dragActive ? "#0d9488" : errors.resume ? "#ef4444" : "#d1d5db"}`,
                borderRadius: "0.75rem",
                padding: "2rem",
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: dragActive ? "#f0fdf4" : errors.resume ? "#fef2f2" : "transparent",
                transition: "all 0.3s ease",
              }}
            >
              <input
                type="file"
                id="resume"
                accept=".pdf"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              
              {formData.resume ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
                  <FileText style={{ width: "3rem", height: "3rem", color: "#0d9488" }} />
                  <div style={{ textAlign: "left" }}>
                    <p style={{ fontSize: "0.875rem", fontWeight: "500", color: "#111827" }}>{formData.resume.name}</p>
                    <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                      {(formData.resume.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, resume: null }))}
                    style={{ padding: "0.25rem 0.75rem", fontSize: "0.875rem", color: "#dc2626", background: "transparent", border: "none", cursor: "pointer" }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <Upload style={{ width: "4rem", height: "4rem", color: "#9ca3af", margin: "0 auto 1rem" }} />
                  <p style={{ color: "#4b5563", marginBottom: "0.5rem" }}>
                    Drag and drop your resume here, or{" "}
                    <label htmlFor="resume" style={{ color: "#0d9488", cursor: "pointer", fontWeight: "500" }}>
                      browse
                    </label>
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>PDF only, max 5MB</p>
                </>
              )}
            </div>
            {errors.resume && (
              <p style={{ marginTop: "0.25rem", fontSize: "0.75rem", color: "#ef4444", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <AlertCircle style={{ width: "0.75rem", height: "0.75rem" }} />
                {errors.resume}
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div style={{ display: "flex", gap: "0.75rem", paddingTop: "1.5rem", borderTop: "1px solid #e5e7eb" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: "0.75rem",
                border: "2px solid #d1d5db",
                backgroundColor: "white",
                color: "#374151",
                fontWeight: "600",
                borderRadius: "0.75rem",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                flex: 1,
                padding: "0.75rem",
                background: "linear-gradient(135deg, #0d9488 0%, #3b82f6 100%)",
                color: "white",
                fontWeight: "600",
                borderRadius: "0.75rem",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                opacity: isSubmitting ? 0.5 : 1,
              }}
            >
              {isSubmitting ? (
                <>
                  <div style={{ width: "1.25rem", height: "1.25rem", border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                  Submitting...
                </>
              ) : (
                <>
                  <Send style={{ width: "1.25rem", height: "1.25rem" }} />
                  Submit Application
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyForm;