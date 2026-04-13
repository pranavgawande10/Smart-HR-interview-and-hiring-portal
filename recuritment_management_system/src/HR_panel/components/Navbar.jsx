import { useState, useEffect } from "react";
import { Bell, Check } from "lucide-react";

const Navbar = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Initial fetch
    const stored = JSON.parse(localStorage.getItem("hrNotifications") || "[]");
    setNotifications(stored.reverse());

    // Listen for storage changes from Interviewer panel
    const handleStorage = () => {
      const updated = JSON.parse(localStorage.getItem("hrNotifications") || "[]");
      setNotifications(updated.reverse());
    };
    
    // Fallback polling for same-window updates
    const intervalId = setInterval(handleStorage, 2000);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(intervalId);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem("hrNotifications", JSON.stringify([...updated].reverse()));
    setShowDropdown(false);
  };

  const markAsRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    const toSave = [...updated].reverse();
    localStorage.setItem("hrNotifications", JSON.stringify(toSave));
  };

  const getBadgeColor = (result) => {
    if (result === "Selected") return "#10b981"; // green
    if (result === "Rejected") return "#ef4444"; // red
    return "#3b82f6"; // blue
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      padding: "15px 30px",
      background: "white",
      borderBottom: "1px solid #e2e8f0",
      position: "sticky",
      top: 0,
      zIndex: 50,
      boxShadow: "0 2px 10px rgba(0,0,0,0.02)"
    }}>
      
      {/* Notification Bell */}
      <div style={{ position: "relative" }}>
        <button 
          onClick={() => setShowDropdown(!showDropdown)}
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "50%",
            width: "42px",
            height: "42px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#475569",
            transition: "all 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
          onMouseLeave={e => e.currentTarget.style.background = "#f8fafc"}
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span style={{
              position: "absolute",
              top: "-2px",
              right: "-2px",
              background: "#ef4444",
              color: "white",
              fontSize: "10px",
              fontWeight: "700",
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid white"
            }}>
              {unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown */}
        {showDropdown && (
          <div style={{
            position: "absolute",
            top: "50px",
            right: "0",
            width: "350px",
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
            zIndex: 100
          }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc" }}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "#0f172a" }}>Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} style={{ background: "none", border: "none", color: "rgb(20, 184, 166)", fontSize: "13px", fontWeight: "500", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Check size={14} /> Mark all read
                </button>
              )}
            </div>

            <div style={{ maxHeight: "350px", overflowY: "auto" }}>
              {notifications.length === 0 ? (
                <div style={{ padding: "30px 20px", textAlign: "center", color: "#94a3b8", fontSize: "14px" }}>
                  No new notifications
                </div>
              ) : (
                notifications.map(notif => (
                  <div 
                    key={notif.id} 
                    onClick={() => markAsRead(notif.id)}
                    style={{ 
                      padding: "16px 20px", 
                      borderBottom: "1px solid #f1f5f9",
                      background: notif.read ? "white" : "#f0fdfa",
                      cursor: "pointer",
                      display: "flex",
                      gap: "12px",
                      transition: "background 0.2s"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = notif.read ? "#f8fafc" : "#ccfbf1"}
                    onMouseLeave={e => e.currentTarget.style.background = notif.read ? "white" : "#f0fdfa"}
                  >
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: getBadgeColor(notif.result), marginTop: "6px", flexShrink: 0 }} />
                    <div>
                      <p style={{ margin: "0 0 6px 0", fontSize: "14px", color: "#0f172a", lineHeight: "1.4" }}>
                        {notif.message}
                      </p>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>
                        {new Date(notif.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
