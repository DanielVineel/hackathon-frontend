/**
 * Custom Hook: useFilter
 * Provides filtering and sorting logic with state management
 */

import { useState, useCallback } from 'react';

export const useFilter = (initialFilters = {}) => {
  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...initialFilters
  });

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);

  const setSearch = useCallback((search) => {
    setFilters(prev => ({
      ...prev,
      search
    }));
  }, []);

  const setSortBy = useCallback((sortBy, sortOrder = 'asc') => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder
    }));
  }, []);

  const toggleSortOrder = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      ...initialFilters
    });
  }, [initialFilters]);

  const getActiveFiltersCount = useCallback(() => {
    return Object.entries(filters).filter(
      ([key, value]) =>
        key !== 'sortBy' &&
        key !== 'sortOrder' &&
        value !== '' &&
        value !== 'all' &&
        value !== null
    ).length;
  }, [filters]);

  return {
    filters,
    updateFilter,
    updateFilters,
    setSearch,
    setSortBy,
    toggleSortOrder,
    clearFilters,
    getActiveFiltersCount: getActiveFiltersCount()
  };
};

export default useFilter;
