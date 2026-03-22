import CandidateSidebar from "./CandidateSidebar.jsx";
import { Outlet } from "react-router-dom";

const CandidateLayout = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <CandidateSidebar />
      <div style={{
        flex: "1",
        marginLeft: "280px",
        minHeight: "100vh",
        background: "#f8fafc",
      }}>
        <div style={{ padding: "30px" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CandidateLayout;