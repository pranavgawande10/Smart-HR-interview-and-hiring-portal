import { useState, useEffect } from "react";
import {
  Mail,
  Briefcase,
  Edit2,
  Save,
  X,
  Activity,
  Building,
} from "lucide-react";
import axios from "axios";

const InterviewerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    companyName: "",
    designation: "Technical Interviewer",
    experience: "N/A",
    bio: "",
    skills: [],
    isAvailable: true,
    maxCapacity: 5,
    capacityType: "day",
  });

  const [editedProfile, setEditedProfile] = useState({ ...profile });
  const [currentLoad, setCurrentLoad] = useState(0);

  const gradientStyle = {
    background:
      "linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%)",
  };

  const buttonStyle = {
    padding: "10px 20px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    border: "none",
    transition: "all 0.3s ease",
  };

  const sectionStyle = {
    background: "white",
    borderRadius: "12px",
    padding: "24px",
    border: "1px solid #e2e8f0",
  };

  const getAxiosConfig = () => ({
    withCredentials: true,
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchProfileInfo = async () => {
    try {
      // 1. Fetch Profile Info
      const res = await axios.get(
        "http://localhost:3001/api/v1/interviewer/profile",
        getAxiosConfig(),
      );
      const p = res.data.profile;
      const formatted = {
        name: p?.name || "Interviewer",
        email: p?.email || "",
        companyName: p?.companyName || "",
        designation: "Technical Interviewer",
        experience: p?.experienceYears ? `${p.experienceYears} years` : "N/A",
        bio: p?.bio || "Interviewer Bio.",
        skills: p?.skills || [],
        isAvailable: p?.availabilityStatus === "AVAILABLE",
        maxCapacity: p?.maxCapacity || 5,
        capacityType: "day",
      };
      setProfile(formatted);
      setEditedProfile(formatted);

      // 2. Calculate Active Load
      const intsRes = await axios.get(
        "http://localhost:3001/api/v1/interviewer/my-interviews",
        getAxiosConfig(),
      );
      const scheduledCount = (intsRes.data.interviews || []).filter(
        (i) => i.status === "SCHEDULED",
      ).length;
      setCurrentLoad(scheduledCount);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  const handleSave = async () => {
    try {
      const profileChanged =
        editedProfile.name !== profile.name ||
        editedProfile.email !== profile.email ||
        editedProfile.companyName !== profile.companyName;

      if (profileChanged) {
        await axios.patch(
          "http://localhost:3001/api/v1/interviewer/profile",
          {
            name: editedProfile.name,
            email: editedProfile.email,
            companyName: editedProfile.companyName,
          },
          getAxiosConfig(),
        );
      }

      if (editedProfile.isAvailable !== profile.isAvailable) {
        await axios.patch(
          "http://localhost:3001/api/v1/interviewer/availability",
          {
            availabilityStatus: editedProfile.isAvailable
              ? "AVAILABLE"
              : "UNAVAILABLE",
          },
          getAxiosConfig(),
        );
      }
      // Update capacity
      if (editedProfile.maxCapacity !== profile.maxCapacity) {
        await axios.patch(
          "http://localhost:3001/api/v1/interviewer/capacity",
          {
            maxCapacity: Number(editedProfile.maxCapacity),
          },
          getAxiosConfig(),
        );
      }

      // Update skills (if we simply assume they might have changed)
      const currentSkills = JSON.stringify(profile.skills);
      const newSkills = JSON.stringify(editedProfile.skills);
      if (currentSkills !== newSkills) {
        await axios.patch(
          "http://localhost:3001/api/v1/interviewer/skills",
          {
            skills: editedProfile.skills,
          },
          getAxiosConfig(),
        );
      }

      setProfile(editedProfile);
      if (editedProfile.name) {
        localStorage.setItem("userName", editedProfile.name);
      }
      setIsEditing(false);
      await fetchProfileInfo();
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to update profile",
      );
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedProfile({
      ...editedProfile,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const addSkill = () => {
    const newSkill = prompt("Enter new skill:");
    if (newSkill && !editedProfile.skills.includes(newSkill)) {
      setEditedProfile({
        ...editedProfile,
        skills: [...editedProfile.skills, newSkill],
      });
    }
  };

  const removeSkill = (skillToRemove) => {
    setEditedProfile({
      ...editedProfile,
      skills: editedProfile.skills.filter((s) => s !== skillToRemove),
    });
  };

  const loadPercentage = Math.min(
    (currentLoad / profile.maxCapacity) * 100,
    100,
  );

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "24px",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: "30px",
          padding: "25px",
          ...gradientStyle,
          borderRadius: "16px",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 10px 30px rgba(20, 184, 166, 0.2)",
        }}
      >
        <div>
          <h1
            style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px" }}
          >
            My Profile
          </h1>
          <p style={{ fontSize: "16px", opacity: "0.9", margin: "0" }}>
            Manage your technical expertise and interview bandwidth
          </p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            style={{
              ...buttonStyle,
              background: "white",
              color: "rgb(20, 184, 166)",
            }}
          >
            <Edit2 size={16} /> Edit Profile
          </button>
        ) : (
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleCancel}
              style={{
                ...buttonStyle,
                background: "#f1f5f9",
                color: "#64748b",
              }}
            >
              <X size={16} /> Cancel
            </button>
            <button
              onClick={handleSave}
              style={{
                ...buttonStyle,
                ...gradientStyle,
                color: "white",
                border: "1px solid white",
              }}
            >
              <Save size={16} /> Save
            </button>
          </div>
        )}
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px" }}
      >
        {/* Left Column */}
        <div style={{ ...sectionStyle, textAlign: "center" }}>
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              ...gradientStyle,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px auto",
              fontSize: "48px",
              color: "white",
              fontWeight: "700",
            }}
          >
            {(isEditing ? editedProfile.name : profile.name).charAt(0) || "I"}
          </div>

          {isEditing ? (
            <input
              type="text"
              name="name"
              value={editedProfile.name}
              onChange={handleInputChange}
              placeholder="Full Name"
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "12px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "14px",
                textAlign: "center",
                fontWeight: "600",
              }}
            />
          ) : (
            <h2
              style={{
                fontSize: "22px",
                fontWeight: "700",
                marginBottom: "8px",
                color: "#0f172a",
              }}
            >
              {profile.name}
            </h2>
          )}
          <p
            style={{
              color: "rgb(20, 184, 166)",
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "20px",
            }}
          >
            {profile.designation}
          </p>

          <div
            style={{
              borderTop: "1px solid #e2e8f0",
              paddingTop: "20px",
              textAlign: "left",
            }}
          >
            <div style={{ marginBottom: "15px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "6px",
                  color: "#64748b",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                <Mail size={14} color="#94a3b8" /> Email
              </div>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={editedProfile.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "14px",
                    color: "#0f172a",
                  }}
                />
              ) : (
                <p style={{ color: "#475569", fontSize: "14px", margin: 0 }}>
                  {profile.email}
                </p>
              )}
            </div>

            <div style={{ marginBottom: "15px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "6px",
                  color: "#64748b",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                <Building size={14} color="#94a3b8" /> Company
              </div>
              {isEditing ? (
                <input
                  type="text"
                  name="companyName"
                  value={editedProfile.companyName}
                  onChange={handleInputChange}
                  placeholder="Company Name"
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "14px",
                    color: "#0f172a",
                  }}
                />
              ) : (
                <p style={{ color: "#475569", fontSize: "14px", margin: 0 }}>
                  {profile.companyName || "Not specified"}
                </p>
              )}
            </div>

           
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Availability & Capacity Mapping */}
          <div style={sectionStyle}>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "700",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#0f172a",
              }}
            >
              <Activity size={20} color="#0d9488" /> Workload & Availability
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                marginBottom: "25px",
              }}
            >
              <div
                style={{
                  background: "#f8fafc",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <p
                  style={{
                    margin: "0 0 10px 0",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#475569",
                  }}
                >
                  Status
                </p>
                {isEditing ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          width: "40px",
                          height: "24px",
                        }}
                      >
                        <input
                          type="checkbox"
                          name="isAvailable"
                          checked={editedProfile.isAvailable}
                          onChange={handleInputChange}
                          style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span
                          style={{
                            position: "absolute",
                            cursor: "pointer",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: editedProfile.isAvailable
                              ? "#10b981"
                              : "#cbd5e1",
                            transition: ".4s",
                            borderRadius: "24px",
                          }}
                        ></span>
                        <span
                          style={{
                            position: "absolute",
                            height: "18px",
                            width: "18px",
                            left: editedProfile.isAvailable ? "19px" : "3px",
                            bottom: "3px",
                            backgroundColor: "white",
                            transition: ".4s",
                            borderRadius: "50%",
                          }}
                        ></span>
                      </div>
                    </label>
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: editedProfile.isAvailable
                          ? "#10b981"
                          : "#64748b",
                      }}
                    >
                      {editedProfile.isAvailable
                        ? "Available"
                        : "Not Available"}
                    </span>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "inline-flex",
                      background: profile.isAvailable ? "#dcfce7" : "#f1f5f9",
                      color: profile.isAvailable ? "#166534" : "#475569",
                      padding: "6px 14px",
                      borderRadius: "20px",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    {profile.isAvailable ? "Available" : "Not Available"}
                  </div>
                )}
              </div>

              <div
                style={{
                  background: "#f8fafc",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <p
                  style={{
                    margin: "0 0 10px 0",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#475569",
                  }}
                >
                  Max Capacity
                </p>
                {isEditing ? (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="number"
                      name="maxCapacity"
                      value={editedProfile.maxCapacity}
                      onChange={handleInputChange}
                      style={{
                        width: "80px",
                        padding: "8px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "14px",
                      }}
                    />
                    <select
                      name="capacityType"
                      value={editedProfile.capacityType}
                      onChange={handleInputChange}
                      style={{
                        padding: "8px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "14px",
                        background: "white",
                      }}
                    >
                      <option value="day">per day</option>
                      <option value="week">per week</option>
                    </select>
                  </div>
                ) : (
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#0f172a",
                    }}
                  >
                    {profile.maxCapacity}{" "}
                    <span
                      style={{
                        fontSize: "14px",
                        color: "#64748b",
                        fontWeight: "500",
                      }}
                    >
                      interviews per {profile.capacityType}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar Load */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#334155",
                  }}
                >
                  Current Load
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "700",
                    color: loadPercentage >= 100 ? "#ef4444" : "#0d9488",
                  }}
                >
                  {currentLoad} / {profile.maxCapacity} scheduled
                </span>
              </div>
              <div
                style={{
                  width: "100%",
                  background: "#e2e8f0",
                  borderRadius: "10px",
                  height: "12px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    background:
                      loadPercentage >= 100
                        ? "#ef4444"
                        : loadPercentage >= 80
                          ? "#f59e0b"
                          : "#10b981",
                    width: `${loadPercentage}%`,
                    transition: "width 0.5s ease",
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Technical Skills */}
          <div style={sectionStyle}>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "700",
                marginBottom: "15px",
                color: "#0f172a",
              }}
            >
              Technical Skills
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {(isEditing ? editedProfile.skills : profile.skills).map(
                (skill, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: "#e6f7f5",
                      color: "rgb(15, 118, 110)",
                      padding: "6px 14px",
                      borderRadius: "20px",
                      fontSize: "13px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => removeSkill(skill)}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          color: "#0d9488",
                          fontSize: "16px",
                          lineHeight: "1",
                        }}
                      >
                        ×
                      </button>
                    )}
                  </span>
                ),
              )}
              {isEditing && (
                <button
                  onClick={addSkill}
                  style={{
                    background: "transparent",
                    border: "1px dashed rgb(20, 184, 166)",
                    color: "rgb(20, 184, 166)",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  + Add Skill
                </button>
              )}
            </div>
          </div>

          {/* About */}
          <div style={sectionStyle}>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "700",
                marginBottom: "15px",
                color: "#0f172a",
              }}
            >
              About Me
            </h3>
            {isEditing ? (
              <textarea
                name="bio"
                value={editedProfile.bio}
                onChange={handleInputChange}
                rows="4"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  resize: "vertical",
                  fontSize: "14px",
                  fontFamily: "inherit",
                }}
              />
            ) : (
              <p
                style={{
                  color: "#475569",
                  lineHeight: "1.6",
                  fontSize: "14px",
                  margin: 0,
                }}
              >
                {profile.bio}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewerProfile;
