
import { useState } from "react";
import { UserCircle, Mail, Phone, MapPin, Briefcase, GraduationCap, Award } from "lucide-react";

const CandidateProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Sample candidate data
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

  return (
    <div>
      
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "30px" 
      }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>
            My Profile
          </h1>
          <p style={{ fontSize: "16px", color: "#64748b" }}>
            Manage your personal information and preferences
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          style={{
            background: isEditing ? "#14b8a6" : "#8b5cf6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "12px 24px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 2fr",
        gap: "30px",
      }}>
       
        <div style={{
          background: "white",
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          border: "1px solid #e2e8f0",
          textAlign: "center",
        }}>
          <div style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px auto",
          }}>
            <span style={{ fontSize: "48px", color: "white" }}>👤</span>
          </div>
          
          <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>
            {profile.name}
          </h2>
          <p style={{ fontSize: "16px", color: "#8b5cf6", fontWeight: "500", marginBottom: "16px" }}>
            {profile.title}
          </p>
          
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            textAlign: "left",
            marginTop: "20px",
            padding: "20px 0",
            borderTop: "1px solid #e2e8f0",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Mail size={18} color="#64748b" />
              <span style={{ color: "#334155" }}>{profile.email}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Phone size={18} color="#64748b" />
              <span style={{ color: "#334155" }}>{profile.phone}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <MapPin size={18} color="#64748b" />
              <span style={{ color: "#334155" }}>{profile.location}</span>
            </div>
          </div>

          
          <div style={{
            marginTop: "20px",
            padding: "20px",
            background: "#f8fafc",
            borderRadius: "12px",
          }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#0f172a", marginBottom: "12px" }}>
              Resume
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                background: "#e2e8f0",
                padding: "8px",
                borderRadius: "8px",
              }}>
                📄
              </div>
              <div style={{ flex: "1" }}>
                <p style={{ fontWeight: "500", color: "#0f172a" }}>{profile.resume}</p>
                <p style={{ fontSize: "12px", color: "#64748b" }}>Uploaded on Jan 15, 2026</p>
              </div>
              <button style={{
                background: "transparent",
                border: "1px solid #8b5cf6",
                color: "#8b5cf6",
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "12px",
                cursor: "pointer",
              }}>
                Update
              </button>
            </div>
          </div>
        </div>

       
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
        }}>
          
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "30px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            border: "1px solid #e2e8f0",
          }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", marginBottom: "16px" }}>
              About Me
            </h3>
            {isEditing ? (
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "15px",
                  minHeight: "100px",
                  fontFamily: "inherit",
                }}
              />
            ) : (
              <p style={{ color: "#334155", lineHeight: "1.6" }}>{profile.bio}</p>
            )}
          </div>

        
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "30px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            border: "1px solid #e2e8f0",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <Briefcase size={20} color="#8b5cf6" />
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a" }}>
                Work Experience
              </h3>
            </div>
            <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
              <div style={{ flex: "1" }}>
                <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "4px" }}>Years of Experience</p>
                <p style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a" }}>{profile.experience}</p>
              </div>
              <div style={{ flex: "1" }}>
                <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "4px" }}>Current Role</p>
                <p style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a" }}>{profile.title}</p>
              </div>
            </div>
          </div>

         
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "30px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            border: "1px solid #e2e8f0",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <GraduationCap size={20} color="#8b5cf6" />
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a" }}>
                Education
              </h3>
            </div>
            <p style={{ fontSize: "16px", color: "#334155" }}>{profile.education}</p>
          </div>

          
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "30px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            border: "1px solid #e2e8f0",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <Award size={20} color="#8b5cf6" />
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a" }}>
                Skills
              </h3>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  style={{
                    background: "#f3e8ff",
                    color: "#8b5cf6",
                    padding: "8px 16px",
                    borderRadius: "20px",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  {skill}
                </span>
              ))}
              {isEditing && (
                <button style={{
                  background: "transparent",
                  border: "1px dashed #8b5cf6",
                  color: "#8b5cf6",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontSize: "14px",
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

export default CandidateProfile; 

