/**
 * Custom Hook: usePagination
 * Provides pagination logic and state management
 */

import { useState, useCallback } from 'react';

export const usePagination = (initialLimit = 10) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / limit);

  const goToPage = useCallback((pageNum) => {
    const validPage = Math.max(1, Math.min(pageNum, totalPages));
    setPage(validPage);
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  }, [page, totalPages]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const changeLimit = useCallback((newLimit) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  const reset = useCallback(() => {
    setPage(1);
    setLimit(initialLimit);
    setTotal(0);
  }, [initialLimit]);

  const getOffset = useCallback(() => {
    return (page - 1) * limit;
  }, [page, limit]);

  return {
    page,
    limit,
    total,
    setTotal,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    changeLimit,
    reset,
    getOffset,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};

export default usePagination;
