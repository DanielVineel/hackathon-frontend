// src/layouts/Sidebar.jsx

import React from "react";
import { Link } from "react-router-dom";
import { getRole } from "../utils/auth";

const Sidebar = () => {

  const role = getRole();

  const studentMenu = [
    { name: "Dashboard", path: "/student/dashboard" },
    { name: "Events", path: "/student/events" },
    { name: "Problems", path: "/student/problems" },
    { name: "Certificates", path: "/student/certificates" },
    { name: "Event History", path: "/student/event-history" },
    { name: "Problem History", path: "/student/problem-history" },
    { name: "Payment History", path: "/student/payment-history" },
    { name: "Settings", path: "/student/settings" }
  ];

  const managerMenu = [
    { name: "Dashboard", path: "/manager/dashboard" },
    { name: "Events", path: "/manager/events" },
    { name: "Create Event", path: "/manager/events/create" },
    { name: "Problems", path: "/manager/problems" },
    { name: "Analytics", path: "/manager/analytics" },
    { name: "Settings", path: "/manager/settings" }
  ];

  const superAdminMenu = [
    { name: "Dashboard", path: "/superadmin/dashboard" },
    { name: "Managers", path: "/superadmin/managers" },
    { name: "Events", path: "/superadmin/events" },
    { name: "Problems", path: "/superadmin/problems" },
    { name: "Analytics", path: "/superadmin/analytics" }
  ];

  let menu = [];

  if (role === "student") menu = studentMenu;
  if (role === "manager") menu = managerMenu;
  if (role === "superadmin") menu = superAdminMenu;

  return (
    <div style={{ width: "220px", background: "#111", minHeight: "100vh", color: "#fff" }}>
      
      <h4 className="p-3">Hackathon</h4>

      {menu.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          style={{
            display: "block",
            padding: "10px 20px",
            color: "#fff",
            textDecoration: "none"
          }}
        >
          {item.name}
        </Link>
      ))}

    </div>
  );
};

export default Sidebar;