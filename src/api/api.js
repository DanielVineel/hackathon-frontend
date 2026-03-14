import axios from "axios";
import { getToken, logout } from "../utils/auth";

// Create axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true, // needed for refresh token cookie
});

// Attach access token
API.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle errors globally
API.interceptors.response.use(
  (response) => response,
  async (error) => {

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {

      originalRequest._retry = true;

      try {

        const res = await API.post("/auth/refresh");

        const newAccessToken = res.data.accessToken;

        localStorage.setItem("bluto-hack-token", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return API(originalRequest);

      } catch (refreshError) {

        console.error("Refresh token expired. Login again.");

        logout();
        window.location.href = "/";

      }
    }

    return Promise.reject(error);
  }
);

export default API;