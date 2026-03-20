/**
 * LocalStorage utilities with "bluto" namespace
 * All keys are prefixed with "bluto-" for consistency
 */

const STORAGE_PREFIX = "bluto-";

/**
 * Set value in localStorage with bluto prefix
 */
export const setBlutoStorage = (key, value) => {
  try {
    const prefixedKey = `${STORAGE_PREFIX}${key}`;
    localStorage.setItem(prefixedKey, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
};

/**
 * Get value from localStorage with bluto prefix
 */
export const getBlutoStorage = (key, defaultValue = null) => {
  try {
    const prefixedKey = `${STORAGE_PREFIX}${key}`;
    const value = localStorage.getItem(prefixedKey);
    return value ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.error(`Error getting localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Remove value from localStorage with bluto prefix
 */
export const removeBlutoStorage = (key) => {
  try {
    const prefixedKey = `${STORAGE_PREFIX}${key}`;
    localStorage.removeItem(prefixedKey);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
};

/**
 * Clear all bluto-prefixed items from localStorage
 */
export const clearBlutoStorage = () => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error("Error clearing bluto storage:", error);
  }
};

/**
 * Get all bluto-prefixed items as an object
 */
export const getAllBlutoStorage = () => {
  try {
    const items = {};
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        const cleanKey = key.replace(STORAGE_PREFIX, "");
        items[cleanKey] = JSON.parse(localStorage.getItem(key));
      }
    });
    return items;
  } catch (error) {
    console.error("Error getting all bluto storage:", error);
    return {};
  }
};
