/**
 * Bluto Authentication Utility
 * Handles secure localStorage with "bluto" prefix for multiple user types
 * Supports: Student, Manager, SuperAdmin
 */

const BLUTO_PREFIX = "bluto_";
const USER_TYPES = {
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
  localStorage.setItem(getStorageKey(userType, "refreshToken"), authData.refreshToken);
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
    refreshToken,
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
    [USER_TYPES.SUPERADMIN]: "/login/superadmin",
    [USER_TYPES.MANAGER]: "/login/manager",
    [USER_TYPES.STUDENT]: "/login/student"
  };
  return paths[userType] || "/login/student";
};

export default {
  USER_TYPES,
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
  getLoginPath
};
