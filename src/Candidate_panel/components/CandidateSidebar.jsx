import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Calendar, 
  UserCircle 
} from "lucide-react";

const CandidateSidebar = () => {
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
    padding: "0 0 20px 0",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  };

  const brandTextStyle = {
    color: "white",
    fontSize: "24px",
    fontWeight: "700",
    margin: "0 0 0 15px",
    background: "linear-gradient(135deg, #14b8a6 0%, #0ea5e9 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };
  

  const menuItems = [
    { path: "/candidate", label: "Dashboard", icon: <LayoutDashboard size={22} /> },
    { path: "/candidate/jobs", label: "Browse Jobs", icon: <Briefcase size={22} /> },
    { path: "/candidate/applications", label: "My Applications", icon: <FileText size={22} /> },
    { path: "/candidate/interviews", label: "My Interviews", icon: <Calendar size={22} /> },
    { path: "/candidate/profile", label: "Profile", icon: <UserCircle size={22} /> },
  ];

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
    background: isActive 
      ? "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.1) 100%)" 
      : "transparent",
    border: isActive 
      ? "1px solid rgba(139, 92, 246, 0.3)" 
      : "1px solid transparent",
  });

  return (
    <div style={sidebarStyle}>
      {/* Brand/Logo */}
      <div style={brandStyle}>
        <div style={{ 
          width: "40px", 
          height: "40px", 
          borderRadius: "12px",
          background: "linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          fontWeight: "700",
          color: "white",
        }}>
          👤
        </div>
        <h2 style={brandTextStyle}>Candidate</h2>
      </div>

      {/* Navigation */}
      <nav>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => getLinkStyle(isActive)}
            end={item.path === "/candidate"}
          >
            <div style={{ color: "inherit" }}>{item.icon}</div>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default CandidateSidebar;