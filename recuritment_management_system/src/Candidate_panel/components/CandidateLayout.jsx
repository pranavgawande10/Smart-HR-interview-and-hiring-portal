import CandidateSidebar from "./CandidateSidebar.jsx";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "../../components/Footer";

const CandidateLayout = () => {
  const NAVBAR_OFFSET_PX = 0;
  const SIDEBAR_WIDTH_PX = 280;

  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#f5f5f5",
        color: "#0f172a",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {isMobile && (
        <>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            style={{
              position: "fixed",
              top: NAVBAR_OFFSET_PX + 10,
              left: 12,
              zIndex: 1100,
              width: 44,
              height: 44,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(15,23,42,0.85)",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            }}
            aria-label="Open sidebar"
          >
            ☰
          </button>

          {mobileOpen && (
            <div
              onClick={() => setMobileOpen(false)}
              style={{
                position: "fixed",
                top: NAVBAR_OFFSET_PX,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(15,23,42,0.35)",
                zIndex: 900,
              }}
            />
          )}
        </>
      )}

      <CandidateSidebar
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        onMobileRequestClose={() => setMobileOpen(false)}
      />

      <div
        style={{
          marginLeft: isMobile ? 0 : SIDEBAR_WIDTH_PX,
          transition: "margin-left 0.2s ease",
          flex: 1,
          background: "#f8fafc",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ padding: "30px", flex: 1 }}>
          <Outlet />
        </div>
        <div style={{ width: "100%" }}>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default CandidateLayout;