// src/layouts/DashboardLayout.jsx

import React from "react";
import { useSelector } from "react-redux";
import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";

const DashboardLayout = ({ children }) => {

  const { role } = useSelector((state) => state.auth);

  return (
    <div className="d-flex">

      <Sidebar role={role} />

      <div style={{ width: "100%" }}>
        <Navbar />

        <div className="container mt-4">
          {children}
        </div>
      </div>

    </div>
  );
};

export default DashboardLayout;

