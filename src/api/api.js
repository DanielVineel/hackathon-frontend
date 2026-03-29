import axios from "axios";
import { getCurrentAuth, logout, saveAuth } from "../utils/blutoAuth";

/**
 * Secure API Instance with Bluto Authentication
 * Supports multiple user types: Student, Manager, SuperAdmin
 * Handles token refresh automatically
 */
export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});

/**
 * Request interceptor - Adds auth token and user type to all requests
 */
API.interceptors.request.use(
  (config) => {
    const auth = getCurrentAuth();
    
    if (auth?.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
      // Send user type to backend
      config.headers["X-User-Type"] = auth.userType;
      // Send user ID if available
      if (auth.user?.id) {
        config.headers["X-User-ID"] = auth.user.id;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Handles 401/403 errors and token refresh
 */
API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - Try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const auth = getCurrentAuth();
      
      if (auth?.refreshToken) {
        try {
          // Create a new axios instance without interceptors to avoid infinite loops
          const refreshAPI = axios.create({
            baseURL: API.defaults.baseURL,
            timeout: 10000
          });

          const res = await refreshAPI.post("/auth/refresh-token", {
            refreshToken: auth.refreshToken,
            userType: auth.userType
          });

          if (res.data?.success) {
            // Update auth with new tokens
            saveAuth(auth.userType, {
              token: res.data.token,
              refreshToken: res.data.refreshToken,
              user: auth.user
            });

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${res.data.token}`;
            return API(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed, logout user
          if (auth?.userType) {
            logout(auth.userType);
          }
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token available
        const auth = getCurrentAuth();
        if (auth?.userType) {
          logout(auth.userType);
        }
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error("Access forbidden:", error.response.data?.message || "You don't have permission to access this resource");
    }

    // Handle 429 Rate Limited
    if (error.response?.status === 429) {
      console.error("Rate limited. Please try again later.");
      error.message = "Too many requests. Please try again later.";
    }

    // Handle network errors
    if (!error.response) {
      console.error("Network error:", error.message);
      error.message = "Network error. Please check your connection.";
    }

    return Promise.reject(error);
  }
);

export default API;