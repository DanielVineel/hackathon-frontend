// src/components/common/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

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
      { path: "/manager/submissions", label: "Submissions" },
      { path: "/manager/certificates", label: "Certificates" },
      { path: "/manager/analytics", label: "Analytics" },
      { path: "/manager/settings", label: "Settings" },
    ],
    superadmin: [
      { path: "/superadmin/dashboard", label: "Dashboard" },
      { path: "/superadmin/problems", label: "Problems" },
      { path: "/superadmin/myproblems", label: "My Problems" },
      { path: "/superadmin/events", label: "Events" },
      { path: "/superadmin/myevents", label: " My Events" },
      { path: "/superadmin/events-registrations", label: "Event Registrations" },
      { path: "/superadmin/submissions", label: "Submissions" },
      { path: "/superadmin/certificates", label: "Certificates" },
      { path: "/superadmin/payments", label: "Payments" },
      { path: "/superadmin/users", label: "Users" },
      { path: "/superadmin/settings", label: "Settings" },
    ],
  };

  const roleLinks = links[role] || [];

  return (
    <div className="sidebar" role="navigation" aria-label="Sidebar menu">
      <h5 className="sidebar-title">Menu</h5>

      <ul className="sidebar-nav">
        {roleLinks.map((link) => (
          <li className="nav-item" key={link.path}>
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active" : "")
              }
              aria-current={({ isActive }) => (isActive ? "page" : undefined)}
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

