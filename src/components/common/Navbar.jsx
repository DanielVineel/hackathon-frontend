// src/components/common/Navbar.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import "./Navbar.css";

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

  return (
    <nav className="navbar navbar-theme" style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
      <div className="navbar-container px-3 d-flex justify-content-between align-items-center">
        <span className="navbar-brand fw-bold" style={{ color: 'var(--color-primary)' }}>
          Hackathon Platform
        </span>

        <div className="d-flex align-items-center gap-3">
          {user && (
            <span className="text-secondary" style={{ color: 'var(--color-text-secondary)' }}>
              {user.name || "User"} <span style={{ color: 'var(--color-primary)' }}>({role})</span>
            </span>
          )}

          <ThemeToggle />

          <button 
            className="btn btn-outline-danger" 
            onClick={handleLogout}
            style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;