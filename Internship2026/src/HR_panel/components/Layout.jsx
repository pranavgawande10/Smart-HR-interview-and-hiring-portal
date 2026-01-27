import Sidebar from "./Sidebar";
import "../../App.css";

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">{children}</div>
    </div>
  );
};

export default Layout;
