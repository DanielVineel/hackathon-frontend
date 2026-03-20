/**
 * Filter utilities for events, problems, and other entities
 */

/**
 * Filter array by multiple criteria
 */
export const filterByMultipleCriteria = (array, filters) => {
  if (!Array.isArray(array)) return [];
  if (!filters || Object.keys(filters).length === 0) return array;

  return array.filter((item) => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true; // Skip empty filter values

      if (typeof item[key] === "string") {
        return item[key].toLowerCase().includes(value.toLowerCase());
      }

      if (typeof item[key] === "number") {
        return item[key] === Number(value);
      }

      if (Array.isArray(item[key])) {
        return item[key].some((v) =>
          String(v).toLowerCase().includes(String(value).toLowerCase())
        );
      }

      return String(item[key]).toLowerCase().includes(String(value).toLowerCase());
    });
  });
};

/**
 * Search in array by text in multiple fields
 */
export const searchInArray = (array, searchTerm, searchFields) => {
  if (!searchTerm || searchTerm.trim() === "") return array;

  const term = searchTerm.toLowerCase();

  return array.filter((item) => {
    return searchFields.some((field) => {
      const value = item[field];
      if (!value) return false;
      return String(value).toLowerCase().includes(term);
    });
  });
};

/**
 * Filter by date range
 */
export const filterByDateRange = (array, dateField, startDate, endDate) => {
  return array.filter((item) => {
    const itemDate = new Date(item[dateField]);
    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate) : new Date();

    return itemDate >= start && itemDate <= end;
  });
};

/**
 * Filter by status
 */
export const filterByStatus = (array, statusField, statuses) => {
  if (!Array.isArray(statuses) || statuses.length === 0) return array;

  return array.filter((item) => statuses.includes(item[statusField]));
};

/**
 * Filter by difficulty level
 */
export const filterByDifficulty = (array, difficultySortOrder = "asc") => {
  const difficultyLevels = { easy: 1, medium: 2, hard: 3 };

  return array.sort((a, b) => {
    const diffA = difficultyLevels[a.difficulty?.toLowerCase()] || 0;
    const diffB = difficultyLevels[b.difficulty?.toLowerCase()] || 0;

    return difficultySortOrder === "asc" ? diffA - diffB : diffB - diffA;
  });
};

/**
 * Sort array by field
 */
export const sortByField = (array, field, order = "asc") => {
  return [...array].sort((a, b) => {
    let valueA = a[field];
    let valueB = b[field];

    // Handle dates
    if (valueA instanceof Date || typeof valueA === "string") {
      valueA = new Date(valueA);
      valueB = new Date(valueB);
    }

    // Handle numbers
    if (typeof valueA === "number" && typeof valueB === "number") {
      return order === "asc" ? valueA - valueB : valueB - valueA;
    }

    // Handle strings
    if (typeof valueA === "string" && typeof valueB === "string") {
      return order === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    return 0;
  });
};

/**
 * Combine multiple filters
 */
export const applyFilters = (
  array,
  {
    searchTerm,
    searchFields,
    filters,
    dateRange,
    statusFilter,
    sortBy,
    sortOrder = "asc",
  }
) => {
  let result = [...array];

  // Apply search
  if (searchTerm && searchFields) {
    result = searchInArray(result, searchTerm, searchFields);
  }

  // Apply general filters
  if (filters) {
    result = filterByMultipleCriteria(result, filters);
  }

  // Apply date range filter
  if (dateRange && dateRange.field) {
    result = filterByDateRange(
      result,
      dateRange.field,
      dateRange.startDate,
      dateRange.endDate
    );
  }

  // Apply status filter
  if (statusFilter && statusFilter.field) {
    result = filterByStatus(result, statusFilter.field, statusFilter.values);
  }

  // Apply sorting
  if (sortBy) {
    result = sortByField(result, sortBy, sortOrder);
  }

  return result;
};
