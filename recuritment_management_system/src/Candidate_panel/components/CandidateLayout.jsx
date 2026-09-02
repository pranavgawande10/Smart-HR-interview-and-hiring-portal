import CandidateSidebar from "./CandidateSidebar.jsx";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import axios from "axios";
import { Menu } from "lucide-react";

const CandidateLayout = () => {
  const NAVBAR_OFFSET_PX = 0;
  const SIDEBAR_WIDTH_PX = 280;

  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem("userName") || localStorage.getItem("name") || "Candidate";
  });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  useEffect(() => {
    if (!isMobile) setMobileOpen(false);
  }, [isMobile]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        
        const config = {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const userRes = await axios.get("http://localhost:3001/api/v1/candidates/current-user", config);
        const name = userRes?.data?.message?.name || userRes?.data?.data?.name || userRes?.data?.user?.name || userRes?.data?.name;
        if (name) {
          setUserName(name);
          localStorage.setItem("userName", name);
        }
      } catch (err) {
        console.error("Error fetching user name in layout:", err);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex flex-col font-sans">
      {isMobile && (
        <>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="fixed z-[1100] w-11 h-11 rounded-xl border border-white/20 bg-slate-900/85 text-white flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.25)] cursor-pointer backdrop-blur-md transition-transform hover:scale-105"
            style={{ top: NAVBAR_OFFSET_PX + 10, left: 12 }}
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>

          {mobileOpen && (
            <div
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[900]"
              style={{ top: NAVBAR_OFFSET_PX }}
            />
          )}
        </>
      )}

      <CandidateSidebar
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        onMobileRequestClose={() => setMobileOpen(false)}
        userName={userName}
      />

      <div
        className="flex-1 flex flex-col bg-slate-900 transition-all duration-300"
        style={{ marginLeft: isMobile ? 0 : SIDEBAR_WIDTH_PX }}
      >
        <main className="p-4 sm:p-8 flex-1">
          <Outlet />
        </main>
        <div className="w-full">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default CandidateLayout;