import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, getRole } from "../../utils/auth";

const roleDashboard = {
  student: "/student/dashboard",
  manager: "/manager/dashboard",
  superadmin: "/superadmin/dashboard"
};

const ProtectedRoute = ({ children, role }) => {
  // Redirect to /home if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/home" />;
  }

  const userRole = getRole();

  // Only redirect if role is not found or doesn't match
  if (!userRole) {
    return <Navigate to="/home" />;
  }

  if (role && role !== userRole) {
    return <Navigate to={roleDashboard[userRole]} />;
  }

  return children;
};

export default ProtectedRoute;