import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiMoon, FiBell, FiSun, FiMenu } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext.jsx";

function Navbar({ onToggleCollapsed }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isThemeDark, setIsThemeDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Efek untuk mengubah kelas pada body/html saat state tema berubah
  useEffect(() => {
    if (isThemeDark) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [isThemeDark]);

  const toggleTheme = () => {
    setIsThemeDark((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  // Mengambil huruf pertama dari username untuk avatar, default "A"
  const userInitial = user?.username
    ? user.username.charAt(0).toUpperCase()
    : "A";

  return (
    <header className="navbar">
      <div className="nav-left">
        <button
          type="button"
          className="navbar-menu-button"
          onClick={onToggleCollapsed}
          aria-label="Buka navigasi"
          title="Menu"
        >
          <FiMenu />
        </button>
        <h2 className="nav-title">Dashboard</h2>
      </div>

      <div className="navbar-content">
        <button
          className="navbar-icon-button"
          title="Toggle theme"
          onClick={toggleTheme}
        >
          {isThemeDark ? <FiSun /> : <FiMoon />}
        </button>

        <button
          className="navbar-icon-button notification-button"
          title="Notifications"
          aria-label="Notifications"
        >
          <FiBell />
          <span className="notification-dot"></span>
        </button>

        <div className="navbar-user-profile">
          <div className="navbar-avatar">{userInitial}</div>
          <span className="navbar-name">{user?.username}</span>
        </div>

        <button
          className="navbar-logout"
          onClick={handleLogout}
          title="Sign out"
          aria-label="Sign out"
        >
          <FiLogOut />
          <span>Sign out</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
