// src/components/common/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { logout } from "../../store/authSlice";
const Sidebar = ({ role }) => {
  const links = {
    student: [
      { path: "/student/dashboard", label: "Dashboard" },
      { path: "/student/events", label: "Events" },
      { path: "/student/problems", label: "Problems" },
      { path: "/student/certificates", label: "Certificates" },
      { path: "/student/event-history", label: "Event History" },
      { path: "/student/problem-history", label: "Problem History" },
      { path: "/student/payment-history", label: "Payment History" },
      { path: "/student/settings", label: "Settings" },
    ],
    manager: [
      { path: "/manager/dashboard", label: "Dashboard" },
      { path: "/manager/events", label: "Events" },
      { path: "/manager/create-event", label: "Create Event" },
      { path: "/manager/problems", label: "Problems" },
      { path: "/manager/analytics", label: "Analytics" },
      { path: "/manager/settings", label: "Settings" },
    ],
    superadmin: [
      { path: "/superadmin/dashboard", label: "Dashboard" },
      { path: "/superadmin/managers", label: "Managers" },
      { path: "/superadmin/events", label: "Events" },
      { path: "/superadmin/problems", label: "Problems" },
      { path: "/superadmin/analytics", label: "Analytics" },
    ],
  };

  const roleLinks = links[role] || [];

  return (
    <div className="bg-light vh-100 p-3" style={{ width: "220px" }}>
      <h5 className="mb-3">Menu</h5>

      <ul className="nav flex-column">
        {roleLinks.map((link) => (
          <li className="nav-item mb-2" key={link.path}>
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active" : "")
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;

