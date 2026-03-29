import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Pagination from "../../components/common/Pagination";
import FilterPanel from "../../components/common/FilterPanel";
import { getBlutoStorage, setBlutoStorage } from "../../utils/storage";
import { applyFilters } from "../../utils/filters";
import { paginateArray } from "../../utils/pagination";
import API from "../../api/api";
import "../../styles/StudentProblems.css";

/**
 * StudentProblems Component
 * Displays problems for a specific event with filtering, sorting, and pagination
 */
const StudentProblems = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();

  // Data States
  const [problems, setProblems] = useState([]);
  const [eventDetails, setEventDetails] = useState(null);

  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Filters with bluto namespace
  const [activeFilters, setActiveFilters] = useState(
    getBlutoStorage("student-problems-filters", {})
  );
  const [searchTerm, setSearchTerm] = useState(
    getBlutoStorage("student-problems-search", "")
  );
  const [sortBy, setSortBy] = useState(
    getBlutoStorage("student-problems-sort", "name")
  );
  const [sortOrder, setSortOrder] = useState(
    getBlutoStorage("student-problems-sort-order", "asc")
  );

  useEffect(() => {
    
      fetchProblems();
    
  }, []);

  /**
   * Fetch problems for the event
   */
  const fetchProblems = async () => {
    try {
      setLoading(true);
      setError(null);

     

      const res = await API.get(`/problems`);
     
      // Handle different API response structures
      let problemsData = [];
      if (res.data?.problems) {
         if (Array.isArray(res.data.problems)) {
          problemsData = res.data.problems;
        }
      }

      // Ensure it's always an array
   
      setProblems(Array.isArray(problemsData) ? problemsData : []);
      setCurrentPage(1); // Reset to first page on new data
    } catch (err) {
      console.error("Error fetching problems:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to load problems";
      setError(errorMsg);
      setProblems([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Apply filters to problems
   */
  const filteredProblems = applyFilters(problems, {
    searchTerm,
    searchFields: [ "title", "description"],
    filters: activeFilters,
    sortBy,
    sortOrder,
  });

  /**
   * Paginate filtered problems
   */
  const paginatedData = paginateArray(
    filteredProblems,
    currentPage,
    ITEMS_PER_PAGE
  );

  /**
   * Handle filter changes
   */
  const handleFilterChange = (filters) => {
    setBlutoStorage("student-problems-filters", filters);
    setActiveFilters(filters);
    setCurrentPage(1);
  };

  /**
   * Clear all filters
   */
  const handleClearFilters = () => {
    setBlutoStorage("student-problems-filters", {});
    setBlutoStorage("student-problems-search", "");
    setActiveFilters({});
    setSearchTerm("");
    setCurrentPage(1);
  };

  /**
   * Handle search input
   */
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setBlutoStorage("student-problems-search", term);
    setCurrentPage(1);
  };

  /**
   * Handle sort changes
   */
  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    setBlutoStorage("student-problems-sort", field);
    setBlutoStorage("student-problems-sort-order", order);
    setCurrentPage(1);
  };

  /**
   * Handle navigate to problem solver
   */
  const handleSolveProblem = (problemId) => {
    if (problemId) {
      navigate(`/student/problem/${problemId}`, {
        state: { eventId, previousProblems: problems }
      });
    }
  };

  /**
   * Filter configuration
   */
  const filterConfig = [
    {
      key: "level",
      type: "multiselect",
      label: "Difficulty Level",
      options: [
        { value: "easy", label: "Easy" },
        { value: "medium", label: "Medium" },
        { value: "hard", label: "Hard" },
      ],
    },
    {
      key: "status",
      type: "multiselect",
      label: "Problem Status",
      options: [
        { value: "solved", label: "Solved" },
        { value: "attempted", label: "Attempted" },
        { value: "unsolved", label: "Unsolved" },
      ],
    },
  ];

  // Loading State
  if (loading) {
    return (
      <div className="student-problems loading">
        <div className="loader"></div>
        <p>Loading problems...</p>
      </div>
    );
  }

  return (
    <div className="student-problems">
      {/* Header */}
      <div className="header">
        <div className="header-content">
          <h1>Event Problems</h1>
          <p className="problems-count">
            {filteredProblems.length} problem{filteredProblems.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          className="btn-back"
          onClick={() => navigate("/student/events")}
        >
          ← Back to Events
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchProblems} className="retry-btn">
            Try Again
          </button>
        </div>
      )}

      {/* Controls */}
      {problems.length > 0 && !error && (
        <div className="problems-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search problems by name or description..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          <FilterPanel
            filters={filterConfig}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            isOpen={filterOpen}
            onToggle={() => setFilterOpen(!filterOpen)}
          />

          <div className="sort-controls">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value, sortOrder)}
              className="sort-select"
            >
              <option value="name">Sort by Name</option>
              <option value="level">Sort by Difficulty</option>
              <option value="score">Sort by Score</option>
            </select>
            <button
              className={`sort-order-btn ${sortOrder}`}
              onClick={() =>
                handleSortChange(sortBy, sortOrder === "asc" ? "desc" : "asc")
              }
              title={sortOrder === "asc" ? "Ascending" : "Descending"}
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>
      )}

      {/* Problems Grid */}
      {paginatedData.data && paginatedData.data.length > 0 ? (
        <>
          <div className="problems-grid">
            {paginatedData.data.map((problem) => (
              <div key={problem._id} className="problem-card">
                <div className="card-header">
                  <h3 className="problem-name">
                    {problem.title || "Untitled Problem"}
                  </h3>
                  <span
                    className={`difficulty-badge difficulty--${
                      problem.level ||  "medium"
                    }`}
                  >
                  </span>
                </div>

                {( problem.description) && (
                  <p className="statement">
                    {( problem.description).substring(0, 100)}
                    {( problem.description).length > 100 ? "..." : ""}
                  </p>
                )}

                <div className="card-meta">
                  {problem.score !== undefined && (
                    <span className="score">⭐ {problem.score} points</span>
                  )}
                  <span className="status">
                    {problem.status === "solved"
                      ? "✓ Solved"
                      : problem.status === "attempted"
                      ? "⏳ Attempted"
                      : "Unsolved"}
                  </span>
                </div>

                <button
                  className="btn-solve"
                  onClick={() => handleSolveProblem(problem._id)}
                  disabled={!problem._id}
                >
                  Solve Problem →
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {paginatedData.pages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={paginatedData.pages}
              onPageChange={setCurrentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={filteredProblems.length}
            />
          )}
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No Problems Found</h3>
          <p>
            {Object.keys(activeFilters).length > 0 || searchTerm
              ? "No problems match your search criteria"
              : "No problems available for this event"}
          </p>
          {(Object.keys(activeFilters).length > 0 || searchTerm) && (
            <button
              className="btn-reset-filters"
              onClick={handleClearFilters}
            >
              Clear Filters & Search
            </button>
          )}
          <button
            className="btn-back-to-events"
            onClick={() => navigate("/student/events")}
          >
            ← Back to Events
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentProblems;