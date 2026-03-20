// src/utils/authGuard.js
// Advanced authentication and authorization utilities

import { getToken, getRole } from "./auth";
import { isValidJWT, isTokenExpiringSoon } from "./security";

/**
 * Check if user is authenticated and has valid token
 */
export const isAuthenticatedAndValid = () => {
  const token = getToken();
  
  if (!token) {
    return false;
  }

  // Check if token is valid JWT
  if (!isValidJWT(token)) {
    return false;
  }

  // Check if token is expiring soon
  if (isTokenExpiringSoon(token, 1)) {
    console.warn('Token expiring soon, consider refreshing');
    return true; // Still valid but warn
  }

  return true;
};

/**
 * Check if user has specific role
 */
export const hasRole = (requiredRole) => {
  const userRole = getRole();
  return userRole === requiredRole;
};

/**
 * Check if user has any of the required roles
 */
export const hasAnyRole = (requiredRoles = []) => {
  const userRole = getRole();
  return requiredRoles.includes(userRole);
};

/**
 * Get user's permission level based on role
 */
export const getPermissionLevel = () => {
  const role = getRole();
  
  const permissionLevels = {
    student: 1,
    manager: 2,
    superadmin: 3,
  };

  return permissionLevels[role] || 0;
};

/**
 * Check if user has higher or equal permission level
 */
export const hasPermissionLevel = (requiredLevel) => {
  return getPermissionLevel() >= requiredLevel;
};

/**
 * Create authentication header for API requests
 */
export const getAuthHeader = () => {
  const token = getToken();
  
  if (!token) {
    return null;
  }

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

/**
 * Create CORS-safe headers
 */
export const getCORSSafeHeaders = () => {
  return {
    ...getAuthHeader(),
    'X-Requested-With': 'XMLHttpRequest',
  };
};

/**
 * Validate API response for authentication errors
 */
export const validateAPIResponse = (error) => {
  if (error.response) {
    // 401 - Unauthorized
    if (error.response.status === 401) {
      // Clear authentication data
      localStorage.removeItem('bluto-hack-token');
      localStorage.removeItem('bluto-hack-role');
      window.location.href = '/';
      return {
        isAuthError: true,
        message: 'Session expired. Please login again.',
      };
    }

    // 403 - Forbidden
    if (error.response.status === 403) {
      return {
        isAuthError: false,
        isForbidden: true,
        message: 'You do not have permission to access this resource.',
      };
    }
  }

  return {
    isAuthError: false,
    isForbidden: false,
  };
};

/**
 * Create secure cookie options
 */
export const getSecureCookieOptions = () => {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
};

/**
 * Audit log event
 */
export const auditLog = (eventType, eventData, severity = 'info') => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    eventType,
    eventData,
    severity,
    userRole: getRole(),
    userAgent: navigator.userAgent,
    url: window.location.href,
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[AUDIT LOG]', logEntry);
  }

  // In production, send to backend logging service
  if (process.env.NODE_ENV === 'production') {
    // Example: sendToLoggingService(logEntry)
  }

  return logEntry;
};

/**
 * Security headers configuration
 */
export const getSecurityHeaders = () => {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': buildCSP(),
  };
};

/**
 * Build Content Security Policy header
 */
export const buildCSP = () => {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Adjust as needed
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
  ].join('; ');
};

/**
 * Prevent CSRF attacks by validating same-origin requests
 */
export const isValidOrigin = (origin = document.referrer) => {
  const allowedOrigins = [
    process.env.REACT_APP_API_URL,
    window.location.origin,
  ].filter(Boolean);

  return allowedOrigins.some((allowed) => origin.startsWith(allowed));
};

/**
 * Check for suspicious activity
 */
export const checkSuspiciousActivity = () => {
  const suspiciousIndicators = [];

  // Check for unusual user agent
  const userAgent = navigator.userAgent;
  if (userAgent.includes('bot') || userAgent.includes('crawler')) {
    suspiciousIndicators.push('Bot/Crawler detected');
  }

  // Check for console usage (dev tools)
  const isDevToolsOpen = () => {
    const start = performance.now();
    debugger; // eslint-disable-line no-debugger
    return performance.now() - start > 100;
  };

  // Only in production and if explicitly needed
  if (process.env.NODE_ENV === 'production') {
    try {
      if (isDevToolsOpen()) {
        suspiciousIndicators.push('Dev tools detected');
      }
    } catch (e) {
      // Ignore errors
    }
  }

  return {
    isSuspicious: suspiciousIndicators.length > 0,
    indicators: suspiciousIndicators,
  };
};

export default {
  isAuthenticatedAndValid,
  hasRole,
  hasAnyRole,
  getPermissionLevel,
  hasPermissionLevel,
  getAuthHeader,
  getCORSSafeHeaders,
  validateAPIResponse,
  getSecureCookieOptions,
  auditLog,
  getSecurityHeaders,
  buildCSP,
  isValidOrigin,
  checkSuspiciousActivity,
};
