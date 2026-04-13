import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Calendar,
  UserCircle,
  LogOut,
} from "lucide-react";

const NAVBAR_OFFSET_PX = 0;

const Sidebar = ({ isMobile = false, mobileOpen = false, onMobileRequestClose }) => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "HR Manager";
  const userRole = localStorage.getItem("role") || "HR";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    navigate("/");
  };

  // Sidebar container style
  const sidebarStyle = {
    width: "280px",
    height: `calc(100vh - ${NAVBAR_OFFSET_PX}px)`,
    background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
    color: "white",
    padding: "25px 20px",
    position: "fixed",
    left: "0",
    top: `${NAVBAR_OFFSET_PX}px`,
    overflow: "hidden",
    zIndex: "1000",
    boxShadow: "4px 0 20px rgba(0, 0, 0, 0.15)",
    borderRight: "1px solid rgba(255, 255, 255, 0.1)",
    transform: isMobile ? (mobileOpen ? "translateX(0)" : "translateX(-105%)") : "translateX(0)",
    transition: "transform 0.25s ease",
  };

  // Brand/logo section
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

  // Menu items with Lucide React icons
  const menuItems = [
    { path: "/hr", label: "Dashboard", icon: <LayoutDashboard size={22} /> },
    { path: "/hr/jobs", label: "Job Postings", icon: <Briefcase size={22} /> },
    { path: "/hr/applicants", label: "Applicants", icon: <Users size={22} /> },
    { path: "/hr/interviews", label: "Interviews", icon: <Calendar size={22} /> },
    { path: "/hr/profile", label: "Profile", icon: <UserCircle size={22} /> },
  ];

  // Link base style
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
      ? "linear-gradient(135deg, rgba(20, 184, 166, 0.2) 0%, rgba(20, 184, 166, 0.1) 100%)" 
      : "transparent",
    border: isActive 
      ? "1px solid rgba(20, 184, 166, 0.3)" 
      : "1px solid transparent",
    position: "relative",
    overflow: "hidden",
  });

  // Hover effect for links
  const handleMouseEnter = (e, isActive) => {
    if (!isActive) {
      e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
      e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.1)";
    }
  };

  const handleMouseLeave = (e, isActive) => {
    if (!isActive) {
      e.currentTarget.style.background = "transparent";
      e.currentTarget.style.border = "1px solid transparent";
    }
  };

  return (
    <div style={sidebarStyle}>
      {/* Brand/Logo */}
      <div style={brandStyle}>
        <div style={{ 
          width: "40px", 
          height: "40px", 
          borderRadius: "12px",
          background: "linear-gradient(135deg, #65d1c4 0%, #0ea5e9 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          fontWeight: "700",
          color: "white",
        }}>
          HR
        </div>
        <h2 style={brandTextStyle}>SmartHR</h2>
      </div>

      {/* Navigation Menu */}
      <nav style={{ marginTop: "10px" }}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => getLinkStyle(isActive)}
            onMouseEnter={(e) => handleMouseEnter(e, false)}
            onMouseLeave={(e) => handleMouseLeave(e, false)}
            end={item.path === "/hr"}
            onClick={() => {
              if (isMobile && onMobileRequestClose) onMobileRequestClose();
            }}
          >
            <div style={{ 
              color: "inherit",
              transition: "transform 0.3s ease",
            }}>
              {item.icon}
            </div>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Profile (Bottom) */}
      <div style={{
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
        justifyContent: "space-between",
        gap: "12px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "0" }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "linear-gradient(135deg,  #14b8a6 0%, #0ea5e9 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "600",
            color: "white",
            fontSize: "16px",
            flexShrink: 0,
          }}>
<<<<<<< HEAD:src/HR_panel/components/sidebar.jsx
            Anushka Jannawar
          </p>
          <p style={{ 
            margin: "2px 0 0 0", 
            fontSize: "12px", 
            color: "#94a3b8",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
           Senior HR Manager
          </p>
=======
            {userName.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: "1", minWidth: "0" }}>
            <p style={{ 
              margin: "0", 
              fontWeight: "600", 
              fontSize: "14px",
              color: "white",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
              {userName}
            </p>
            <p style={{ 
              margin: "2px 0 0 0", 
              fontSize: "12px", 
              color: "#94a3b8",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
              {userRole}
            </p>
          </div>
>>>>>>> e76d803 (Changed UI):recuritment_management_system/src/HR_panel/components/Sidebar.jsx
        </div>
        <button onClick={handleLogout} style={{
          background: "transparent",
          border: "none",
          color: "#f87171",
          cursor: "pointer",
          padding: "5px",
          display: "flex", // Keep display flex for alignment
        }} title="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;