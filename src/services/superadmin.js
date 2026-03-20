// src/services/api.js

import API from "../api/api";

// Auth
export const studentLogin = (data) => API.post("/auth/login/student", data);
export const studentSignup = (data) => API.post("/auth/signup/students", data);
export const managerLogin = (data) => API.post("/auth/login/manager", data);
export const managerSignup = (data) => API.post("/auth/signup/students", data);
export const superAdminLogin = (data) => API.post("/auth/login/superadmin", data);
export const superAdminSignup = (data) => API.post("/auth/signup/students", data);



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

