import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Calendar, UserCircle, Briefcase } from "lucide-react";

const InterviewerSidebar = () => {
  const menuItems = [
    { path: "/interviewer", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/interviewer/applications", label: "Applications", icon: <Briefcase size={20} /> },
    { path: "/interviewer/interviews", label: "My Interviews", icon: <Calendar size={20} /> },
    { path: "/interviewer/profile", label: "Profile", icon: <UserCircle size={20} /> },
  ];

  const tealGradient = "linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%)";
  const tealGradientLight = "linear-gradient(135deg, rgba(20, 184, 166, 0.2) 0%, rgba(14, 165, 233, 0.1) 100%)";

  const sidebarStyle = {
    width: "280px",
    height: "100vh",
    background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
    color: "white",
    padding: "25px 20px",
    position: "fixed",
    left: "0",
    top: "0",
    overflow: "hidden",
    zIndex: "1000",
    boxShadow: "4px 0 20px rgba(0, 0, 0, 0.15)",
    borderRight: "1px solid rgba(255, 255, 255, 0.1)",
  };

  const brandStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "40px",
    paddingBottom: "20px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  };

  const logoStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    background: tealGradient,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "700",
    color: "white",
  };

  const brandTextStyle = {
    color: "white",
    fontSize: "24px",
    fontWeight: "700",
    margin: "0 0 0 15px",
    background: tealGradient,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  const getLinkStyle = (isActive) => ({
    display: "flex",
    alignItems: "center",
    padding: "14px 18px",
    margin: "6px 0",
    color: isActive ? "white" : "#cbd5e1",
    textDecoration: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: isActive ? "600" : "500",
    gap: "16px",
    transition: "all 0.3s ease",
    background: isActive ? tealGradientLight : "transparent",
    border: isActive ? `1px solid rgba(20, 184, 166, 0.3)` : "1px solid transparent",
  });

  const profileStyle = {
    position: "absolute",
    bottom: "30px",
    left: "20px",
    right: "20px",
    padding: "15px",
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const avatarStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: tealGradient,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    color: "white",
    fontSize: "16px",
  };

  return (
    <div style={sidebarStyle}>
      {/* Brand/Logo */}
      <div style={brandStyle}>
        <div style={logoStyle}>I</div>
        <h2 style={brandTextStyle}>Interviewer</h2>
      </div>

      {/* Navigation */}
      <nav style={{ marginTop: "10px" }}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => getLinkStyle(isActive)}
            end={item.path === "/interviewer"}
          >
            <div style={{ color: "inherit" }}>{item.icon}</div>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div style={profileStyle}>
        <div style={avatarStyle}>JD</div>
        <div style={{ flex: "1", minWidth: "0" }}>
          <p style={{ margin: "0", fontWeight: "600", fontSize: "14px", color: "white" }}>John Doe</p>
          <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#94a3b8" }}>Technical Interviewer</p>
        </div>
      </div>
    </div>
  );
};

export default InterviewerSidebar;