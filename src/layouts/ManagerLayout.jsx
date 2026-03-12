import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

const ManagerLayout = () => {
  return (
    <div className="d-flex">
      <Sidebar role="manager" />

      <div className="flex-grow-1">
        <Navbar />

        <div className="p-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ManagerLayout;