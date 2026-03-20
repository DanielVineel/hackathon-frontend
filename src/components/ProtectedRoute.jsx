import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, getCurrentAuth, getLoginPath } from "../utils/blutoAuth";

/**
 * Protected Route Component
 * Checks if user is authenticated and has the correct role
 * 
 * Usage:
 * <ProtectedRoute requiredRole="student">
 *   <StudentDashboard />
 * </ProtectedRoute>
 */
export const ProtectedRoute = ({ 
  children, 
  requiredRole = null // Can be 'student', 'manager', 'superadmin', or null for any authenticated user
}) => {
  const auth = getCurrentAuth();
  
  // Check if user is authenticated
  if (!auth || !isAuthenticated(auth.userType)) {
    // Redirect to appropriate login page
    const loginPath = requiredRole ? getLoginPath(requiredRole) : "/login/student";
    return <Navigate to={loginPath} replace />;
  }

  // Check if user has required role
  if (requiredRole && auth.userType !== requiredRole) {
    // Redirect to their own dashboard
    const loginPath = getLoginPath(auth.userType);
    return <Navigate to={loginPath} replace />;
  }

  return children;
};

/**
 * Role-Based Access Control Component
 * Only renders children if user has one of the specified roles
 */
export const RoleBasedAccess = ({ 
  children, 
  roles = [] // Array of allowed roles, e.g., ['student', 'manager']
}) => {
  const auth = getCurrentAuth();

  if (!auth) {
    return null;
  }

  if (roles.length > 0 && !roles.includes(auth.userType)) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
