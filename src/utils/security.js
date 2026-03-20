// src/utils/security.js
// Security utilities for input validation, XSS prevention, and data protection

/**
 * Sanitize user input to prevent XSS attacks
 * Escapes HTML special characters
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') {
    return input;
  }

  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };

  return input.replace(/[&<>"']/g, (char) => map[char]);
};

/**
 * Validate email format using regex
 * Simple validation - backend should do comprehensive validation
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * Requirements:
 * - Minimum 8 characters
 * - At least 1 uppercase letter
 * - At least 1 number
 * - At least 1 special character
 */
export const validatePasswordStrength = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength: getPasswordStrength(password),
  };
};

/**
 * Calculate password strength level
 */
export const getPasswordStrength = (password) => {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;

  return ['weak', 'fair', 'good', 'strong', 'very-strong'][strength] || 'weak';
};

/**
 * Validate input length
 */
export const isValidLength = (input, minLength, maxLength) => {
  if (typeof input !== 'string') {
    return false;
  }
  return input.length >= minLength && input.length <= maxLength;
};

/**
 * Validate phone number (basic international format)
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate URL format
 */
export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Remove special characters but allow spaces and hyphens
 */
export const sanitizeName = (name) => {
  return name.replace(/[^a-zA-Z0-9\s-']/g, '').trim();
};

/**
 * Validate file upload
 * Check size and extension
 */
export const validateFileUpload = (file, allowedExtensions = [], maxSizeInMB = 5) => {
  const errors = [];

  if (!file) {
    errors.push('No file selected');
    return { isValid: false, errors };
  }

  const fileSizeInMB = file.size / (1024 * 1024);
  if (fileSizeInMB > maxSizeInMB) {
    errors.push(`File size must be less than ${maxSizeInMB}MB`);
  }

  if (allowedExtensions.length > 0) {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      errors.push(
        `Invalid file type. Allowed types: ${allowedExtensions.join(', ')}`
      );
    }
  }

  // Check MIME type
  const allowedMimeTypes = {
    pdf: 'application/pdf',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  };

  const fileExtension = file.name.split('.').pop().toLowerCase();
  const expectedMimeType = allowedMimeTypes[fileExtension];

  if (expectedMimeType && file.type !== expectedMimeType) {
    errors.push('File MIME type does not match extension');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Mask sensitive data in logs
 * Useful for displaying sensitive information safely
 */
export const maskSensitiveData = (data, fieldsToMask = []) => {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const masked = { ...data };

  fieldsToMask.forEach((field) => {
    if (masked[field]) {
      const value = String(masked[field]);
      if (value.length <= 4) {
        masked[field] = '****';
      } else {
        masked[field] =
          value.substring(0, 2) + '****' + value.substring(value.length - 2);
      }
    }
  });

  return masked;
};

/**
 * Mask credit card number
 */
export const maskCreditCard = (cardNumber) => {
  const cleaned = cardNumber.replace(/\D/g, '');
  if (cleaned.length < 4) return cardNumber;
  return '**** **** **** ' + cleaned.slice(-4);
};

/**
 * Mask email address
 */
export const maskEmail = (email) => {
  const [localPart, domain] = email.split('@');
  const first = localPart.charAt(0);
  const masked = first + '*'.repeat(Math.max(1, localPart.length - 2)) + '@' + domain;
  return masked;
};

/**
 * Validate JWT token format
 */
export const isValidJWT = (token) => {
  if (typeof token !== 'string') {
    return false;
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;
  }

  try {
    // Decode and check if token is expired
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp) {
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    }
    return true;
  } catch {
    return false;
  }
};

/**
 * Extract JWT expiration time
 */
export const getTokenExpiration = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp) {
      return new Date(payload.exp * 1000);
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Check if token will expire soon (within minutes)
 */
export const isTokenExpiringSoon = (token, minutesBefore = 5) => {
  const expiration = getTokenExpiration(token);
  if (!expiration) return false;

  const now = new Date();
  const timeUntilExpiry = expiration.getTime() - now.getTime();
  const minutesUntilExpiry = timeUntilExpiry / (1000 * 60);

  return minutesUntilExpiry < minutesBefore;
};

/**
 * Create CSRF token
 */
export const generateCSRFToken = () => {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Validate form data object
 */
export const validateFormData = (data, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const rule = rules[field];
    const value = data[field];

    if (rule.required && (!value || value.toString().trim() === '')) {
      errors[field] = `${rule.label || field} is required`;
      return;
    }

    if (value && rule.minLength && value.length < rule.minLength) {
      errors[field] = `${rule.label || field} must be at least ${rule.minLength} characters`;
    }

    if (value && rule.maxLength && value.length > rule.maxLength) {
      errors[field] = `${rule.label || field} must not exceed ${rule.maxLength} characters`;
    }

    if (rule.type === 'email' && value) {
      if (!isValidEmail(value)) {
        errors[field] = `${rule.label || field} must be a valid email address`;
      }
    }

    if (rule.type === 'phone' && value) {
      if (!isValidPhone(value)) {
        errors[field] = `${rule.label || field} must be a valid phone number`;
      }
    }

    if (rule.type === 'password' && value) {
      const validation = validatePasswordStrength(value);
      if (!validation.isValid) {
        errors[field] = validation.errors[0];
      }
    }

    if (rule.pattern && value) {
      if (!rule.pattern.test(value)) {
        errors[field] = rule.errorMessage || `${rule.label || field} format is invalid`;
      }
    }

    if (rule.custom && value) {
      const customError = rule.custom(value);
      if (customError) {
        errors[field] = customError;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Safely parse JSON with error handling
 */
export const safeJSONParse = (jsonString, fallback = null) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('JSON Parse Error:', error);
    return fallback;
  }
};

/**
 * Create rate limiter for client-side actions
 */
export const createRateLimiter = (maxRequests, timeWindowMs) => {
  const timestamps = [];

  return {
    canProceed: () => {
      const now = Date.now();
      // Remove timestamps outside the window
      const validTimestamps = timestamps.filter(
        (timestamp) => now - timestamp < timeWindowMs
      );

      if (validTimestamps.length < maxRequests) {
        validTimestamps.push(now);
        return true;
      }

      // Update the array with valid timestamps
      timestamps.length = 0;
      timestamps.push(...validTimestamps);

      return false;
    },
    getRemainingTime: () => {
      if (timestamps.length === 0) return 0;
      const oldestTimestamp = timestamps[0];
      return Math.max(0, timeWindowMs - (Date.now() - oldestTimestamp));
    },
  };
};

export default {
  sanitizeInput,
  isValidEmail,
  validatePasswordStrength,
  getPasswordStrength,
  isValidLength,
  isValidPhone,
  isValidURL,
  sanitizeName,
  validateFileUpload,
  maskSensitiveData,
  maskCreditCard,
  maskEmail,
  isValidJWT,
  getTokenExpiration,
  isTokenExpiringSoon,
  generateCSRFToken,
  validateFormData,
  safeJSONParse,
  createRateLimiter,
};
