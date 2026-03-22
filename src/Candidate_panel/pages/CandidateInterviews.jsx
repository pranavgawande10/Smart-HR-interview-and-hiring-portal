const CandidateInterviews = () => {
  return (
    <div>
      <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>
        My Interviews
      </h1>
      <p >
        View and manage your scheduled interviews
      </p>
      
      <div style={{
        background: "white",
        borderRadius: "12px",
        padding: "40px",
        textAlign: "center",
        color: "#64748b",
        border: "1px solid #e2e8f0"
      }}>
        <p style={{ fontSize: "16px" }}>No interviews scheduled yet.</p>
        <p style={{ fontSize: "14px", marginTop: "8px" }}>Your upcoming interviews will appear here.</p>
      </div>
    </div>
  );
};

export default CandidateInterviews;