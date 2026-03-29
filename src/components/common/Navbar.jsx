// src/components/common/Navbar.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import "./Navbar.css";
import { FaSignOutAlt, FaUser } from "react-icons/fa";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { role, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());

    // redirect based on role
    if (role === "student") navigate("/auth/student/login");
    else if (role === "manager") navigate("/auth/manager/login");
    else if (role === "superadmin") navigate("/auth/superadmin/login");
    else navigate("/");
  };

  const renderRoleBadge = () => {
    const roleColors = {
      student: '#3b82f6',
      manager: '#8b5cf6',
      superadmin: '#ef4444'
    };

    return (
      <span
        className="navbar__role-badge"
        style={{ backgroundColor: roleColors[role] || '#6366f1' }}
      >
        {role}
      </span>
    );
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <div className="navbar__left">
          <h1 className="navbar__brand">SaaS Platform</h1>
        </div>

        <div className="navbar__right">
          {user && (
            <div className="navbar__user-info">
              <div className="navbar__user-avatar">
                <FaUser />
              </div>
              <div className="navbar__user-details">
                <p className="navbar__user-name">
                  {user.firstName} {user.lastName || ""}
                </p>
                {renderRoleBadge()}
              </div>
            </div>
          )}

          <ThemeToggle />

          <button
            className="navbar__logout-btn"
            onClick={handleLogout}
            title="Logout"
            aria-label="Logout"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;