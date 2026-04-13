import { Bookmark, Trash2 } from 'lucide-react'
import { useState } from "react"
import { Link } from "react-router-dom"

const Card = (props) => {
  const [saved, setSaved] = useState(false);
  
  // Create a URL-friendly job ID - Fallback to post if title is absent during migration
  const titleString = props.title || props.post || '';
  const jobId = `${(props.company || 'company').toLowerCase()}-${titleString.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <div style={{
      background: props.isExpired ? "#f8fafc" : "white",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      border: "1px solid #e2e8f0",
      transition: "all 0.3s ease",
      position: "relative",
      opacity: props.isExpired ? 0.7 : 1,
      filter: props.isExpired ? "grayscale(80%)" : "none"
    }}>
      {/* EXPIRED BADGE */}
      {props.isExpired && (
        <div style={{
          position: "absolute",
          top: "15px",
          right: "15px",
          background: "#ef4444",
          color: "white",
          padding: "4px 12px",
          borderRadius: "8px",
          fontSize: "12px",
          fontWeight: "700",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          boxShadow: "0 2px 5px rgba(239, 68, 68, 0.3)",
          zIndex: 10
        }}>
          Expired
        </div>
      )}
      {/* TOP */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "15px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {props.brandLogo && (
            <img 
              src={props.brandLogo}
              alt={props.company}
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "10px",
                objectFit: "cover",
                background: "#f8fafc",
                padding: "8px",
              }}
            />
          )}
          <div>
            <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: "600", color: "#0f172a" }}>
              {props.company || props.location}
            </h3>
            {props.datePosted && (
              <p style={{ margin: "0", fontSize: "12px", color: "#64748b" }}>
                {props.datePosted}
              </p>
            )}
          </div>
        </div>
        
        <div style={{ display: "flex", gap: "8px" }}>
          {/* Delete Button - Only visible for HR */}
          {props.showDelete && !props.isExpired && (
            <button
              onClick={() => props.onDelete(props.id)}
              style={{
                background: "transparent",
                color: "#ef4444",
                border: "1px solid #fee2e2",
                borderRadius: "6px",
                padding: "6px 12px",
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#fee2e2";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <Trash2 size={14} />
              Delete
            </button>
          )}
          
          {/* Save Button */}
          {!props.isExpired && (
            <button
              onClick={() => setSaved(!saved)}
            style={{
              background: saved ? "rgb(20, 184, 166)" : "transparent",
              color: saved ? "white" : "#64748b",
              border: saved ? "none" : "1px solid #e2e8f0",
              borderRadius: "6px",
              padding: "6px 12px",
              fontSize: "13px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              transition: "all 0.3s ease",
            }}
          >
            <Bookmark size={14} fill={saved ? "white" : "none"} />
            {saved ? "Saved" : "Save"}
          </button>
          )}
        </div>
      </div>

      {/* JOB TITLE */}
      <h2 style={{
        margin: "0 0 12px 0",
        fontSize: "18px",
        fontWeight: "700",
        color: "#0f172a",
      }}>
        {titleString}
      </h2>

      {/* TAGS OR SKILLS */}
      <div style={{
        display: "flex",
        gap: "8px",
        marginBottom: "16px",
        flexWrap: "wrap",
      }}>
        {(props.skillsRequired || props.skills || []).slice(0, 3).map((skill, index) => (
          <span key={index} style={{
            background: "#e0f2fe",
            color: "#0369a1",
            padding: "4px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "500",
          }}>
            {skill}
          </span>
        ))}
        {props.vacancies && (
          <span style={{
            background: "#f1f5f9",
            color: "#475569",
            padding: "4px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "500",
          }}>
            Vacancies: {props.vacancies}
          </span>
        )}
      </div>

      {/* SALARY & LOCATION */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "16px",
        paddingBottom: "16px",
        borderBottom: "1px solid #f1f5f9",
      }}>
        <div>
          <p style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: "600", color: "#0f172a" }}>
            {props.salary || props.pay}
          </p>
          <p style={{ margin: "0", fontSize: "14px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
            📍 {props.location}
          </p>
        </div>
      </div>

      {/* VIEW DETAILS LINK */}
<<<<<<< HEAD:src/HR_panel/components/Card.jsx
      {!props.isExpired && (
        <div style={{ textAlign: "center" }}>
          <Link 
            to={`/job/${jobId}`}
            style={{
              fontSize: "13px",
              color: "rgb(20, 184, 166)",
              textDecoration: "none",
              fontWeight: "500",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = "underline";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = "none";
            }}
          >
            for more details →
          </Link>
        </div>
      )}
=======
      <div style={{ textAlign: "center" }}>
        <Link 
          to={`/hr/job/${jobId}`}
          style={{
            fontSize: "13px",
            color: "rgb(20, 184, 166)",
            textDecoration: "none",
            fontWeight: "500",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecoration = "underline";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = "none";
          }}
        >
          for more details →
        </Link>
      </div>
>>>>>>> e76d803 (Changed UI):recuritment_management_system/src/HR_panel/components/Card.jsx
    </div>
  )
}

export default Card