import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Pagination from "../../components/common/Pagination";
import FilterPanel from "../../components/common/FilterPanel";
import { getBlutoStorage, setBlutoStorage } from "../../utils/storage";
import { applyFilters } from "../../utils/filters";
import { paginateArray } from "../../utils/pagination";
import API from "../../api/api";
import "../styles/StudentProblems.css";

const StudentProblems = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Filters with bluto namespace
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(
    getBlutoStorage("student-problems-filters", {})
  );
  const [searchTerm, setSearchTerm] = useState(
    getBlutoStorage("student-problems-search", "")
  );
  const [sortBy, setSortBy] = useState(
    getBlutoStorage("student-problems-sort", "difficulty")
  );
  const [sortOrder, setSortOrder] = useState(
    getBlutoStorage("student-problems-sort-order", "asc")
  );

  useEffect(() => {
    fetchProblems();
  }, [eventId]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/student/event/${eventId}/problems`);
      setProblems(res.data?.data || []);
      setError(null);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to load problems");
      setProblems([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProblems = applyFilters(problems, {
    searchTerm,
    searchFields: ["name", "statement"],
    filters: activeFilters,
    sortBy,
    sortOrder,
  });

  const paginatedData = paginateArray(filteredProblems, currentPage, ITEMS_PER_PAGE);

  const handleFilterChange = (filters) => {
    setBlutoStorage("student-problems-filters", filters);
    setActiveFilters(filters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setBlutoStorage("student-problems-filters", {});
    setBlutoStorage("student-problems-search", "");
    setActiveFilters({});
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setBlutoStorage("student-problems-search", term);
    setCurrentPage(1);
  };

  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    setBlutoStorage("student-problems-sort", field);
    setBlutoStorage("student-problems-sort-order", order);
    setCurrentPage(1);
  };

  const filterConfig = [
    {
      key: "difficulty",
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

  if (loading) return <div className="loading">Loading problems...</div>;

  return (
    <div className="student-problems">
      <div className="header">
        <h1>Event Problems</h1>
        <button className="btn-back" onClick={() => navigate("/student/events")}>
          ← Back to Events
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="problems-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search problems..."
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
            <option value="difficulty">Sort by Difficulty</option>
            <option value="name">Sort by Name</option>
            <option value="score">Sort by Score</option>
          </select>
          <button
            className={`sort-order-btn ${sortOrder}`}
            onClick={() =>
              handleSortChange(sortBy, sortOrder === "asc" ? "desc" : "asc")
            }
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>

      {paginatedData.data.length > 0 ? (
        <>
          <div className="problems-grid">
            {paginatedData.data.map((problem) => (
              <div key={problem._id} className="problem-card">
                <div className="card-header">
                  <h3>{problem.name}</h3>
                  <span className={`difficulty ${problem.difficulty}`}>
                    {problem.difficulty}
                  </span>
                </div>
                <p className="statement">
                  {problem.statement?.substring(0, 100)}...
                </p>
                <div className="card-meta">
                  <span>Score: {problem.score}</span>
                  <span>Status: {problem.status || "unsolved"}</span>
                </div>
                <button
                  className="btn-solve"
                  onClick={() => navigate(`/student/problem/${problem._id}`)}
                >
                  Solve Problem →
                </button>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={paginatedData.pages}
            onPageChange={setCurrentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={filteredProblems.length}
          />
        </>
      ) : (
        <div className="empty">
          <p>No problems found matching your criteria</p>
          {Object.keys(activeFilters).length > 0 && (
            <button className="reset-btn" onClick={handleClearFilters}>
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentProblems;
