import { useState, useEffect } from "react";
import { UserCircle, Mail, Phone, MapPin, Briefcase, Edit2, Save, X } from "lucide-react";
import axios from "axios";

const CandidateProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Loading...",
    email: "Loading...",
    phone: "Loading...",
    location: "Not Provided",
    title: "Candidate",
    experience: "Not Provided",
  });

  const [editedProfile, setEditedProfile] = useState({ ...profile });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3001/api/v1/candidates/current-user",
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );

        const user = res.data.message || res.data.data || res.data.user || res.data;

        const newProfile = {
          name: user.name || "Unknown",
          email: user.email || "",
          phone: user.phone || "Not Provided",
          location: user.location || "Not Provided",
          title: user.title || "Candidate",
          experience: user.experience || "Not Provided",
        };

        setProfile(newProfile);
        setEditedProfile(newProfile);
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    // Logic for API PUT request would go here
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  // Styles
  const gradientStyle = {
    background: "linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%)",
  };

  const buttonStyle = {
    padding: "10px 20px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: "none",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  };

  const sectionStyle = {
    background: "white",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0",
    height: "fit-content"
  };

  const inputStyle = {
    width: "100%",
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    marginTop: "4px"
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      {/* Header */}
      <div style={{ 
        display: "flex", 
        flexDirection: window.innerWidth < 640 ? "column" : "row",
        justifyContent: "space-between", 
        alignItems: window.innerWidth < 640 ? "flex-start" : "center", 
        gap: "20px",
        marginBottom: "30px" 
      }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", margin: 0 }}>My Profile</h1>
          <p style={{ fontSize: "16px", color: "#64748b" }}>Manage your account details</p>
        </div>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} style={{ ...buttonStyle, ...gradientStyle, color: "white" }}>
            <Edit2 size={16} /> Edit Profile
          </button>
        ) : (
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={handleCancel} style={{ ...buttonStyle, background: "#f1f5f9", color: "#64748b" }}>
              <X size={16} /> Cancel
            </button>
            <button onClick={handleSave} style={{ ...buttonStyle, ...gradientStyle, color: "white" }}>
              <Save size={16} /> Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
        gap: "24px" 
      }}>
        
        {/* Left Column - Contact Info */}
        <div style={sectionStyle}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              ...gradientStyle,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 15px auto",
              fontSize: "40px"
            }}>👤</div>
            
            {isEditing ? (
              <div style={{ textAlign: "left" }}>
                <label style={{ fontSize: "12px", fontWeight: "600" }}>Full Name</label>
                <input 
                  style={inputStyle}
                  value={editedProfile.name} 
                  onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                />
              </div>
            ) : (
              <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: 0 }}>{profile.name}</h2>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", borderTop: "1px solid #f1f5f9", paddingTop: "20px" }}>
            <EditableRow 
              isEditing={isEditing} 
              icon={Mail} 
              label="Email Address"
              value={isEditing ? editedProfile.email : profile.email}
              onChange={(val) => setEditedProfile({...editedProfile, email: val})}
            />
            <EditableRow 
              isEditing={isEditing} 
              icon={Phone} 
              label="Phone Number"
              value={isEditing ? editedProfile.phone : profile.phone}
              onChange={(val) => setEditedProfile({...editedProfile, phone: val})}
            />
            <EditableRow 
              isEditing={isEditing} 
              icon={MapPin} 
              label="Location"
              value={isEditing ? editedProfile.location : profile.location}
              onChange={(val) => setEditedProfile({...editedProfile, location: val})}
            />
          </div>
        </div>

        {/* Right Column - Work Details */}
        <div style={sectionStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <Briefcase size={20} color="rgb(20, 184, 166)" />
            <h3 style={{ fontSize: "18px", fontWeight: "600", margin: 0 }}>Professional Details</h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "4px" }}>Job Title / Role</p>
              {isEditing ? (
                <input 
                  style={inputStyle}
                  value={editedProfile.title} 
                  onChange={(e) => setEditedProfile({...editedProfile, title: e.target.value})}
                />
              ) : (
                <p style={{ fontSize: "16px", fontWeight: "600", color: "#0f172a" }}>{profile.title}</p>
              )}
            </div>

            <div>
              <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "4px" }}>Years of Experience</p>
              {isEditing ? (
                <input 
                  style={inputStyle}
                  value={editedProfile.experience} 
                  onChange={(e) => setEditedProfile({...editedProfile, experience: e.target.value})}
                />
              ) : (
                <p style={{ fontSize: "16px", fontWeight: "600", color: "#0f172a" }}>{profile.experience}</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// Sub-component for clean rows
const EditableRow = ({ isEditing, icon: Icon, label, value, onChange }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
    <Icon size={18} color="#94a3b8" style={{ marginTop: isEditing ? "25px" : "2px" }} />
    <div style={{ flex: 1 }}>
      {isEditing ? (
        <>
          <label style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>{label}</label>
          <input 
            style={{ 
              width: "100%", 
              padding: "6px 10px", 
              borderRadius: "6px", 
              border: "1px solid #cbd5e1",
              fontSize: "14px"
            }} 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
          />
        </>
      ) : (
        <span style={{ fontSize: "14px", color: "#475569", wordBreak: "break-all" }}>{value}</span>
      )}
    </div>
  </div>
);

export default CandidateProfile;