/**
 * Bluto Authentication Utility
 * Handles secure localStorage with "bluto" prefix for multiple user types
 * Supports: Student, Manager, SuperAdmin
 */

const BLUTO_PREFIX = "bluto_";
export const USER_TYPES = {
  STUDENT: "student",
  MANAGER: "manager",
  SUPERADMIN: "superadmin"
};

/**
 * Generate localStorage key with bluto prefix
 */
const getStorageKey = (userType, suffix) => {
  return `${BLUTO_PREFIX}${userType}_${suffix}`;
};

/**
 * Save authentication data for a specific user type
 */
export const saveAuth = (userType, authData) => {
  if (!Object.values(USER_TYPES).includes(userType)) {
    throw new Error("Invalid user type");
  }

  localStorage.setItem(getStorageKey(userType, "token"), authData.token);
  localStorage.setItem(getStorageKey(userType, "refreshToken"), authData.refreshToken || "");
  localStorage.setItem(getStorageKey(userType, "user"), JSON.stringify(authData.user));
  localStorage.setItem(getStorageKey(userType, "loginTime"), new Date().getTime());
  
  // Set current active user type
  localStorage.setItem(`${BLUTO_PREFIX}currentUserType`, userType);
};

/**
 * Get authentication data for a specific user type
 */
export const getAuth = (userType) => {
  const token = localStorage.getItem(getStorageKey(userType, "token"));
  const refreshToken = localStorage.getItem(getStorageKey(userType, "refreshToken"));
  const user = localStorage.getItem(getStorageKey(userType, "user"));

  if (!token) return null;

  return {
    userType,
    token,
    refreshToken: refreshToken || null,
    user: user ? JSON.parse(user) : null
  };
};

/**
 * Get current active user authentication
 */
export const getCurrentAuth = () => {
  const currentUserType = localStorage.getItem(`${BLUTO_PREFIX}currentUserType`);
  
  if (!currentUserType) return null;

  return getAuth(currentUserType);
};

/**
 * Check if user is authenticated for specific type
 */
export const isAuthenticated = (userType) => {
  const token = localStorage.getItem(getStorageKey(userType, "token"));
  return !!token;
};

/**
 * Check if any user type is authenticated
 */
export const isAnyAuthenticated = () => {
  return Object.values(USER_TYPES).some(userType => isAuthenticated(userType));
};

/**
 * Get all authenticated user types
 */
export const getAuthenticatedUserTypes = () => {
  return Object.values(USER_TYPES).filter(userType => isAuthenticated(userType));
};

/**
 * Logout specific user type
 */
export const logout = (userType) => {
  localStorage.removeItem(getStorageKey(userType, "token"));
  localStorage.removeItem(getStorageKey(userType, "refreshToken"));
  localStorage.removeItem(getStorageKey(userType, "user"));
  localStorage.removeItem(getStorageKey(userType, "loginTime"));

  // If this was the active user, clear it
  if (localStorage.getItem(`${BLUTO_PREFIX}currentUserType`) === userType) {
    localStorage.removeItem(`${BLUTO_PREFIX}currentUserType`);
  }
};

/**
 * Logout all user types
 */
export const logoutAll = () => {
  Object.values(USER_TYPES).forEach(userType => {
    logout(userType);
  });
};

/**
 * Switch to different user account
 */
export const switchUserType = (userType) => {
  if (!isAuthenticated(userType)) {
    throw new Error(`User type ${userType} is not authenticated`);
  }
  localStorage.setItem(`${BLUTO_PREFIX}currentUserType`, userType);
};

/**
 * Update user data for a specific type
 */
export const updateUserData = (userType, userData) => {
  localStorage.setItem(getStorageKey(userType, "user"), JSON.stringify(userData));
};

/**
 * Get redirect path based on user type
 */
