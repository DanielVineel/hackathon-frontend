// src/utils/auth.js

export const isAuthenticated = () => {
  const token = localStorage.getItem("bluto-hack-token");
  return !!token;
  
};

export const getRole = () => {
  return localStorage.getItem("bluto-hack-role"); // 'student', 'manager', 'superadmin'
};

export const login = (token, role) => {
  localStorage.setItem("bluto-hack-token", token);
  localStorage.setItem("bluto-hack-role", role);
};

export const logout = () => {
  localStorage.removeItem("bluto-hack-token");
  localStorage.removeItem("bluto-hack-role");
};

