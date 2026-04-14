/**
 * Enhanced API Service
 * Provides unified CRUD methods for all endpoints
 * Includes filtering, sorting, pagination
 * supports all roles: Student, Manager, SuperAdmin
 */

import { API } from './api';

// Helper function to build query params
const buildParams = (filters = {}) => {
  const params = {};
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'all') {
      params[key] = value;
    }
  });

  return params;
};

// ==================== PROBLEMS API ====================
export const problemsApi = {
  // Get all problems with filters
  getProblems: async (filters = {}) => {
    try {
      const params = buildParams({
        page: filters.page || 1,
        limit: filters.limit || 10,
        difficulty: filters.difficulty,
        category: filters.category,
        status: filters.status,
        search: filters.search,
        sortBy: filters.sortBy || 'createdAt',
        sortOrder: filters.sortOrder || 'desc'
      });
      return await API.get('/problems', { params });
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get student problems
  getStudentProblems: async (filters = {}) => {
    try {
      const params = buildParams(filters);
      return await API.get('/student/problems', { params });
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get manager's problems
  getManagerProblems: async (filters = {}) => {
    try {
      const params = buildParams(filters);
      return await API.get('/manager/problems', { params });
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single problem
  getProblem: async (id) => {
    try {
      return await API.get(`/problems/${id}`);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create problem (Manager/Admin)
  createProblem: async (data) => {
    try {
      return await API.post('/problems', data);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update problem (Owner/Admin)
  updateProblem: async (id, data) => {
    try {
      return await API.put(`/problems/${id}`, data);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete problem
  deleteProblem: async (id) => {
    try {
      return await API.delete(`/problems/${id}`);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Bulk delete problems
  deleteBulk: async (ids) => {
    try {
      return await API.post('/problems/bulk-delete', { ids });
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// ==================== EVENTS API ====================
export const eventsApi = {
  // Get all events
  getEvents: async (filters = {}) => {
    try {
      const params = buildParams({
        page: filters.page || 1,
        limit: filters.limit || 10,
        status: filters.status,
        category: filters.category,
        search: filters.search,
        sortBy: filters.sortBy || 'startDate',
        sortOrder: filters.sortOrder || 'asc'
      });
      return await API.get('/events', { params });
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get student's events
  getStudentEvents: async (filters = {}) => {
    try {
      const params = buildParams(filters);
      return await API.get('/student/events', { params });
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get manager's events
  getManagerEvents: async (filters = {}) => {
    try {
      const params = buildParams(filters);
      return await API.get('/manager/events/created', { params });
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single event
  getEvent: async (id) => {
    try {
      return await API.get(`/events/${id}`);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create event (Manager/Admin)
  createEvent: async (data) => {
    try {
      return await API.post('/events', data);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update event
  updateEvent: async (id, data) => {
    try {
      return await API.put(`/events/${id}`, data);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete event
  deleteEvent: async (id) => {
    try {
      return await API.delete(`/events/${id}`);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Register for event (Student)
  registerForEvent: async (eventId) => {
    try {
      return await API.post(`/submissions/events/${eventId}/register`);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Start event participation
  startEvent: async (eventId) => {
    try {
      return await API.post(`/submissions/events/${eventId}/start`);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // End event participation (Student)
  endEvent: async (eventId) => {
    try {
      return await API.post(`/submissions/events/${eventId}/end`);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Start working on a problem in an event (Student)
  startProblem: async (eventId, problemId) => {
    try {
      return await API.post(`/submissions/events/${eventId}/problems/${problemId}/start`);
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// ==================== SUBMISSIONS API ====================
export const submissionsApi = {
  // Get submissions with filters
  getSubmissions: async (filters = {}) => {
    try {
      const params = buildParams({
        page: filters.page || 1,
        limit: filters.limit || 10,
        status: filters.status,
        problemId: filters.problemId,
        eventId: filters.eventId,
        search: filters.search,
        sortBy: filters.sortBy || 'submittedAt',
        sortOrder: filters.sortOrder || 'desc'
      });
      return await API.get('/submissions', { params });
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get student submissions
  getStudentSubmissions: async (filters = {}) => {
    try {
      const params = buildParams(filters);
      return await API.get('/student/submissions', { params });
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get manager submissions
  getManagerSubmissions: async (filters = {}) => {
    try {
      const params = buildParams(filters);
      return await API.get('/manager/submissions', { params });
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single submission
  getSubmission: async (id) => {
    try {
      return await API.get(`/submissions/${id}`);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Submit solution
  submit: async (data) => {
    try {
      return await API.post('/submissions', data);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Run tests
  runTests: async (data) => {
    try {
      return await API.post('/submissions/run-tests', data);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Track tab switch for anti-cheat
  trackTabSwitch: async (submissionId) => {
    try {
      return await API.post(`/submissions/problem-submissions/${submissionId}/tab-switch`);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Track paste attempt for anti-cheat
  trackPasteAttempt: async (submissionId) => {
    try {
      return await API.post(`/submissions/problem-submissions/${submissionId}/paste-attempt`);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Run code (for code editor / sandbox)
  run: async (data) => {
    try {
      return await API.post('/submissions/run', data);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Run tests for events
  runEventTests: async (data) => {
    try {
      return await API.post('/submissions/event/run', data);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Submit problem in event
  submitEventProblem: async (data) => {
    try {
      return await API.post('/submissions/event/submit', data);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Practice mode submission
  submitPractice: async (data) => {
    try {
      return await API.post('/submissions/practice/submit', data);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Sandbox execution
  sandboxRun: async (data) => {
    try {
      return await API.post('/submissions/sandbox/run', data);
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// ==================== USERS API (SuperAdmin) ====================
export const usersApi = {
  // Get all users
  getUsers: async (filters = {}) => {
    try {
      const params = buildParams({
        page: filters.page || 1,
        limit: filters.limit || 20,
        role: filters.role,
        status: filters.status,
        search: filters.search,
        sortBy: filters.sortBy || 'createdAt',
        sortOrder: filters.sortOrder || 'desc'
      });
      return await API.get('/admin/users', { params });
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get students
  getStudents: async (filters = {}) => {
    try {
      const params = buildParams(filters);
      return await API.get('/admin/users/students', { params });
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get managers
  getManagers: async (filters = {}) => {
    try {
      const params = buildParams(filters);
      return await API.get('/admin/users/managers', { params });
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single user
  getUser: async (id) => {
    try {
      return await API.get(`/admin/users/${id}`);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create user
  createUser: async (data) => {
    try {
      return await API.post('/admin/users', data);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update user
  updateUser: async (id, data) => {
    try {
      return await API.put(`/admin/users/${id}`, data);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete user
  deleteUser: async (id) => {
    try {
      return await API.delete(`/admin/users/${id}`);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Bulk delete users
  deleteBulk: async (ids) => {
    try {
      return await API.post('/admin/users/bulk-delete', { ids });
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Change user status
  changeStatus: async (id, status) => {
    try {
      return await API.patch(`/admin/users/${id}/status`, { status });
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// ==================== PAYMENTS API ====================
export const paymentsApi = {
  // Get payments
  getPayments: async (filters = {}) => {
    try {
      const params = buildParams({
        page: filters.page || 1,
        limit: filters.limit || 20,
        status: filters.status,
        userId: filters.userId,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        sortBy: filters.sortBy || 'createdAt',
        sortOrder: filters.sortOrder || 'desc'
      });
      return await API.get('/admin/payments', { params });
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single payment
  getPayment: async (id) => {
    try {
      return await API.get(`/admin/payments/${id}`);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Process refund
  refund: async (id, data) => {
    try {
      return await API.post(`/admin/payments/${id}/refund`, data);
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// ==================== CERTIFICATES API ====================
export const certificatesApi = {
  // Get certificates
  getCertificates: async (filters = {}) => {
    try {
      const params = buildParams({
        page: filters.page || 1,
        limit: filters.limit || 20,
        status: filters.status,
        userId: filters.userId,
        eventId: filters.eventId,
        sortBy: filters.sortBy || 'issuedDate',
        sortOrder: filters.sortOrder || 'desc'
      });
      return await API.get('/certificates', { params });
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get student certificates
  getStudentCertificates: async (filters = {}) => {
    try {
      const params = buildParams(filters);
      return await API.get('/student/certificates', { params });
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single certificate
  getCertificate: async (id) => {
    try {
      return await API.get(`/certificates/${id}`);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create certificate template (Admin)
  createTemplate: async (data) => {
    try {
      return await API.post('/admin/certificates/templates', data);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Assign certificate
  assignCertificate: async (data) => {
    try {
      return await API.post('/admin/certificates/assign', data);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Download certificate
  downloadCertificate: async (id) => {
    try {
      return await API.get(`/certificates/${id}/download`, {
        responseType: 'blob'
      });
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// ==================== REPORTS API ====================
export const reportsApi = {
  // Get reports
  getReports: async (filters = {}) => {
    try {
      const params = buildParams({
        page: filters.page || 1,
        limit: filters.limit || 20,
        type: filters.type,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        sortBy: filters.sortBy || 'createdAt',
        sortOrder: filters.sortOrder || 'desc'
      });
      return await API.get('/admin/reports', { params });
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get dashboard metrics
  getDashboardMetrics: async () => {
    try {
      return await API.get('/admin/reports/dashboard-metrics');
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user activity report
  getUserActivityReport: async (filters = {}) => {
    try {
      const params = buildParams(filters);
      return await API.get('/admin/reports/user-activity', { params });
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get event performance report
  getEventPerformanceReport: async (filters = {}) => {
    try {
      const params = buildParams(filters);
      return await API.get('/admin/reports/event-performance', { params });
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Export report
  exportReport: async (type, format = 'csv') => {
    try {
      return await API.get(`/admin/reports/export`, {
        params: { type, format },
        responseType: 'blob'
      });
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// ==================== LEADERBOARD API ====================
export const leaderboardApi = {
  // Get global leaderboard
  getGlobalLeaderboard: async (filters = {}) => {
    try {
      const params = buildParams({
        page: filters.page || 1,
        limit: filters.limit || 20,
        timeframe: filters.timeframe || 'all' // all, month, week
      });
      return await API.get('/leaderboard/global', { params });
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get event leaderboard
  getEventLeaderboard: async (eventId, filters = {}) => {
    try {
      const params = buildParams({
        page: filters.page || 1,
        limit: filters.limit || 20
      });
      return await API.get(`/leaderboard/event/${eventId}`, { params });
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user rank
  getUserRank: async () => {
    try {
      return await API.get('/leaderboard/my-rank');
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// ==================== PROFILE API ====================
export const profileApi = {
  // Get current user profile
  getProfile: async () => {
    try {
      return await API.get('/profile');
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update profile
  updateProfile: async (data) => {
    try {
      return await API.put('/profile', data);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Change password
  changePassword: async (data) => {
    try {
      return await API.post('/profile/change-password', data);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Upload avatar
  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      return await API.post('/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// ==================== MANAGER ANALYTICS API ====================
export const analyticsApi = {
  // Get dashboard analytics
  getDashboardAnalytics: async () => {
    try {
      return await API.get('/manager/analytics/dashboard');
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get event analytics
  getEventAnalytics: async (eventId) => {
    try {
      return await API.get(`/manager/analytics/event/${eventId}`);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get problem statistics
  getProblemStats: async (filters = {}) => {
    try {
      const params = buildParams(filters);
      return await API.get('/manager/analytics/problem-stats', { params });
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get student engagement
  getStudentEngagement: async (eventId) => {
    try {
      return await API.get(`/manager/analytics/engagement/${eventId}`);
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// ==================== CONTACT API ====================
export const contactApi = {
  // Get contacts (Admin)
  getContacts: async (filters = {}) => {
    try {
      const params = buildParams({
        page: filters.page || 1,
        limit: filters.limit || 20,
        status: filters.status,
        sortBy: filters.sortBy || 'createdAt',
        sortOrder: filters.sortOrder || 'desc'
      });
      return await API.get('/admin/contacts', { params });
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Submit contact form
  submitContact: async (data) => {
    try {
      return await API.post('/contact', data);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Reply to contact
  replyContact: async (id, data) => {
    try {
      return await API.post(`/admin/contacts/${id}/reply`, data);
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// ==================== ACTIVITY LOG API ====================
export const activityLogApi = {
  // Get activity logs
  getActivityLogs: async (filters = {}) => {
    try {
      const params = buildParams({
        page: filters.page || 1,
        limit: filters.limit || 50,
        userId: filters.userId,
        action: filters.action,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        sortBy: 'timestamp',
        sortOrder: 'desc'
      });
      return await API.get('/admin/activity-logs', { params });
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// ==================== STUDENT API ====================
export const studentApi = {
  // Get student profile
  getProfile: async () => {
    try {
      return await API.get('/student/profile');
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update student profile
  updateProfile: async (data) => {
    try {
      return await API.put('/student/profile', data);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get my events
  getMyEvents: async () => {
    try {
      return await API.get('/student/myEvents');
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get specific event detail
  getEvent: async (eventId) => {
    try {
      return await API.get(`/student/event/${eventId}`);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get event timer
  getEventTimer: async (eventId) => {
    try {
      return await API.get(`/student/event/${eventId}/timer`);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get event leaderboard
  getEventLeaderboard: async (eventId) => {
    try {
      return await API.get(`/student/event/${eventId}/leaderboard`);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get problem in event context
  getEventProblem: async (eventId, problemId) => {
    try {
      return await API.get(`/student/event/${eventId}/problem/${problemId}`);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get problems for an event
  getEventProblems: async (eventId) => {
    try {
      return await API.get(`/student/event/${eventId}/problems`);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get practice problem
  getPracticeProblem: async (problemId) => {
    try {
      return await API.get(`/student/practice/problem/${problemId}`);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single problem
  getProblem: async (problemId) => {
    try {
      return await API.get(`/student/problem/${problemId}`);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Register for event
  registerForEvent: async (eventId) => {
    try {
      return await API.post(`/student/event/register/${eventId}`);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Start event
  startEvent: async (eventId) => {
    try {
      return await API.post(`/student/event/start/${eventId}`);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // End event
  endEvent: async (eventId) => {
    try {
      return await API.put(`/student/event/end/${eventId}`);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get certificates
  getCertificates: async () => {
    try {
      return await API.get('/student/certificates');
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get payment history
  getPaymentHistory: async () => {
    try {
      return await API.get('/student/payments');
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get leaderboard
  getLeaderboard: async () => {
    try {
      return await API.get('/student/leaderboard');
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user rank
  getUserRank: async () => {
    try {
      return await API.get('/student/rank');
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get points summary
  getPointsSummary: async () => {
    try {
      return await API.get('/student/points');
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// ==================== ACTIVITY INTENSITY API ====================
export const activityIntensityApi = {
  // Get current intensity
  getCurrentIntensity: async () => {
    try {
      return await API.get('/activity-intensity/current');
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get activity analysis
  getActivityAnalysis: async (days = 30) => {
    try {
      return await API.get(`/activity-intensity/analysis?days=${days}`);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get history
  getHistory: async () => {
    try {
      return await API.get('/activity-intensity/history');
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get patterns
  getPatterns: async () => {
    try {
      return await API.get('/activity-intensity/patterns');
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get login streak
  getLoginStreak: async () => {
    try {
      return await API.get('/activity-intensity/streak');
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get comparison with peers
  getComparison: async () => {
    try {
      return await API.get('/activity-intensity/comparison');
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default {
  problemsApi,
  eventsApi,
  submissionsApi,
  usersApi,
  paymentsApi,
  certificatesApi,
  reportsApi,
  leaderboardApi,
  profileApi,
  analyticsApi,
  contactApi,
  activityLogApi,
  studentApi,
  activityIntensityApi
};