export const getRedirectPath = (userType) => {
  const paths = {
    [USER_TYPES.SUPERADMIN]: "/superadmin/dashboard",
    [USER_TYPES.MANAGER]: "/manager/dashboard",
    [USER_TYPES.STUDENT]: "/student/dashboard"
  };
  return paths[userType] || "/";
};

/**
 * Get login path based on user type
 */
export const getLoginPath = (userType) => {
  const paths = {
    [USER_TYPES.SUPERADMIN]: "/auth/superadmin/login",
    [USER_TYPES.MANAGER]: "/auth/manager/login",
    [USER_TYPES.STUDENT]: "/auth/student/login"
  };
  return paths[userType] || "/auth/student/login";
};

/**
 * ============================================
 * CONVENIENCE FUNCTIONS FOR EASY USE
 * ============================================
 */

/**
 * Get current user's token
 * @returns {string|null} JWT token or null
 */
export const getToken = () => {
  const currentAuth = getCurrentAuth();
  return currentAuth?.token || null;
};

/**
 * Get current user's role/type
 * @returns {string|null} 'student', 'manager', 'superadmin', or null
 */
export const getRole = () => {
  const currentAuth = getCurrentAuth();
  return currentAuth?.userType || null;
};

/**
 * Get current user's full data
 * @returns {Object|null} User object or null
 */
export const getUserData = () => {
  const currentAuth = getCurrentAuth();
  return currentAuth?.user || null;
};

/**
 * Get current user type
 * @returns {string|null} 'student', 'manager', 'superadmin', or null
 */
export const getCurrentUserType = () => {
  return localStorage.getItem(`${BLUTO_PREFIX}currentUserType`) || null;
};

/**
 * Check if user is logged in
 * @returns {boolean} True if any user is authenticated
 */
export const isLoggedIn = () => {
  return getCurrentAuth() !== null;
};

/**
 * Check if current user is a student
 * @returns {boolean}
 */
export const isStudent = () => {
  return getCurrentUserType() === USER_TYPES.STUDENT;
};

/**
 * Check if current user is a manager
 * @returns {boolean}
 */
export const isManager = () => {
  return getCurrentUserType() === USER_TYPES.MANAGER;
};

/**
 * Check if current user is a superadmin
 * @returns {boolean}
 */
export const isSuperAdmin = () => {
  return getCurrentUserType() === USER_TYPES.SUPERADMIN;
};

/**
 * Check if current user has specific role
 * @param {string} role - Role to check against
 * @returns {boolean}
 */
export const hasRole = (role) => {
  return getCurrentUserType() === role;
};

/**
 * Check if current user has any of the specified roles
 * @param {string[]} roles - Array of roles to check
 * @returns {boolean}
 */
export const hasAnyRole = (roles = []) => {
  const currentRole = getCurrentUserType();
  return roles.includes(currentRole);
};

/**
 * Get all user data for current user
 * @returns {Object|null} { userType, token, refreshToken, user, loginTime }
 */
export const getCurrentUser = () => {
  const auth = getCurrentAuth();
  if (!auth) return null;

  return {
    ...auth,
    loginTime: localStorage.getItem(getStorageKey(auth.userType, "loginTime"))
  };
};

/**
 * Get user data for specific user type
 * @param {string} userType - 'student', 'manager', or 'superadmin'
 * @returns {Object|null}
 */
export const getUserByType = (userType) => {
  return getAuth(userType);
};

/**
 * Get token for specific user type
 * @param {string} userType - 'student', 'manager', or 'superadmin'
 * @returns {string|null}
 */
export const getTokenForRole = (userType) => {
  return localStorage.getItem(getStorageKey(userType, "token")) || null;
};

/**
 * Logout current user
 */
export const logoutCurrent = () => {
  const currentUserType = getCurrentUserType();
  if (currentUserType) {
    logout(currentUserType);
  }
};

/**
 * Logout current user and redirect
 * @param {string} redirectPath - Path to redirect after logout
 */
export const logoutAndRedirect = (redirectPath = "/") => {
  logoutCurrent();
  window.location.href = redirectPath;
};

