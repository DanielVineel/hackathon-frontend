// src/utils/auth.js

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

export const getRole = () => {
  return localStorage.getItem("role"); // 'student', 'manager', 'superadmin'
};

export const login = (token, role) => {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};

