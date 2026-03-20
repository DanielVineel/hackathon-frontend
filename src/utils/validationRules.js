// src/utils/validationRules.js
// Reusable validation rules and patterns for common forms

export const VALIDATION_RULES = {
  email: {
    required: true,
    type: 'email',
    label: 'Email Address',
    minLength: 5,
    maxLength: 255,
  },

  password: {
    required: true,
    type: 'password',
    minLength: 8,
    label: 'Password',
    errorMessage: 'Password must be at least 8 characters with uppercase, number, and special character',
  },

  confirmPassword: {
    required: true,
    type: 'password',
    label: 'Confirm Password',
  },

  fullName: {
    required: true,
    minLength: 3,
    maxLength: 100,
    label: 'Full Name',
    pattern: /^[a-zA-Z\s'-]+$/,
    errorMessage: 'Full name can only contain letters, spaces, hyphens, and apostrophes',
  },

  username: {
    required: true,
    minLength: 3,
    maxLength: 30,
    label: 'Username',
    pattern: /^[a-zA-Z0-9_-]+$/,
    errorMessage: 'Username can only contain letters, numbers, underscores, and hyphens',
  },

  phone: {
    type: 'phone',
    label: 'Phone Number',
    minLength: 10,
  },

  university: {
    label: 'University/College',
    minLength: 2,
    maxLength: 100,
  },

  organization: {
    label: 'Organization',
    minLength: 2,
    maxLength: 100,
  },

  eventTitle: {
    required: true,
    minLength: 3,
    maxLength: 100,
    label: 'Event Title',
  },

  eventDescription: {
    required: true,
    minLength: 10,
    maxLength: 5000,
    label: 'Event Description',
  },

  problemTitle: {
    required: true,
    minLength: 3,
    maxLength: 100,
    label: 'Problem Title',
  },

  problemDescription: {
    required: true,
    minLength: 20,
    maxLength: 10000,
    label: 'Problem Description',
  },

  code: {
    required: true,
    minLength: 10,
    label: 'Code',
  },
};

/**
 * Form validation rules for specific forms
 */
export const FORM_RULES = {
  /**
   * Student Login Form
   */
  studentLogin: {
    email: VALIDATION_RULES.email,
    password: VALIDATION_RULES.password,
  },

  /**
   * Student Signup Form
   */
  studentSignup: {
    fullName: VALIDATION_RULES.fullName,
    email: VALIDATION_RULES.email,
    phone: VALIDATION_RULES.phone,
    university: VALIDATION_RULES.university,
    password: VALIDATION_RULES.password,
    confirmPassword: VALIDATION_RULES.confirmPassword,
  },

  /**
   * Manager Login Form
   */
  managerLogin: {
    email: VALIDATION_RULES.email,
    password: VALIDATION_RULES.password,
  },

  /**
   * Manager Signup Form
   */
  managerSignup: {
    fullName: VALIDATION_RULES.fullName,
    email: VALIDATION_RULES.email,
    phone: VALIDATION_RULES.phone,
    organization: VALIDATION_RULES.organization,
    password: VALIDATION_RULES.password,
    confirmPassword: VALIDATION_RULES.confirmPassword,
  },

  /**
   * SuperAdmin Login Form
   */
  superadminLogin: {
    email: VALIDATION_RULES.email,
    password: VALIDATION_RULES.password,
  },

  /**
   * Create Event Form
   */
  createEvent: {
    title: VALIDATION_RULES.eventTitle,
    description: VALIDATION_RULES.eventDescription,
    // Additional fields can be added
  },

  /**
   * Create Problem Form
   */
  createProblem: {
    title: VALIDATION_RULES.problemTitle,
    description: VALIDATION_RULES.problemDescription,
    code: VALIDATION_RULES.code,
  },
};

/**
 * Security configuration
 */
export const SECURITY_CONFIG = {
  // Token settings
  TOKEN_EXPIRATION_MINUTES: 15,
  REFRESH_TOKEN_EXPIRATION_DAYS: 7,
  
  // Rate limiting
  LOGIN_ATTEMPTS_LIMIT: 5,
  LOGIN_ATTEMPTS_WINDOW_MS: 60 * 1000, // 60 seconds
  API_RATE_LIMIT: 100,
  API_RATE_LIMIT_WINDOW_MS: 60 * 1000, // 60 seconds
  
  // Password policy
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_NUMBER: true,
  PASSWORD_REQUIRE_SPECIAL_CHAR: true,
  
  // File upload
  MAX_FILE_SIZE_MB: 5,
  ALLOWED_FILE_EXTENSIONS: {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
  },
  
  // Code execution
  CODE_EXECUTION_TIMEOUT_MS: 10000, // 10 seconds
  CODE_EXECUTION_MEMORY_LIMIT_MB: 256,
  
  // Session
  SESSION_TIMEOUT_MS: 30 * 60 * 1000, // 30 minutes
  SESSION_WARNING_MS: 5 * 60 * 1000, // 5 minutes warning
};

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PASSWORD: 'Password does not meet requirements',
  WEAK_PASSWORD: 'Password is too weak',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_URL: 'Please enter a valid URL',
  FILE_TOO_LARGE: 'File size exceeds the maximum allowed',
  INVALID_FILE_TYPE: 'File type is not allowed',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Session expired. Please login again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  EMAIL_ALREADY_EXISTS: 'This email is already registered',
  USERNAME_ALREADY_EXISTS: 'This username is already taken',
  CODE_EXECUTION_TIMEOUT: 'Code execution timed out',
  INVALID_CREDENTIALS: 'Invalid email or password',
};

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'You have been logged in successfully',
  SIGNUP_SUCCESS: 'Your account has been created successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  PROFILE_UPDATED: 'Your profile has been updated',
  EMAIL_VERIFIED: 'Email verified successfully',
  FORM_SUBMITTED: 'Form submitted successfully',
  FILE_UPLOADED: 'File uploaded successfully',
  LOGOUT_SUCCESS: 'You have been logged out',
  EVENT_CREATED: 'Event created successfully',
  PROBLEM_CREATED: 'Problem created successfully',
};