/**
 * Set current active user (must be authenticated)
 * @param {string} userType - User type to set as active
 */
export const setCurrentUser = (userType) => {
  switchUserType(userType);
};

/**
 * Clear all authentication data
 */
export const clearAllAuth = () => {
  logoutAll();
};

/**
 * Get login time of current user
 * @returns {number|null} Timestamp in milliseconds
 */
export const getLoginTime = () => {
  const currentUserType = getCurrentUserType();
  if (!currentUserType) return null;
  const time = localStorage.getItem(getStorageKey(currentUserType, "loginTime"));
  return time ? parseInt(time) : null;
};

/**
 * Get time since login in seconds
 * @returns {number|null} Seconds since login
 */
export const getTimeSinceLogin = () => {
  const loginTime = getLoginTime();
  if (!loginTime) return null;
  return Math.floor((Date.now() - loginTime) / 1000);
};

/**
 * Check if user has been logged in for more than X minutes
 * @param {number} minutes - Minutes to check
 * @returns {boolean}
 */
export const isLoggedInForMoreThan = (minutes) => {
  const timeSince = getTimeSinceLogin();
  if (timeSince === null) return false;
  return timeSince > minutes * 60;
};

/**
 * Refresh/update current user's auth data
 * @param {Object} newAuthData - New auth data to merge
 */
export const refreshCurrentAuth = (newAuthData) => {
  const currentUserType = getCurrentUserType();
  if (!currentUserType) return false;

  const currentAuth = getAuth(currentUserType);
  if (!currentAuth) return false;

  saveAuth(currentUserType, {
    token: newAuthData.token || currentAuth.token,
    refreshToken: newAuthData.refreshToken || currentAuth.refreshToken,
    user: newAuthData.user || currentAuth.user
  });

  return true;
};

/**
 * Update current user's token (useful for token refresh)
 * @param {string} newToken - New JWT token
 */
export const updateToken = (newToken) => {
  const currentUserType = getCurrentUserType();
  if (!currentUserType) return false;

  const token = getStorageKey(currentUserType, "token");
  localStorage.setItem(token, newToken);
  return true;
};

/**
 * Get all active sessions (logged-in users)
 * @returns {Array} Array of user objects for all logged-in users
 */
export const getAllActiveSessions = () => {
  return getAuthenticatedUserTypes().map(userType => ({
    userType,
    auth: getAuth(userType)
  }));
};

/**
 * Simple login function (backward compatible)
 * @param {string} token - JWT token
 * @param {string} role - User role ('student', 'manager', 'superadmin')
 */
export const login = (token, role) => {
  const userType = Object.values(USER_TYPES).find(
    type => type === role || (role && role.toLowerCase().includes(type))
  ) || role;

  saveAuth(userType, {
    token,
    refreshToken: "",
    user: { role }
  });
};

/**
 * Simple logout function (backward compatible)
 */
export const logoutSimple = () => {
  logoutCurrent();
};

export default {
  // User Types
  USER_TYPES,
  
  // Core Auth Functions
  saveAuth,
  getAuth,
  getCurrentAuth,
  isAuthenticated,
  isAnyAuthenticated,
  getAuthenticatedUserTypes,
  logout,
  logoutAll,
  switchUserType,
  updateUserData,
  getRedirectPath,
  getLoginPath,
  
  // Convenience Functions
  getToken,
  getRole,
  getUserData,
  getCurrentUserType,
  isLoggedIn,
  isStudent,
  isManager,
  isSuperAdmin,
  hasRole,
  hasAnyRole,
  getCurrentUser,
  getUserByType,
  getTokenForRole,
  logoutCurrent,
  logoutAndRedirect,
  setCurrentUser,
  clearAllAuth,
  getLoginTime,
  getTimeSinceLogin,
  isLoggedInForMoreThan,
  refreshCurrentAuth,
  updateToken,
  getAllActiveSessions,
  login,
  logoutSimple
};