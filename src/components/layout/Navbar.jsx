import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { Button } from "../ui/UI.jsx";
import s from "./Navbar.module.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const initials = user?.profession
    ? user.profession.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <header className={s.bar}>
      <div className={s.inner}>
        <div className={s.brand}>
          <span className={s.brandMark}>R</span>
          <span className={s.brandName}>ResumeIQ</span>
        </div>

        {user && (
          <div className={s.right}>
            <div className={s.userChip}>
              <div className={s.avatar}>{initials}</div>
              <div className={s.userText}>
                <span className={s.profession}>{user.profession || "User"}</span>
                <span className={s.email}>{user.email}</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