/**
 * Password strength levels
 */
export const PASSWORD_STRENGTH_LEVELS = {
  weak: { score: 1, color: '#EF5350', label: 'Weak' },
  fair: { score: 2, color: '#FFA726', label: 'Fair' },
  good: { score: 3, color: '#FFD54F', label: 'Good' },
  strong: { score: 4, color: '#81C784', label: 'Strong' },
  'very-strong': { score: 5, color: '#66BB6A', label: 'Very Strong' },
};

/**
 * User roles and permissions
 */
export const USER_ROLES = {
  STUDENT: 'student',
  MANAGER: 'manager',
  SUPERADMIN: 'superadmin',
};

export const ROLE_PERMISSIONS = {
  student: {
    viewEvents: true,
    joinEvents: true,
    solveProblem: true,
    viewCertificates: true,
    viewPaymentHistory: true,
    updateProfile: true,
    canCreateEvent: false,
    canCreateProblem: false,
    canManageUsers: false,
  },
  manager: {
    viewEvents: true,
    createEvent: true,
    updateEvent: true,
    deleteEvent: false,
    createProblem: true,
    updateProblem: true,
    viewAnalytics: true,
    updateProfile: true,
    canManageUsers: false,
    canApproveProblem: false,
  },
  superadmin: {
    viewEvents: true,
    createEvent: true,
    updateEvent: true,
    deleteEvent: true,
    createProblem: true,
    updateProblem: true,
    deleteProblem: true,
    viewAnalytics: true,
    canManageUsers: true,
    canApproveProblem: true,
    canSuspendUsers: true,
    canViewAuditLogs: true,
  },
};

/**
 * Event statuses
 */
export const EVENT_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

/**
 * Problem difficulty levels
 */
export const PROBLEM_DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};

/**
 * Problem categories
 */
export const PROBLEM_CATEGORY = {
  ARRAYS: 'arrays',
  STRINGS: 'strings',
  LINKED_LIST: 'linked-list',
  TREES: 'trees',
  GRAPHS: 'graphs',
  DYNAMIC_PROGRAMMING: 'dynamic-programming',
  SORTING: 'sorting',
  SEARCHING: 'searching',
  RECURSION: 'recursion',
  BACKTRACKING: 'backtracking',
  HASH_TABLE: 'hash-table',
  STACK: 'stack',
  QUEUE: 'queue',
};

/**
 * Programming languages
 */
export const PROGRAMMING_LANGUAGES = {
  JAVASCRIPT: 'javascript',
  PYTHON: 'python',
  JAVA: 'java',
  CPLUSPLUS: 'cpp',
  C: 'c',
  CSHARP: 'csharp',
  PHP: 'php',
  RUBY: 'ruby',
  GO: 'go',
  RUST: 'rust',
};

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/auth/login',
  AUTH_SIGNUP: '/auth/signup',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_REFRESH: '/auth/refresh',
  AUTH_PASSWORD_RESET: '/auth/password-reset',

  // Users
  USERS_PROFILE: '/users/profile',
  USERS_UPDATE: '/users/update',
  USERS_CHANGE_PASSWORD: '/users/change-password',

  // Events
  EVENTS_LIST: '/events',
  EVENTS_CREATE: '/events/create',
  EVENTS_GET: '/events/:id',
  EVENTS_UPDATE: '/events/:id/update',
  EVENTS_DELETE: '/events/:id/delete',
  EVENTS_JOIN: '/events/:id/join',
  EVENTS_LEAVE: '/events/:id/leave',

  // Problems
  PROBLEMS_LIST: '/problems',
  PROBLEMS_CREATE: '/problems/create',
  PROBLEMS_GET: '/problems/:id',
  PROBLEMS_UPDATE: '/problems/:id/update',
  PROBLEMS_DELETE: '/problems/:id/delete',
  PROBLEMS_SUBMIT: '/problems/:id/submit',

  // Submissions
  SUBMISSIONS_LIST: '/submissions',
  SUBMISSIONS_GET: '/submissions/:id',

  // Certificates
  CERTIFICATES_LIST: '/certificates',
  CERTIFICATES_GET: '/certificates/:id',
  CERTIFICATES_DOWNLOAD: '/certificates/:id/download',
};

export default {
  VALIDATION_RULES,
  FORM_RULES,
  SECURITY_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  PASSWORD_STRENGTH_LEVELS,
  USER_ROLES,
  ROLE_PERMISSIONS,
  EVENT_STATUS,
  PROBLEM_DIFFICULTY,
  PROBLEM_CATEGORY,
  PROGRAMMING_LANGUAGES,
  API_ENDPOINTS,
};
