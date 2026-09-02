import { Outlet } from "react-router-dom";
import InterviewerSidebar from "./InterviewerSidebar";

const InterviewerLayout = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <InterviewerSidebar />
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

export default InterviewerLayout;