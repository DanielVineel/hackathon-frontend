import React from "react";
import { Navigate } from "react-router-dom";
import { getToken, getRole } from "../../utils/auth.js";

/**
 * Simple Private Route (Backward Compatible)
 * Use this if you prefer the simpler approach
 * 
 * Usage:
 * <PrivateRoute>
 *   <Dashboard />
 * </PrivateRoute>
 */
const PrivateRoute = ({ children }) => {
  const token = getToken();

  // If no token, redirect to login
  // if (!token) {
  //   return <Navigate to="/" replace />;
  // }

  return children;
};

/**
 * Role-Protected Route (Backward Compatible)
 * Protects a route and checks user role
 * 
 * Usage:
 * <RoleProtectedRoute role="manager">
 *   <ManagerDashboard />
 * </RoleProtectedRoute>
 */
export const RoleProtectedRoute = ({ children, role = null }) => {
  const token = getToken();
  const userRole = getRole();

  // If no token, redirect to home
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If role is specified and doesn't match, redirect based on user role
  if (role && userRole !== role) {
    const dashboards = {
      student: "/student/dashboard",
      manager: "/manager/dashboard",
      superadmin: "/superadmin/dashboard"
    };
    return <Navigate to={dashboards[userRole] || "/"} replace />;
  }

  return children;
};

export default PrivateRoute;