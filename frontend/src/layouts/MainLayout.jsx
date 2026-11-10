import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/navigation/Sidebar.jsx";
import Navbar from "../components/navigation/Navbar.jsx";

const MainLayout = ({ children }) => {
  //  const [collapsed, setCollapsed] = useState(false)
  const [collapsed, setCollapsed] = useState(
    () => window.matchMedia("(max-width: 768px)").matches,
  );

  return (
    <div className="layout-wrapper">
      <div
        className={`sidebar-overlay ${!collapsed ? "active" : ""}`}
        onClick={() => setCollapsed(true)}
      />
      <Sidebar
        isCollapsed={collapsed}
        onToggleCollapsed={() => setCollapsed(!collapsed)}
        onNavigate={() => {
          if (window.matchMedia("(max-width: 768px)").matches) {
            setCollapsed(true);
          }
        }}
      />
      <div className="main-content">
        <Navbar onToggleCollapsed={() => setCollapsed(!collapsed)} />
        <div className="content-body">{children || <Outlet />}</div>
      </div>
    </div>
  );
};

export default MainLayout;
