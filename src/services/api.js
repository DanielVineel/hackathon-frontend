// src/services/api.js

import API from "../api/api";

// Auth
export const studentLogin = (data) => API.post("/students/login", data);
export const studentSignup = (data) => API.post("/students/signup", data);
export const managerLogin = (data) => API.post("/manager/login", data);
export const superAdminLogin = (data) => API.post("/superadmin/login", data);

// Events
export const getEvents = () => API.get("/events");
export const getParticipatedEvents = () => API.get("/students/participated-events");

export default {
  studentLogin,
  studentSignup,
  managerLogin,
  superAdminLogin,
  getEvents,
  getParticipatedEvents,
};

