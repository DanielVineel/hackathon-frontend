import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

const SuperAdminLayout = () => {
  return (
    <div className="d-flex">
      <Sidebar role="superadmin" />

      <div className="flex-grow-1">
        <Navbar />

        <div className="p-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLayout;