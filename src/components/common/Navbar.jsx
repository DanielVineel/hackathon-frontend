// src/components/common/Navbar.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";

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
    <nav className="navbar navbar-light bg-light px-3 d-flex justify-content-between">
      
      <span className="navbar-brand fw-bold">
        Hackathon Platform
      </span>

      <div className="d-flex align-items-center gap-3">

        {user && (
          <span className="text-muted">
            {user.name || "User"} ({role})
          </span>
        )}

        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>

      </div>

    </nav>
  );
};

export default Navbar;