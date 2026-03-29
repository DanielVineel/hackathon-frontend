import { API } from './api';

/**
 * Points API Service
 */
export const pointsAPI = {
  getSummary: (userId) => API.get('/points/summary', { params: { userId } }),
  getHistory: (page = 1, limit = 20) =>
    API.get('/points/history', { params: { page, limit } }),
  getLeaderboard: (limit = 50, offset = 0) =>
    API.get('/points/leaderboard', { params: { limit, offset } }),
  getUserRank: (userId) => API.get('/points/rank', { params: { userId } }),
  addPoints: (data) => API.post('/points/add', data),
  deductPoints: (data) => API.post('/points/deduct', data),
  batchAddPoints: (operations) => API.post('/points/batch', { operations }),
  resetUserPoints: (userId) => API.post('/points/reset', { userId })
};

/**
 * Calendar API Service
 */
export const calendarAPI = {
  createEvent: (eventData) => API.post('/calendar', eventData),
  getEvents: (params) => API.get('/calendar', { params }),
  getEventById: (eventId) => API.get(`/calendar/${eventId}`),
  updateEvent: (eventId, updates) => API.put(`/calendar/${eventId}`, updates),
  deleteEvent: (eventId) => API.delete(`/calendar/${eventId}`),
  getUpcomingEvents: (days = 7, userId) =>
    API.get('/calendar/upcoming', { params: { days, userId } }),
  getMonthView: (month, year, userId) =>
    API.get('/calendar/month-view', { params: { month, year, userId } }),
  getCalendarSummary: (userId) =>
    API.get('/calendar/summary', { params: { userId } }),
  addParticipant: (eventId, participantData) =>
    API.post(`/calendar/${eventId}/participants`, participantData),
  updateParticipantStatus: (eventId, participantId, statusData) =>
    API.put(`/calendar/${eventId}/participants/${participantId}`, statusData),
  removeParticipant: (eventId, participantId) =>
    API.delete(`/calendar/${eventId}/participants/${participantId}`),
  bulkUploadEvents: (events) =>
    API.post('/calendar/bulk/upload', { events })
};

/**
 * Login Activity API Service
 */
export const loginActivityAPI = {
  recordLogin: (loginData) => API.post('/login-activity/record-login', loginData),
  recordLogout: (logoutData) =>
    API.post('/login-activity/record-logout', logoutData),
  getUserLoginHistory: (params) =>
    API.get('/login-activity/history', { params }),
  getActiveSessions: () => API.get('/login-activity/active-sessions'),
  terminateSession: (sessionId) =>
    API.post('/login-activity/terminate-session', { sessionId }),
  getLoginActivitySummary: (params) =>
    API.get('/login-activity/summary', { params }),
  getLoginTrends: (params) => API.get('/login-activity/trends', { params }),
  detectSuspiciousActivities: (params) =>
    API.get('/login-activity/suspicious', { params })
};

/**
 * Activity Intensity API Service
 */
export const activityIntensityAPI = {
  getCurrentIntensity: (userId) =>
    API.get('/activity-intensity/current', { params: { userId } }),
  getActivityAnalysis: (params) =>
    API.get('/activity-intensity/analysis', { params }),
  getIntensityHistory: (params) =>
    API.get('/activity-intensity/history', { params }),
  getActivityPatterns: (params) =>
    API.get('/activity-intensity/patterns', { params }),
  getLoginStreak: (params) =>
    API.get('/activity-intensity/streak', { params }),
  getComparisonWithPeers: () =>
    API.get('/activity-intensity/comparison'),
  updateIntensityMetrics: (userId) =>
    API.post('/activity-intensity/update', { userId })
};

/**
 * Helper functions for common operations
 */
export const saasAPI = {
  // Points helpers
  async getUserPoints(userId = null) {
    try {
      const res = await pointsAPI.getSummary(userId);
      return res.data;
    } catch (error) {
      console.error('Error fetching user points:', error);
      throw error;
    }
  },

  async getTopLeaderboard(limit = 10) {
    try {
      const res = await pointsAPI.getLeaderboard(limit, 0);
      return res.data.leaderboard;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  },

  // Calendar helpers
  async getUserCalendarEvents(startDate, endDate) {
    try {
      const res = await calendarAPI.getEvents({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });
      return res.data.events;
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
  },

  async getUpcomingCalendarEvents(days = 7) {
    try {
      const res = await calendarAPI.getUpcomingEvents(days);
      return res.data.events;
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      throw error;
    }
  },

  // Login Activity helpers
  async getUserLoginHistory(days = 30, limit = 50) {
    try {
      const res = await loginActivityAPI.getUserLoginHistory({
        days,
        limit,
        page: 1
      });
      return res.data.loginHistory;
    } catch (error) {
      console.error('Error fetching login history:', error);
      throw error;
    }
  },

  async getActiveUserSessions() {
    try {
      const res = await loginActivityAPI.getActiveSessions();
      return res.data.activeSessions;
    } catch (error) {
      console.error('Error fetching active sessions:', error);
      throw error;
    }
  },

  // Activity Intensity helpers
  async getUserActivityIntensity() {
    try {
      const res = await activityIntensityAPI.getCurrentIntensity();
      return res.data;
    } catch (error) {
      console.error('Error fetching activity intensity:', error);
      throw error;
    }
  },

  async getUserActivityAnalysis(days = 30) {
    try {
      const res = await activityIntensityAPI.getActivityAnalysis({ days });
      return res.data;
    } catch (error) {
      console.error('Error fetching activity analysis:', error);
      throw error;
    }
  },

  // Dashboard summary
  async getDashboardSummary() {
    try {
      const [points, intensity, upcomingEvents] = await Promise.all([
        pointsAPI.getSummary(),
        activityIntensityAPI.getCurrentIntensity(),
        calendarAPI.getUpcomingEvents(7)
      ]);

      return {
        points: points.data,
        intensity: intensity.data,
        upcomingEvents: upcomingEvents.data.events
      };
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error;
    }
  }
};

export default {
  pointsAPI,
  calendarAPI,
  loginActivityAPI,
  activityIntensityAPI,
  saasAPI
};
