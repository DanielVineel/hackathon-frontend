import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/common/Pagination";
import FilterPanel from "../../components/common/FilterPanel";
import { getBlutoStorage, setBlutoStorage } from "../../utils/storage";
import { applyFilters } from "../../utils/filters";
import { paginateArray } from "../../utils/pagination";
import API from "../../api/api";
import "../styles/StudentSubmissions.css";

const StudentSubmissions = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Filters with bluto namespace
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(
    getBlutoStorage("student-submissions-filters", {})
  );
  const [searchTerm, setSearchTerm] = useState(
    getBlutoStorage("student-submissions-search", "")
  );
  const [sortBy, setSortBy] = useState(
    getBlutoStorage("student-submissions-sort", "createdAt")
  );
  const [sortOrder, setSortOrder] = useState(
    getBlutoStorage("student-submissions-sort-order", "desc")
  );

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await API.get("/student/my-submissions");
      setSubmissions(res.data?.data || []);
      setError(null);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to load submissions");
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubmissions = applyFilters(submissions, {
    searchTerm,
    searchFields: ["problemId", "code"],
    filters: activeFilters,
    sortBy,
    sortOrder,
  });

  const paginatedData = paginateArray(
    filteredSubmissions,
    currentPage,
    ITEMS_PER_PAGE
  );

  const handleFilterChange = (filters) => {
    setBlutoStorage("student-submissions-filters", filters);
    setActiveFilters(filters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setBlutoStorage("student-submissions-filters", {});
    setBlutoStorage("student-submissions-search", "");
    setActiveFilters({});
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setBlutoStorage("student-submissions-search", term);
    setCurrentPage(1);
  };

  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    setBlutoStorage("student-submissions-sort", field);
    setBlutoStorage("student-submissions-sort-order", order);
    setCurrentPage(1);
  };

  const filterConfig = [
    {
      key: "status",
      type: "multiselect",
      label: "Submission Status",
      options: [
        { value: "accepted", label: "Accepted" },
        { value: "rejected", label: "Rejected" },
        { value: "pending", label: "Pending" },
      ],
    },
  ];

  if (loading) {
    return (
      <div className="student-submissions">
        <div className="loading">Loading submissions...</div>
      </div>
    );
  }

  return (
    <div className="student-submissions">
      <div className="header">
        <h1>My Submissions</h1>
        <p>View all your code submissions and results</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="submissions-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search submissions..."
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
            <option value="createdAt">Sort by Date</option>
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
          <table className="submissions-table">
            <thead>
              <tr>
                <th>Problem</th>
                <th>Status</th>
                <th>Score</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.data.map((sub) => (
                <tr key={sub._id}>
                  <td className="problem-cell">{sub.problemId?.name}</td>
                  <td>
                    <span className={`badge badge-${sub.status}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="score-cell">{sub.score || 0}</td>
                  <td className="date-cell">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      className="btn-view"
                      onClick={() => {
                        setSelectedSubmission(sub);
                        setShowDetail(true);
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={paginatedData.pages}
            onPageChange={setCurrentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={filteredSubmissions.length}
          />
        </>
      ) : (
        <div className="empty">
          <p>No submissions yet. Start solving problems!</p>
          {Object.keys(activeFilters).length > 0 && (
            <button className="reset-btn" onClick={handleClearFilters}>
              Clear Filters
            </button>
          )}
          <button className="btn-primary" onClick={() => navigate("/student/events")}>
            Browse Events
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && selectedSubmission && (
        <div
          className="modal-overlay"
          onClick={() => setShowDetail(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Submission Details</h2>
              <button className="close-btn" onClick={() => setShowDetail(false)}>
                ✕
              </button>
            </div>
            <div className="modal-content">
              <p>
                <strong>Problem:</strong> {selectedSubmission.problemId?.name}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`badge badge-${selectedSubmission.status}`}>
                  {selectedSubmission.status}
                </span>
              </p>
              <p>
                <strong>Score:</strong> {selectedSubmission.score || 0}
              </p>
              <p>
                <strong>Submitted:</strong>{" "}
                {new Date(selectedSubmission.createdAt).toLocaleString()}
              </p>
              <div className="code-section">
                <h3>Code:</h3>
                <pre>{selectedSubmission.code}</pre>
              </div>
              {selectedSubmission.feedback && (
                <div className="feedback-section">
                  <h3>Feedback:</h3>
                  <p>{selectedSubmission.feedback}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSubmissions;
