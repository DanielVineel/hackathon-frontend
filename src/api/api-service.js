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
      return await API.get('/manager/events', { params });
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
      return await API.post(`/events/${eventId}/register`);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Start event
  startEvent: async (eventId) => {
    try {
      return await API.post(`/events/${eventId}/start`);
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
  activityLogApi
};
