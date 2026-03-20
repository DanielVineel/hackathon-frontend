/**
 * Pagination utilities
 */

export const calculateTotalPages = (totalItems, itemsPerPage) => {
  return Math.ceil(totalItems / itemsPerPage);
};

export const getPaginationRange = (currentPage, totalPages, maxVisible = 5) => {
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return {
    pages,
    showFirstDot: start > 1,
    showLastDot: end < totalPages,
    startPage: start,
    endPage: end,
  };
};

export const paginateArray = (array, page, itemsPerPage) => {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return {
    data: array.slice(startIndex, endIndex),
    total: array.length,
    pages: calculateTotalPages(array.length, itemsPerPage),
  };
};

export const getPaginationParams = (page, itemsPerPage) => {
  return {
    skip: (page - 1) * itemsPerPage,
    limit: itemsPerPage,
  };
};
