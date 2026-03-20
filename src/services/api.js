// src/services/api.js

import API from "../api/api";

// Auth
export const studentLogin = (data) => API.post("/auth/login/student", data);
export const studentSignup = (data) => API.post("/auth/signup/student", data);
export const managerLogin = (data) => API.post("/auth/login/manager", data);
export const managerSignup = (data) => API.post("/auth/signup/manger", data);
export const superAdminLogin = (data) => API.post("/auth/login/superadmin", data);
export const superAdminSignup = (data) => API.post("/auth/signup/superadmin", data);



// Events
export const getEvents = (data) => API.get("/events",data);
export const getEventDetails = (id) => API.get(`/events/${id}`);
export const getEventRegistrationCount = (id) => API.get(`/events/${id}/registrationCount`);



// Problems
export const getProblems = (data) => API.get("/problems",data);


// Payments
export const createPayment = (data) => API.post("/payments/create",data);
export const paymentSuccess = (data) => API.post("/payments/success",data);
export const paymentFailure = (data) => API.post("/payments/failure",data);



// Student
export const getProblemsByEvent = (id) =>API.get(`/student/event/${id}/problems`);
export const getSingleProblem = (id) => API.get(`/student/problem/${id}`);

export const getStudentRegisteredEvents = (id,data) =>API.post(`/student/event/register/${id}`,data);
export const registerForEvent = (id) =>API.post(`/student/event/register/${id}`);
export const startEventAttempt = (id) =>API.post(`/student/event/start/${id}`);
export const endEventAttempt = (id) =>API.put(`/student/event/end/${id}`);

export const getStudentPayments = () =>API.post(`/student/payments`);



// Manager
export const managerCreateEvent = (data) =>API.post(`/manager/event/create`,data);
export const managerUpdateEvent = (id,data) =>API.put(`/manager/event/update/${id}`,data);
export const managerCancelEvent = (id) =>API.put(`/manager/event/cancel/${id}`);
export const managerEventHistory = (data) =>API.get(`/manager/events/created`,data);

export const managerCreateProblem = (data) => API.post(`/manager/problem/create`,data);
export const managerUpdateProblem = (id,data) => API.put(`/manager/problem/update/${id}`,data);
export const managerDeleteProblem = (id) => API.delete(`/manager/problem/delete/${id}`);
export const managerAssignProblem = (data) => API.put(`/manager/event/assignProblem`,data);
export const managerRemoveProblem = (eventId,problemId) => API.delete(`/manager/event/${eventId}/removeProblem/${problemId}`);
export const managerProblemHistory = (data) => API.get(`/manager/problems/created`,data);
export const managerEventProblems = (id,data) =>API.get(`/manager/event/${id}/problems`,data);

export const managerPaymentHistory = (data) => API.get("/manager/payments",data);



// SuperAdmin
export const superadminCreateEvent = (data) =>API.post(`/superadmin/event/create`,data);
export const superadminUpdateEvent = (id,data) =>API.put(`/superadmin/event/update/${id}`,data);
export const superadminDeleteEvent = (id) =>API.put(`/superadmin/event/delete/${id}`);
export const superadminCancelEvent = (id) =>API.put(`/superadmin/event/cancel/${id}`);
export const superadminEventHistory = (data) =>API.get(`/superadmin/events/created`,data);

export const superadminCreateProblem = (data) => API.post(`/superadmin/problem/create`,data);
export const superadminUpdateProblem = (id,data) => API.put(`/superadmin/problem/update/${id}`,data);
export const superadminDeleteProblem = (id) => API.delete(`/superadmin/problem/delete/${id}`);
export const superadminAssignProblem = (data) => API.put(`/superadmin/event/assignProblem`,data);
export const superadminRemoveProblem = (eventId,problemId) => API.delete(`/superadmin/event/${eventId}/removeProblem/${problemId}`);
export const superadminEnableResuableProblem = (id) => API.put(`/superadmin/problem/enableResuable/${id}`);
export const superadminDisableResuableProblem = (id) => API.put(`/superadmin/problem/disableResuable/${id}`);
export const superadminProblemHistory = (data) => API.get(`/superadmin/problems/created`,data);
export const superadminEventProblems = (id,data) =>API.get(`/superadmin/event/${id}/problems`,data);

export const superadminPaymentHistory = (data) => API.get("/superadmin/payments",data);
export const superadminPaymentTotal = (data) => API.get("/superadmin/payments/total",data)

export const superadminGetUsers =(data)=>API.get("/superadmin/users",data);

export default {
  studentLogin,
  studentSignup,
  managerLogin,
  managerSignup,
  superAdminLogin,
  superAdminSignup,


  getEvents,
  getEventDetails,
  getEventRegistrationCount,


  getProblems,


  createPayment,
  paymentSuccess,
  paymentFailure,


  getProblemsByEvent,
  getSingleProblem,

  getStudentRegisteredEvents,
  registerForEvent,
  startEventAttempt,
  endEventAttempt,

  getStudentPayments,


  managerCreateEvent,
  managerUpdateEvent,
  managerCancelEvent,
  managerEventHistory,

  managerCreateProblem,
  managerUpdateProblem,
  managerDeleteProblem,
  managerAssignProblem,
  managerRemoveProblem,
  managerProblemHistory,
  managerEventProblems,

  managerPaymentHistory,


  superadminCreateEvent,
  superadminUpdateEvent,
  superadminDeleteEvent,
  superadminCancelEvent,
  superadminEventHistory,

  superadminCreateProblem,
  superadminUpdateProblem,
  superadminDeleteEvent,
  superadminAssignProblem,
  superadminRemoveProblem,
  superadminEnableResuableProblem,
  superadminDisableResuableProblem,
  superadminProblemHistory,
  superadminEventProblems,

  superadminPaymentHistory,
  superadminPaymentTotal,

  superadminGetUsers,


};

