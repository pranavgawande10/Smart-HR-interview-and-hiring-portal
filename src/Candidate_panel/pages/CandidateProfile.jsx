import { useState } from "react";
import { UserCircle, Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Edit2, Save, X, Upload } from "lucide-react";

const CandidateProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    location: "Mumbai, India",
    title: "Senior Frontend Developer",
    experience: "5 years",
    education: "B.Tech Computer Science",
    skills: ["React", "JavaScript", "TypeScript", "Node.js", "Tailwind CSS", "Redux"],
    bio: "Passionate frontend developer with 5 years of experience building responsive web applications. Looking for challenging roles in product-based companies.",
    resume: "John_Doe_Resume_2026.pdf",
  });

  const [editedProfile, setEditedProfile] = useState({ ...profile });

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const addSkill = () => {
    const newSkill = prompt("Enter new skill:");
    if (newSkill && !editedProfile.skills.includes(newSkill)) {
      setEditedProfile({ ...editedProfile, skills: [...editedProfile.skills, newSkill] });
    }
  };

  const removeSkill = (skillToRemove) => {
    setEditedProfile({ ...editedProfile, skills: editedProfile.skills.filter(s => s !== skillToRemove) });
  };

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
  };

  const sectionStyle = {
    background: "white",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0",
  };

  const SectionHeader = ({ icon: Icon, title }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
      <Icon size={20} color="rgb(20, 184, 166)" />
      <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", margin: 0 }}>{title}</h3>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>My Profile</h1>
          <p style={{ fontSize: "16px", color: "#64748b" }}>Manage your personal information and preferences</p>
        </div>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} style={{ ...buttonStyle, ...gradientStyle, color: "white" }}>
            <Edit2 size={16} style={{ marginRight: "8px", verticalAlign: "middle" }} />
            Edit Profile
          </button>
        ) : (
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={handleCancel} style={{ ...buttonStyle, background: "#f1f5f9", color: "#64748b" }}>
              <X size={16} style={{ marginRight: "8px", verticalAlign: "middle" }} />
              Cancel
            </button>
            <button onClick={handleSave} style={{ ...buttonStyle, ...gradientStyle, color: "white" }}>
              <Save size={16} style={{ marginRight: "8px", verticalAlign: "middle" }} />
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Two Column Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px" }}>
        
        {/* Left Column - Profile Card */}
        <div style={sectionStyle}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              ...gradientStyle,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px auto",
            }}>
              <span style={{ fontSize: "48px", color: "white" }}>👤</span>
            </div>
            
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>
              {isEditing ? editedProfile.name : profile.name}
            </h2>
            <p style={{ fontSize: "16px", color: "rgb(20, 184, 166)", fontWeight: "500", marginBottom: "16px" }}>
              {isEditing ? editedProfile.title : profile.title}
            </p>
            
            <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "20px", textAlign: "left" }}>
              <InfoRow icon={Mail} text={isEditing ? editedProfile.email : profile.email} />
              <InfoRow icon={Phone} text={isEditing ? editedProfile.phone : profile.phone} />
              <InfoRow icon={MapPin} text={isEditing ? editedProfile.location : profile.location} />
            </div>

            {/* Resume Section */}
            <div style={{ marginTop: "20px", padding: "16px", background: "#f8fafc", borderRadius: "12px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a", marginBottom: "12px" }}>Resume</h3>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ background: "#e2e8f0", padding: "8px", borderRadius: "8px" }}>📄</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: "500", fontSize: "13px", color: "#0f172a" }}>{profile.resume}</p>
                  <p style={{ fontSize: "11px", color: "#64748b" }}>Uploaded on Jan 15, 2026</p>
                </div>
                <button style={{ background: "transparent", border: `1px solid rgb(20, 184, 166)`, color: "rgb(20, 184, 166)", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}>
                  <Upload size={12} style={{ marginRight: "4px", verticalAlign: "middle" }} />
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Bio */}
          <div style={sectionStyle}>
            <SectionHeader icon={UserCircle} title="About Me" />
            {isEditing ? (
              <textarea
                value={editedProfile.bio}
                onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                rows="4"
                style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", fontFamily: "inherit", resize: "vertical" }}
              />
            ) : (
              <p style={{ color: "#475569", lineHeight: "1.6", fontSize: "14px" }}>{profile.bio}</p>
            )}
          </div>

          {/* Work Experience */}
          <div style={sectionStyle}>
            <SectionHeader icon={Briefcase} title="Work Experience" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "4px" }}>Years of Experience</p>
                <p style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a" }}>
                  {isEditing ? editedProfile.experience : profile.experience}
                </p>
              </div>
              <div>
                <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "4px" }}>Current Role</p>
                <p style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a" }}>
                  {isEditing ? editedProfile.title : profile.title}
                </p>
              </div>
            </div>
          </div>

          {/* Education */}
          <div style={sectionStyle}>
            <SectionHeader icon={GraduationCap} title="Education" />
            <p style={{ fontSize: "15px", color: "#334155" }}>{profile.education}</p>
          </div>

          {/* Skills */}
          <div style={sectionStyle}>
            <SectionHeader icon={Award} title="Skills" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {(isEditing ? editedProfile.skills : profile.skills).map((skill, idx) => (
                <span key={idx} style={{
                  background: "#e6f7f5",
                  color: "rgb(20, 184, 166)",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "500",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}>
                  {skill}
                  {isEditing && (
                    <button onClick={() => removeSkill(skill)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "14px" }}>×</button>
                  )}
                </span>
              ))}
              {isEditing && (
                <button onClick={addSkill} style={{
                  background: "transparent",
                  border: `1px dashed rgb(20, 184, 166)`,
                  color: "rgb(20, 184, 166)",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  cursor: "pointer",
                }}>
                  + Add Skill
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Component for Info Rows
const InfoRow = ({ icon: Icon, text }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
    <Icon size={16} color="#94a3b8" />
    <span style={{ fontSize: "14px", color: "#475569" }}>{text}</span>
  </div>
);

export default CandidateProfile;