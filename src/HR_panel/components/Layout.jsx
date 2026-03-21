import { useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const layoutStyle = {
    display: "flex",
    minHeight: "100vh",
  };

  const contentStyle = {
    flex: "1",
    marginLeft: sidebarCollapsed ? "80px" : "250px",
    transition: "margin-left 0.3s ease",
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  };

  const mainStyle = {
    flex: "1",
    padding: "20px",
    background: "#f8fafc",
  };

  return (
    <div style={layoutStyle}>
      <Sidebar onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div style={contentStyle}>
        <div style={mainStyle}>
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;