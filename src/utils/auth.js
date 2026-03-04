// src/utils/auth.js

export const isAuthenticated = () => {
  const token = localStorage.getItem("accessToken");
  return !!token;
};

export const getRole = () => {
  return localStorage.getItem("role"); // 'student', 'manager', 'superadmin'
};

export const login = (token, role) => {
  localStorage.setItem("accessToken", token);
  localStorage.setItem("role", role);
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("role");
};