import React from "react";
import "./Pagination.css";

/**
 * Reusable Pagination Component
 */
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  maxVisiblePages = 5,
}) => {
  if (totalPages <= 1) return null;

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    handlePageClick(currentPage - 1);
  };

  const handleNext = () => {
    handlePageClick(currentPage + 1);
  };

  // Calculate which page numbers to show
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  const showFirstDot = startPage > 1;
  const showLastDot = endPage < totalPages;

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        <span>
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} -{" "}
          {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
        </span>
      </div>

      <nav className="pagination" aria-label="Pagination navigation">
        <button
          className="pagination-btn pagination-prev"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          ← Previous
        </button>

        <div className="pagination-pages">
          {showFirstDot && (
            <>
              <button
                className="pagination-page"
                onClick={() => handlePageClick(1)}
              >
                1
              </button>
              <span className="pagination-dots">...</span>
            </>
          )}

          {pages.map((page) => (
            <button
              key={page}
              className={`pagination-page ${page === currentPage ? "active" : ""}`}
              onClick={() => handlePageClick(page)}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          ))}

          {showLastDot && (
            <>
              <span className="pagination-dots">...</span>
              <button
                className="pagination-page"
                onClick={() => handlePageClick(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          className="pagination-btn pagination-next"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          Next →
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
