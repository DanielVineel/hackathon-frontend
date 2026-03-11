// src/layouts/Navbar.jsx

import React from "react";
import { logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const Navbar = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="d-flex justify-content-between p-3 border-bottom">

      <h5>Hackathon Platform</h5>

      <button className="btn btn-danger" onClick={handleLogout}>
        Logout
      </button>

    </div>
  );
};

export default Navbar;