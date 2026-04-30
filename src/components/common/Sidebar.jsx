// src/components/common/Sidebar.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

import {
  FaHome,
  FaCalendar,
  FaCode,
  FaCog,
  FaCertificate,
  FaHistory,
  FaMoneyBill,
  FaUsers,
  FaChartBar,
  FaPlus,
  FaBars,
  FaFileAlt,
  FaLightbulb,
  FaEnvelope,
} from "react-icons/fa";

const links = {
  student: [
    { path: "/student/dashboard", label: "Dashboard", icon: <FaHome /> },
    { path: "/student/events", label: "Events", icon: <FaCalendar /> },
    { path: "/student/problems", label: "Problems", icon: <FaCode /> },
    { path: "/student/practice-sandbox", label: "Practice Sandbox", icon: <FaCode /> },
    { path: "/student/certificates", label: "Certificates", icon: <FaCertificate /> },
    { path: "/student/profile", label: "Profile", icon: <FaUsers /> },
    { path: "/student/event-history", label: "Event History", icon: <FaHistory /> },
    { path: "/student/problem-history", label: "Problem History", icon: <FaHistory /> },
    { path: "/student/payment-history", label: "Payment History", icon: <FaMoneyBill /> },
  ],
  manager: [
    { path: "/manager/dashboard", label: "Dashboard", icon: <FaHome /> },
    { path: "/manager/problems", label: "Problems", icon: <FaCode /> },
    { path: "/manager/events", label: "Events", icon: <FaCalendar /> },
    { path: "/manager/submissions", label: "Submissions", icon: <FaCode /> },
    { path: "/manager/certificates", label: "Certificates", icon: <FaCertificate /> },
    { path: "/manager/analytics", label: "Analytics", icon: <FaChartBar /> },
    { path: "/manager/settings", label: "Settings", icon: <FaCog /> },
  ],
  superadmin: [
    { path: "/superadmin/dashboard", label: "Dashboard", icon: <FaHome /> },
    { path: "/superadmin/problems", label: "Problems", icon: <FaCode /> },
    { path: "/superadmin/events", label: "Events", icon: <FaCalendar /> },
    { path: "/superadmin/events-registrations", label: "Registrations", icon: <FaUsers /> },
    { path: "/superadmin/submissions", label: "Submissions", icon: <FaCode /> },
    { path: "/superadmin/certificates", label: "Certificates", icon: <FaCertificate /> },
    { path: "/superadmin/payments", label: "Payments", icon: <FaMoneyBill /> },
    { path: "/superadmin/users", label: "Users", icon: <FaUsers /> },
    { path: "/superadmin/reports", label: "Reports", icon: <FaFileAlt /> },
    { path: "/superadmin/improvements", label: "Improvements", icon: <FaLightbulb /> },
    { path: "/superadmin/contacts", label: "Contacts", icon: <FaEnvelope /> },
    { path: "/superadmin/settings", label: "Settings", icon: <FaCog /> },
  ],
};

const Sidebar = ({ role }) => {
  const [collapsed, setCollapsed] = useState(false);
  const roleLinks = links[role] || [];

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      
      {/* Toggle Button */}
      <div className="sidebar-header">
        <h5 className="sidebar-title">Menu</h5>
        <button
          className="toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
        >
          <FaBars />
        </button>
      </div>

      <ul className="sidebar-nav">
        {roleLinks.map((link) => (
          <li key={link.path}>
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active" : "")
              }
            >
              <span className="icon">{link.icon}</span>
              <span className="link-text">{link.label}</span>

              {/* Tooltip */}
              {collapsed && (
                <span className="tooltip">{link.label}</span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;