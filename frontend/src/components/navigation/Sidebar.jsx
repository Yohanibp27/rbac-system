import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiHome,
  FiKey,
  FiShield,
  FiSidebar,
  FiUser,
} from "react-icons/fi";
import { FaLeaf } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext.jsx";

// tambah onNavigate
const Sidebar = ({ isCollapsed, onToggleCollapsed, onNavigate }) => {
  const { hasPermission } = useAuth();
  const menuItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      //  icon: FiGrid,
      icon: <FiGrid />,
      permission: null,
    },
    {
      title: "Manajemen User",
      path: "/users",
      icon: <FiUser />,
      permission: "user.view",
    },
    {
      title: "Manajemen Role",
      path: "/roles",
      icon: <FiShield />,
      permission: "role.view",
    },
    {
      title: "Manajemen Permission",
      path: "/permissions",
      icon: <FiKey />,
      permission: "permission.view",
    },
    {
      title: "Profil Pengguna",
      path: "/profile",
      icon: <FiUser />,
      permission: "profile.view",
    },
  ];

  // Menampilkan menu sesuai permission user
  const visibleMenus = menuItems.filter((item) => {
    if (!item.permission) {
      return true;
    }
    return hasPermission(item.permission);
  });

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        {!isCollapsed && (
          <div className="brand-wrapper">
            <div className="brand-logo">
              <FaLeaf />
            </div>
            <span className="brand-name">RBAC</span>
          </div>
        )}
        <button
          className="collapsed-button"
          onClick={onToggleCollapsed}
          title="Toggle"
        >
          <FiSidebar />
        </button>
      </div>

      <nav className="sidebar-menu">
        {/* {menuItems.map((item, index) => (*/}
        {visibleMenus.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            onClick={onNavigate}
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
            title={isCollapsed ? item.name : ""}
          >
            <span className="menu-icon">{item.icon}</span>
            {!isCollapsed && <span className="menu-text">{item.title}</span>}
          </NavLink>
        ))}
        {/* {visibleMenus.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }>
              <Icon className="sidebar-link-icon" />
              <span>{item.title}</span>
            </NavLink>
          );
        })} */}
      </nav>
    </aside>
  );
};

export default Sidebar;
