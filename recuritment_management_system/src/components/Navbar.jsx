import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 glass text-white transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* <h1 className="text-2xl font-bold tracking-wide">HIRING</h1> */}
        <Link className="text-2xl font-bold tracking-wide text-gradient" to="/">
          SMART-HR
        </Link>

        {token ? (
          <ul className="hidden md:flex items-center gap-8 text-lg">
            <span className="text-sm font-medium mr-4 text-slate-300">
              Role: <span className="text-indigo-400">{role}</span>
            </span>
            <Link
              className="hover:text-indigo-300 transition-colors"
              to={
                role === "HR"
                  ? "/hr"
                  : role === "CANDIDATE" || role === "Candidate"
                    ? "/candidate"
                    : role === "INTERVIEWER" || role === "Interviewer"
                      ? "/interviewer"
                      : "/"
              }
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-rose-600 px-5 py-2 rounded-lg hover:from-red-600 hover:to-rose-700 transition shadow-lg shadow-red-500/30"
            >
              Logout
            </button>
          </ul>
        ) : (
          <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-200">
            <Link className="hover:text-indigo-400 transition-colors" to="/">
              Home
            </Link>
            <Link
              className="hover:text-indigo-400 transition-colors"
              to="/about"
            >
              About
            </Link>
            <Link
              className="hover:text-indigo-400 transition-colors"
              to="/contact"
            >
              Contact
            </Link>
            <Link
              className="hover:text-indigo-400 transition-colors"
              to="/services"
            >
              Services
            </Link>

            <div
              className="relative"
              onMouseEnter={() => {
                setLoginOpen(true);
                setRegisterOpen(false);
              }}
              onMouseLeave={() => setLoginOpen(false)}
            >
              <button className="hover:text-indigo-400 transition-colors flex items-center gap-1">
                Login <span className="text-xs">▼</span>
              </button>

              {loginOpen && (
                <div className="absolute top-full right-0 pt-2 z-50">
                  <div className="glass-card text-white rounded-xl shadow-2xl shadow-indigo-500/10 w-48 overflow-hidden border border-slate-700/50 hover:block">
                    <Link
                      onClick={() => setLoginOpen(false)}
                      className="block px-4 py-2.5 hover:bg-white/10 transition-colors text-sm"
                      to="/login/hr"
                    >
                      HR
                    </Link>
                    <Link
                      onClick={() => setLoginOpen(false)}
                      className="block px-4 py-2.5 hover:bg-white/10 transition-colors text-sm"
                      to="/login/interviewer"
                    >
                      Interviewer
                    </Link>
                    <Link
                      onClick={() => setLoginOpen(false)}
                      className="block px-4 py-2.5 hover:bg-white/10 transition-colors text-sm"
                      to="/login/candidate"
                    >
                      Candidate
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => {
                setRegisterOpen(true);
                setLoginOpen(false);
              }}
              onMouseLeave={() => setRegisterOpen(false)}
            >
              <button className="hover:text-indigo-400 transition-colors flex items-center gap-1">
                Register <span className="text-xs">▼</span>
              </button>

              {registerOpen && (
                <div className="absolute top-full right-0 pt-2 z-50">
                  <div className="glass-card text-white rounded-xl shadow-2xl shadow-indigo-500/10 w-48 overflow-hidden border border-slate-700/50 hover:block">
                    <Link
                      onClick={() => setRegisterOpen(false)}
                      className="block px-4 py-2.5 hover:bg-white/10 transition-colors text-sm"
                      to="/register/hr"
                    >
                      HR
                    </Link>
                    <Link
                      onClick={() => setRegisterOpen(false)}
                      className="block px-4 py-2.5 hover:bg-white/10 transition-colors text-sm"
                      to="/register/interviewer"
                    >
                      Interviewer
                    </Link>
                    <Link
                      onClick={() => setRegisterOpen(false)}
                      className="block px-4 py-2.5 hover:bg-white/10 transition-colors text-sm"
                      to="/register/candidate"
                    >
                      Candidate
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </ul>
        )}

        <button
          className="md:hidden text-2xl text-slate-300 hover:text-white"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="md:hidden glass border-t border-slate-700/50 px-4 py-4 space-y-3 z-50 backdrop-blur-xl">
          {token ? (
            <>
              <span className="block text-sm font-semibold opacity-80 text-slate-300">
                Role: <span className="text-indigo-400">{role}</span>
              </span>
              <Link
                className="block hover:text-indigo-400 transition-colors text-sm"
                to={
                  role === "HR"
                    ? "/hr"
                    : role === "CANDIDATE" || role === "Candidate"
                      ? "/candidate"
                      : role === "INTERVIEWER" || role === "Interviewer"
                        ? "/interviewer"
                        : "/"
                }
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-center bg-gradient-to-r from-red-500 to-rose-600 px-4 py-2 mt-2 rounded-lg hover:from-red-600 hover:to-rose-700 transition shadow-lg text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                className="block hover:text-indigo-400 transition-colors text-sm text-slate-300"
                to="/"
              >
                Home
              </Link>
              <Link
                className="block hover:text-indigo-400 transition-colors text-sm text-slate-300"
                to="/about"
              >
                About
              </Link>
              <Link
                className="block hover:text-indigo-400 transition-colors text-sm text-slate-300"
                to="/contact"
              >
                Contact
              </Link>
              <Link
                className="block hover:text-indigo-400 transition-colors text-sm text-slate-300"
                to="/services"
              >
                Services
              </Link>

              <div>
                <p className="font-semibold mt-3 text-indigo-300 text-sm border-b border-white/10 pb-1 mb-2">
                  Login
                </p>
                <Link
                  className="block pl-4 py-1 hover:text-indigo-400 transition-colors text-sm text-slate-300"
                  to="/login/hr"
                >
                  HR
                </Link>
                <Link
                  className="block pl-4 py-1 hover:text-indigo-400 transition-colors text-sm text-slate-300"
                  to="/login/interviewer"
                >
                  Interviewer
                </Link>
                <Link
                  className="block pl-4 py-1 hover:text-indigo-400 transition-colors text-sm text-slate-300"
                  to="/login/candidate"
                >
                  Candidate
                </Link>
              </div>

              {/* Mobile Register */}
              <div>
                <p className="font-semibold mt-3 text-indigo-300 text-sm border-b border-white/10 pb-1 mb-2">
                  Register
                </p>
                <Link
                  className="block pl-4 py-1 hover:text-indigo-400 transition-colors text-sm text-slate-300"
                  to="/register/hr"
                >
                  HR
                </Link>
                <Link
                  className="block pl-4 py-1 hover:text-indigo-400 transition-colors text-sm text-slate-300"
                  to="/register/interviewer"
                >
                  Interviewer
                </Link>
                <Link
                  className="block pl-4 py-1 hover:text-indigo-400 transition-colors text-sm text-slate-300"
                  to="/register/candidate"
                >
                  Candidate
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
