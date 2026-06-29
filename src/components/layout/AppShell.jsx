import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { BarChart3, Clock, FileText, LogOut, Menu, Sparkles, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.jsx";
import styles from "./AppShell.module.css";

const NAV = [
  { to: "/analyze", icon: Sparkles, label: "Analyze Resume" },
  { to: "/history",  icon: Clock,     label: "History" },
];

export default function AppShell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className={styles.shell}>
      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div className={styles.overlay} onClick={() => setMobileOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`${styles.sidebar} ${mobileOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>
            <Sparkles size={18} />
          </div>
          <span className={styles.brandName}>ResumeAI</span>
          <button
            className={styles.mobileClose}
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className={styles.nav}>
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`
              }
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={17} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          <div className={styles.userRow}>
            <div className={styles.avatar}>
              {(user?.full_name ?? user?.email ?? "?")[0].toUpperCase()}
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.full_name ?? "User"}</span>
              <span className={styles.userEmail}>{user?.email}</span>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={15} />
            Log out
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className={styles.main}>
        <header className={styles.topbar}>
          <button
            className={styles.menuBtn}
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className={styles.topBrand}>
            <Sparkles size={16} />
            <span>ResumeAI</span>
          </div>
        </header>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
