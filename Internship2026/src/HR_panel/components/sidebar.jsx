import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>SmartHR</h2>

      <NavLink to="/">Dashboard</NavLink>
      <NavLink to="/jobs">Job Postings</NavLink>
      <NavLink to="/applicants">Applicants</NavLink>
      <NavLink to="/interviews">Interviews</NavLink>
      <NavLink to="/profile">Profile</NavLink>
    </div>
  );
};

export default Sidebar;
