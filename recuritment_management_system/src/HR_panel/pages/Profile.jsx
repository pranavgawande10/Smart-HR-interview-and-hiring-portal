// Profile.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  Edit2,
  Save,
  X,
  Camera,
  Briefcase,
  Globe,
  Linkedin,
  Twitter,
  Github,
  Shield,
  Bell,
  Lock,
  LogOut,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import PageHeader from "../components/PageHeader";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [profile, setProfile] = useState({
    name: "Alex Morgan",
    email: "alex.morgan@techcorp.com",
    phone: "+91 98765 43210",
    position: "Senior HR Manager",
    department: "Human Resources",
    location: "Mumbai, India",
    joinDate: "2022-01-15",
    employeeId: "HR001",
    bio: "Experienced HR professional with 8+ years in talent acquisition and employee relations. Passionate about building great teams and fostering positive workplace culture.",
    avatar:
      "https://static.vecteezy.com/system/resources/thumbnails/022/014/184/small/user-icon-member-login-isolated-vector.jpg",

    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    preferences: {
      language: "English",
      timezone: "IST (UTC+5:30)",
      dateFormat: "DD/MM/YYYY",
    },
    availability: true,
    maxInterviews: 5,
  });

  const [formData, setFormData] = useState(profile);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  // Load profile from localStorage
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3000/profile/view", {
          withCredentials: true,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const d = res.data;
        const newProfile = {
          ...profile,
          name: d.name || profile.name,
          email: d.email || profile.email,
          position: d.role || profile.position,
          department: d.companyName || profile.department,
          avatar: d.profilePhoto || profile.avatar,
        };
        setProfile(newProfile);
        setFormData(newProfile);
      } catch (err) {
        console.error("Error fetching HR profile", err);
      }
    };
    fetchProfile();
  }, []);

  const saveProfile = async () => {
    try {
      await axios.patch("http://localhost:3000/profile/edit", formData, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProfile(formData);
      setIsEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update profile", err);
      alert(err.response?.data || "Failed to save profile");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type],
      },
    }));
  };

  const handlePreferenceChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, [field]: value },
    }));
  };

  const validatePassword = () => {
    const errors = {};
    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }
    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordChange = () => {
    if (validatePassword()) {
      // Here you would typically make an API call to change password
      console.log("Password changed:", passwordData);
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      alert("Password changed successfully!");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Success Message */}
      {showSuccess && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            background: "#10b981",
            color: "white",
            padding: "12px 20px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            zIndex: 1000,
            animation: "slideIn 0.3s ease",
          }}
        >
          <CheckCircle size={18} />
          Profile updated successfully!
        </div>
      )}

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px" }}
      >
        {/* Left Column - Profile Card */}
        <div style={{ position: "sticky", top: "24px" }}>
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              overflow: "hidden",
              textAlign: "center",
              padding: "24px",
            }}
          >
            {/* Avatar */}
            <div style={{ position: "relative", display: "inline-block" }}>
              <img
                src={formData.avatar}
                alt={formData.name}
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  border: "4px solid #0d9488",
                  objectFit: "cover",
                }}
              />
              {isEditing && (
                <button
                  style={{
                    position: "absolute",
                    bottom: "0",
                    right: "0",
                    background: "#0d9488",
                    border: "none",
                    borderRadius: "50%",
                    padding: "8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Camera size={16} color="white" />
                </button>
              )}
            </div>

            <h2
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#0f172a",
                margin: "16px 0 4px",
              }}
            >
              {formData.name}
            </h2>
            <p
              style={{
                color: "#0d9488",
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "16px",
              }}
            >
              {formData.position}
            </p>

            <div
              style={{
                borderTop: "1px solid #e2e8f0",
                paddingTop: "16px",
                marginTop: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "12px",
                  fontSize: "14px",
                  color: "#475569",
                }}
              >
                <Mail size={16} style={{ color: "#94a3b8" }} />
                <span>{formData.email}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "12px",
                  fontSize: "14px",
                  color: "#475569",
                }}
              >
                <Building size={16} style={{ color: "#94a3b8" }} />
                <span>{formData.department}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "12px",
                  fontSize: "14px",
                  color: "#475569",
                }}
              ></div>
            </div>

            {/* Social Links */}
            <div
              style={{
                borderTop: "1px solid #e2e8f0",
                paddingTop: "16px",
                marginTop: "16px",
              }}
            ></div>
          </div>
        </div>

        {/* Right Column - Edit Form */}
        <div>
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                Profile Information
              </h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    padding: "8px 16px",
                    background: "transparent",
                    border: "1px solid #0d9488",
                    borderRadius: "8px",
                    color: "#0d9488",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Edit2 size={14} />
                  Edit Profile
                </button>
              ) : (
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => {
                      setFormData(profile);
                      setIsEditing(false);
                    }}
                    style={{
                      padding: "8px 16px",
                      background: "transparent",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <X size={14} />
                    Cancel
                  </button>
                  <button
                    onClick={saveProfile}
                    style={{
                      padding: "8px 16px",
                      background:
                        "linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%)",
                      border: "none",
                      borderRadius: "8px",
                      color: "white",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Save size={14} />
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {/* Personal Information */}
            <div style={{ marginBottom: "24px" }}>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#0f172a",
                  marginBottom: "16px",
                  paddingBottom: "8px",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                Personal Information
              </h3>
              <div style={{ display: "grid", gap: "16px" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "#475569",
                      marginBottom: "4px",
                    }}
                  >
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        fontSize: "14px",
                      }}
                    />
                  ) : (
                    <p style={{ color: "#0f172a", fontSize: "14px" }}>
                      {profile.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "#475569",
                      marginBottom: "4px",
                    }}
                  >
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        fontSize: "14px",
                      }}
                    />
                  ) : (
                    <p style={{ color: "#0f172a", fontSize: "14px" }}>
                      {profile.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "#475569",
                      marginBottom: "4px",
                    }}
                  ></label>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div style={{ marginBottom: "24px" }}>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#0f172a",
                  marginBottom: "16px",
                  paddingBottom: "8px",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                Professional Information
              </h3>
              <div style={{ display: "grid", gap: "16px" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "#475569",
                      marginBottom: "4px",
                    }}
                  >
                    Department
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        fontSize: "14px",
                      }}
                    />
                  ) : (
                    <p style={{ color: "#0f172a", fontSize: "14px" }}>
                      {profile.position}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "#475569",
                      marginBottom: "4px",
                    }}
                  >
                    Company
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        fontSize: "14px",
                      }}
                    />
                  ) : (
                    <p style={{ color: "#0f172a", fontSize: "14px" }}>
                      {profile.department}
                    </p>
                  )}
                </div>

               

                {/* New Capacity Field */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "#475569",
                      marginBottom: "4px",
                    }}
                  >
                    Maximum Interview Capacity
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="maxInterviews"
                      min="1"
                      value={formData.maxInterviews}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        fontSize: "14px",
                      }}
                    />
                  ) : (
                    <p style={{ color: "#0f172a", fontSize: "14px" }}>
                      {profile.maxInterviews}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Availability Toggle */}
            <div
              style={{
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px",
                background: "#f8fafc",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: "15px",
                    fontWeight: "600",
                    color: "#0f172a",
                    margin: "0 0 4px 0",
                  }}
                >
                  Availability
                </h3>
                <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                  Set your current status for interviews
                </p>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: formData.availability ? "#059669" : "#dc2626",
                  }}
                >
                  {formData.availability ? "Available" : "Not Available"}
                </span>
                {isEditing && (
                  <label
                    style={{
                      position: "relative",
                      display: "inline-block",
                      width: "44px",
                      height: "24px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.availability}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          availability: e.target.checked,
                        }))
                      }
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
                        backgroundColor: formData.availability
                          ? "rgb(20, 184, 166)"
                          : "#cbd5e1",
                        transition: ".4s",
                        borderRadius: "24px",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          content: '""',
                          height: "18px",
                          width: "18px",
                          left: "3px",
                          bottom: "3px",
                          backgroundColor: "white",
                          transition: ".4s",
                          borderRadius: "50%",
                          transform: formData.availability
                            ? "translateX(20px)"
                            : "translateX(0)",
                        }}
                      ></span>
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* Notification Preferences */}
            <div style={{ marginBottom: "24px" }}>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#0f172a",
                  marginBottom: "16px",
                  paddingBottom: "8px",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                Notification Preferences
              </h3>
              <div style={{ display: "grid", gap: "12px" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.notifications.email}
                    onChange={() => handleNotificationChange("email")}
                    disabled={!isEditing}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  <span style={{ fontSize: "14px", color: "#475569" }}>
                    Email Notifications
                  </span>
                </label>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.notifications.push}
                    onChange={() => handleNotificationChange("push")}
                    disabled={!isEditing}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  <span style={{ fontSize: "14px", color: "#475569" }}>
                    Push Notifications
                  </span>
                </label>
              </div>
            </div>

           
              
            
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowPasswordModal(false)}
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              maxWidth: "400px",
              width: "90%",
              padding: "24px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "20px",
              }}
            >
              Change Password
            </h2>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "500",
                  marginBottom: "4px",
                }}
              >
                Current Password
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              {passwordErrors.currentPassword && (
                <p
                  style={{
                    color: "#ef4444",
                    fontSize: "12px",
                    marginTop: "4px",
                  }}
                >
                  {passwordErrors.currentPassword}
                </p>
              )}
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "500",
                  marginBottom: "4px",
                }}
              >
                New Password
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              {passwordErrors.newPassword && (
                <p
                  style={{
                    color: "#ef4444",
                    fontSize: "12px",
                    marginTop: "4px",
                  }}
                >
                  {passwordErrors.newPassword}
                </p>
              )}
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "500",
                  marginBottom: "4px",
                }}
              >
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              {passwordErrors.confirmPassword && (
                <p
                  style={{
                    color: "#ef4444",
                    fontSize: "12px",
                    marginTop: "4px",
                  }}
                >
                  {passwordErrors.confirmPassword}
                </p>
              )}
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setShowPasswordModal(false)}
                style={{
                  flex: 1,
                  padding: "10px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  background: "white",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                style={{
                  flex: 1,
                  padding: "10px",
                  background:
                    "linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
