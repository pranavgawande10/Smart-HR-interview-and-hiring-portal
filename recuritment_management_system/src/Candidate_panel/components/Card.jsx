// Card.jsx
import { Bookmark, Trash2 } from 'lucide-react';
import { useState } from "react";
import { Link } from "react-router-dom";
import ApplyForm from '../pages/ApplyForm';

const Card = (props) => {
  const [saved, setSaved] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Create a URL-friendly job ID
  const jobId = `${props.company.toLowerCase()}-${props.post.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <>
      <div style={{
        background: "white",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        border: "1px solid #e2e8f0",
        transition: "all 0.3s ease",
        position: "relative",
      }}>
        {/* TOP */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "15px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
            <div>
              <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: "600", color: "#0f172a" }}>
                {props.company}
              </h3>
              <p style={{ margin: "0", fontSize: "12px", color: "#64748b" }}>
                {props.datePosted}
              </p>
            </div>
          </div>
          
          <div style={{ display: "flex", gap: "8px" }}>
            {/* Delete Button - Only visible for HR */}
            {props.showDelete && (
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
          </div>
        </div>

        {/* JOB TITLE */}
        <h2 style={{
          margin: "0 0 12px 0",
          fontSize: "18px",
          fontWeight: "700",
          color: "#0f172a",
        }}>
          {props.post}
        </h2>

        {/* TAGS */}
        <div style={{
          display: "flex",
          gap: "8px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}>
          <span style={{
            background: "#e0f2fe",
            color: "#0369a1",
            padding: "4px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "500",
          }}>
            {props.tag1}
          </span>
          <span style={{
            background: "#f1f5f9",
            color: "#475569",
            padding: "4px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "500",
          }}>
            {props.tag2}
          </span>
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
              ₹{props.pay}
            </p>
            <p style={{ margin: "0", fontSize: "14px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
              📍 {props.location}
            </p>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            style={{
              background: "linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Apply Now
          </button>
        </div>

        {/* VIEW DETAILS LINK */}
        <div style={{ textAlign: "center" }}>
          <Link 
          to={`/candidate/job/${jobId}`}
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
      </div>

      {/* Apply Form Modal */}
      {showForm && (
        <ApplyForm
          jobTitle={props.post}
          companyName={props.company}
          onClose={() => setShowForm(false)}
        />
      )}
    </>
  );
}

export default Card;