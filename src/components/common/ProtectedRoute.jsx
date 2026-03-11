import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, getRole } from "../../utils/auth";

const roleDashboard = {
  student: "/student/dashboard",
  manager: "/manager/dashboard",
  superadmin: "/superadmin/dashboard"
};

const ProtectedRoute = ({ children, role }) => {

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  const userRole = getRole();

  if (role && role !== userRole) {
    return <Navigate to={roleDashboard[userRole]} />;
  }

  return children;
};

export default ProtectedRoute;