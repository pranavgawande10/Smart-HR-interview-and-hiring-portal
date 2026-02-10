import { Bookmark } from 'lucide-react'
import { useState } from "react"

const Card = (props) => {
  const [saved, setSaved] = useState(false);
  
  return (
    <div style={{
      background: "white",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      border: "1px solid #e5e7eb",
      maxWidth: "350px",
      transition: "all 0.3s ease",
      margin: "10px",
    }}>
      {/* TOP */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "15px",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}>
          <img 
            src={props.brandLogo}
            alt={props.company}
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "10px",
              objectFit: "cover",
              backgroundColor: "#f8fafc",
              padding: "5px",
            }}
          />
          <div>
            <h3 style={{
              margin: "0",
              fontSize: "18px",
              fontWeight: "600",
              color: "#111827",
            }}>
              {props.company}
            </h3>
            <p style={{
              margin: "3px 0 0 0",
              fontSize: "12px",
              color: "#6b7280",
            }}>
              {props.datePosted}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setSaved(!saved)}
          style={{
            backgroundColor: saved ? "black" : "transparent",
            color: saved ? "white" : "#6b7280",
            border: "1px solid #d1d5db",
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
          <Bookmark size={14} />
          {saved ? "Saved" : "Save"}
        </button>
      </div>

      {/* CENTER */}
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{
          margin: "0 0 10px 0",
          fontSize: "20px",
          fontWeight: "700",
          color: "#111827",
        }}>
          {props.post}
        </h2>
        <div style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
        }}>
          <span style={{
            backgroundColor: "#e0f2fe",
            color: "#0369a1",
            padding: "4px 10px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "500",
          }}>
            {props.tag1}
          </span>
          <span style={{
            backgroundColor: "#f1f5f9",
            color: "#475569",
            padding: "4px 10px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "500",
          }}>
            {props.tag2}
          </span>
        </div>
      </div>

      {/* BOTTOM */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: "15px",
        borderTop: "1px solid #f3f4f6",
      }}>
        <div>
          <h2 style={{
            margin: "0 0 4px 0",
            fontSize: "16px",
            fontWeight: "700",
            color: "#111827",
          }}>
            {props.pay}
          </h2>
          <p style={{
            margin: "0",
            fontSize: "14px",
            color: "#6b7280",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}>
            📍 {props.location}
          </p>
        </div>
        <button style={{
          backgroundColor: "black",
          color: "white",
          border: "none",
          borderRadius: "8px",
          padding: "10px 20px",
          fontSize: "14px",
          fontWeight: "600",
          cursor: "pointer",
          transition: "background 0.4s ease",
          
        }}>
          Apply Now
        </button>
      </div>

      {/* View Details Link */}
      <div style={{
        textAlign: "center",
        marginTop: "15px",
        paddingTop: "10px",
        borderTop: "1px dashed #e5e7eb",
      }}>
        <a href="#" style={{
          fontSize: "13px",
          color: "#1e40af",
          textDecoration: "none",
        }}>
           for more details →
        </a>
      </div>
    </div>
  )
}

export default Card