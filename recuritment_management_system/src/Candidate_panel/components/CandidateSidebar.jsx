import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Calendar,
  UserCircle,
  LogOut,
} from "lucide-react";

const NAVBAR_OFFSET_PX = 0;

const CandidateSidebar = ({
  isMobile = false,
  mobileOpen = false,
  onMobileRequestClose,
  userName: propUserName,
}) => {
  const navigate = useNavigate();
  const userName = propUserName || localStorage.getItem("userName") || localStorage.getItem("name") || "Candidate";
  const userRole = localStorage.getItem("role") || "Candidate";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    localStorage.removeItem("name");
    navigate("/");
  };

  const menuItems = [
    { path: "/candidate", label: "Dashboard", icon: <LayoutDashboard size={22} /> },
    { path: "/candidate/jobs", label: "Browse Jobs", icon: <Briefcase size={22} /> },
    { path: "/candidate/applications", label: "My Applications", icon: <FileText size={22} /> },
    { path: "/candidate/interviews", label: "My Interviews", icon: <Calendar size={22} /> },
    { path: "/candidate/profile", label: "Profile", icon: <UserCircle size={22} /> },
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 h-screen w-[280px] bg-slate-900 border-r border-slate-800 text-white p-6 z-[1000] flex flex-col transition-transform duration-300 ease-in-out ${isMobile ? (mobileOpen ? "translate-x-0" : "-translate-x-[105%]") : "translate-x-0"}`}
    >
      {/* Brand/Logo */}
      <div className="flex items-center mb-10 pb-5 border-b border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-sky-500 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-teal-500/20">
          💼
        </div>
        <h2 className="text-2xl font-bold ml-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-sky-400 m-0 outfit-font">
          Candidate
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/candidate"}
            onClick={() => {
              if (isMobile && onMobileRequestClose) onMobileRequestClose();
            }}
            className={({ isActive }) => `
              flex items-center px-4 py-3.5 rounded-xl text-[15px] font-medium gap-4 transition-all duration-300 group
              ${isActive 
                ? 'bg-gradient-to-r from-teal-500/20 to-sky-500/10 text-white border border-teal-500/30 shadow-[0_0_15px_rgba(20,184,166,0.15)]' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
              }
            `}
          >
            <div className={`transition-transform duration-300 group-hover:scale-110`}>{item.icon}</div>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Profile (Bottom) */}
      <div className="mt-auto pt-6 pb-2">
        <div className="glass-card rounded-xl p-3 border border-slate-700/50 flex items-center justify-between gap-3 bg-slate-800/40">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-sky-500 flex items-center justify-center font-semibold text-white text-base flex-shrink-0 shadow-md">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="m-0 font-semibold text-sm text-white whitespace-nowrap overflow-hidden text-ellipsis">
                {userName}
              </p>
              <p className="m-0 mt-0.5 text-xs text-slate-400 whitespace-nowrap overflow-hidden text-ellipsis">
                {userRole}
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="bg-transparent border-none text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 rounded-lg cursor-pointer flex transition-colors flex-shrink-0"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default CandidateSidebar;