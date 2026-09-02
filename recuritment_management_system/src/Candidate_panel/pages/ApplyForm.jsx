// ApplyForm.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  FileText,
  Send,
  CheckCircle,
  User,
  Mail,
  Phone,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import axios from "axios";

const ApplyForm = ({ jobId, jobTitle, companyName, onClose }) => {
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

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Name must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else {
      const phoneDigits = formData.phone.replace(/\D/g, "");
      if (phoneDigits.length !== 10) {
        newErrors.phone = "Please enter a valid 10-digit phone number";
      }
    }

    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter = "Cover letter is required";
    } else if (formData.coverLetter.trim().length < 50) {
      newErrors.coverLetter = "Cover letter should be at least 50 characters";
    }

    if (!formData.resume) {
      newErrors.resume = "Resume is required";
    } else {
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];

      if (!allowedTypes.includes(formData.resume.type)) {
        newErrors.resume =
          "Only PDF, JPG, JPEG, PNG and WEBP files are allowed";
      } else if (formData.resume.size > 5 * 1024 * 1024) {
        newErrors.resume = "File size should be less than 5MB";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        resume: "Only PDF, JPG, JPEG, PNG, and WEBP files are allowed",
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        resume: "File size must be less than 5 MB",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, resume: file }));
    setErrors((prev) => ({ ...prev, resume: "" }));
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
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (file && allowedTypes.includes(file.type)) {
      setFormData((prev) => ({ ...prev, resume: file }));
      setErrors((prev) => ({ ...prev, resume: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        resume: "Only PDF, JPG, JPEG, PNG, and WEBP files are allowed",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("coverLetter", formData.coverLetter);
      formDataToSend.append("resume", formData.resume);

      try {
        await axios.post(
          `http://localhost:3001/api/v1/application/apply/${jobId}`,
          formDataToSend,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        setIsSubmitted(true);
        setTimeout(() => onClose(), 2500);
      } catch (err) {
        console.error("Apply error:", err);
        alert(err.response?.data?.message || "Error submitting application");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[1000] flex items-center justify-center p-4 overflow-y-auto">
        {isSubmitted ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card rounded-2xl max-w-md w-full p-8 text-center border border-slate-700/50 shadow-2xl relative bg-slate-800"
          >
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 outfit-font">
              Application Submitted!
            </h3>
            <p className="text-slate-300 mb-2">
              Thank you for applying to{" "}
              <strong className="text-indigo-400 font-semibold">{jobTitle}</strong>
              {companyName && ` at ${companyName}`}
            </p>
            <p className="text-slate-400 text-sm mb-6">
              We'll review your application and get back to you within 5-7 business days.
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white rounded-xl font-semibold shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] transition-all transform hover:-translate-y-1"
            >
              Close
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="glass-card rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar border border-slate-700/50 shadow-2xl bg-slate-800"
          >
            {/* Header */}
            <div className="sticky top-0 bg-slate-800/90 backdrop-blur-md border-b border-slate-700/50 p-6 flex justify-between items-center z-10 rounded-t-2xl">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Briefcase className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-xl font-bold text-white outfit-font">
                    Apply for {jobTitle}
                  </h2>
                </div>
                <p className="text-sm text-slate-400">
                  {companyName && (
                    <>
                      at <strong className="text-indigo-400">{companyName}</strong> •{" "}
                    </>
                  )}
                  Please fill in your details to complete the application
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`w-full pl-10 pr-4 py-3 bg-slate-900/50 border ${errors.fullName ? "border-rose-500" : "border-slate-600"} rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`w-full pl-10 pr-4 py-3 bg-slate-900/50 border ${errors.email ? "border-rose-500" : "border-slate-600"} rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 12345 67890"
                    className={`w-full pl-10 pr-4 py-3 bg-slate-900/50 border ${errors.phone ? "border-rose-500" : "border-slate-600"} rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.phone}
                  </p>
                )}
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  About You / Cover Letter <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Tell us about yourself, your experience, skills, and why you're interested in this position..."
                  className={`w-full p-4 bg-slate-900/50 border ${errors.coverLetter ? "border-rose-500" : "border-slate-600"} rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-y custom-scrollbar`}
                />
                {errors.coverLetter && (
                  <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.coverLetter}
                  </p>
                )}
                <div className="mt-2 flex justify-between items-center text-xs text-slate-400">
                  <span>Minimum 50 characters</span>
                  <span className={formData.coverLetter.length >= 50 ? "text-emerald-400" : "text-slate-500"}>
                    {formData.coverLetter.length}/50 characters
                  </span>
                </div>
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Resume (PDF) <span className="text-rose-500">*</span>
                </label>
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    dragActive
                      ? "border-indigo-400 bg-indigo-500/10"
                      : errors.resume
                      ? "border-rose-500 bg-rose-500/10"
                      : "border-slate-600 hover:border-indigo-500 hover:bg-slate-800/50 bg-slate-900/30"
                  }`}
                >
                  <input
                    type="file"
                    id="resume"
                    accept="application/pdf,image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {formData.resume ? (
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                      <FileText className="w-12 h-12 text-indigo-400" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-white truncate max-w-[200px]">
                          {formData.resume.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {(formData.resume.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData((prev) => ({ ...prev, resume: null }));
                        }}
                        className="px-3 py-1 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-300 mb-2">
                        Drag and drop your resume here, or{" "}
                        <label
                          htmlFor="resume"
                          className="text-indigo-400 font-semibold cursor-pointer hover:text-indigo-300 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          browse
                        </label>
                      </p>
                      <p className="text-xs text-slate-500">
                        PDF, JPG, PNG up to 5MB
                      </p>
                    </>
                  )}
                </div>
                {errors.resume && (
                  <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.resume}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-700/50 mt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white rounded-xl font-bold text-lg shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" /> Submit Application
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};

export default ApplyForm;
