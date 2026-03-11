// src/api/api.js

import axios from "axios";
import store from "../store/store";

// Create axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// Request interceptor (attach token)
API.interceptors.request.use(
  (config) => {
    const token = store.getState().auth?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (handle errors globally)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.error("Unauthorized - Token expired or invalid");
      }

      if (error.response.status === 403) {
        console.error("Forbidden - Access denied");
      }

      if (error.response.status === 500) {
        console.error("Server error");
      }
    }

    return Promise.reject(error);
  }
);

export default API;