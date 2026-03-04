import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Your backend URL
});

export const studentLogin = (data) => api.post('/students/login', data);
export const studentSignup = (data) => api.post('/students/signup', data);
export const managerLogin = (data) => api.post('/manager/login', data);
export const superAdminLogin = (data) => api.post('/superadmin/login', data);
export const getEvents = () => api.get('/events');
export const getParticipatedEvents = () => api.get('/students/participated-events');

export default api;