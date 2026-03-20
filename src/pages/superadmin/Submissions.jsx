import React, { useEffect, useState } from "react";
import Pagination from "../../components/common/Pagination";
import FilterPanel from "../../components/common/FilterPanel";
import { getBlutoStorage, setBlutoStorage } from "../../utils/storage";
import { applyFilters } from "../../utils/filters";
import { paginateArray } from "../../utils/pagination";
import API from "../../api/api";
import "../styles/SuperAdminSubmissions.css";

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  // Filters with bluto namespace
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(
    getBlutoStorage("superadmin-submissions-filters", {})
  );
  const [searchTerm, setSearchTerm] = useState(
    getBlutoStorage("superadmin-submissions-search", "")
  );
  const [sortBy, setSortBy] = useState(
    getBlutoStorage("superadmin-submissions-sort", "createdAt")
  );
  const [sortOrder, setSortOrder] = useState(
    getBlutoStorage("superadmin-submissions-sort-order", "desc")
  );

  // Detail view
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ status: "" });

  // Fetch submissions
  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await API.get("/superadmin/submissions");
      setSubmissions(res.data?.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching submissions", err);
      setError("Failed to load submissions");
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const filteredSubmissions = applyFilters(submissions, {
    searchTerm,
    searchFields: ["user.name", "problem.title", "language"],
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
    setBlutoStorage("superadmin-submissions-filters", filters);
    setActiveFilters(filters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setBlutoStorage("superadmin-submissions-filters", {});
    setBlutoStorage("superadmin-submissions-search", "");
    setActiveFilters({});
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setBlutoStorage("superadmin-submissions-search", term);
    setCurrentPage(1);
  };

  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    setBlutoStorage("superadmin-submissions-sort", field);
    setBlutoStorage("superadmin-submissions-sort-order", order);
    setCurrentPage(1);
  };

  const handleEdit = (sub) => {
    setEditId(sub._id);
    setEditData({ status: sub.status || "" });
  };

  const handleChange = (e) => {
    setEditData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async (id) => {
    try {
      await API.put(`/superadmin/submissions/${id}`, editData);
      setEditId(null);
      setError(null);
      fetchSubmissions();
    } catch (err) {
      console.error("Error updating submission", err);
      setError("Failed to update submission");
    }
  };

  const filterConfig = [
    {
      key: "status",
      type: "multiselect",
      label: "Status",
      options: [
        { value: "pending", label: "Pending" },
        { value: "accepted", label: "Accepted" },
        { value: "wrong", label: "Wrong Answer" },
        { value: "tle", label: "Time Limit Exceeded" },
        { value: "runtime", label: "Runtime Error" },
      ],
    },
    {
      key: "language",
      type: "multiselect",
      label: "Language",
      options: [
        { value: "python", label: "Python" },
        { value: "cpp", label: "C++" },
        { value: "java", label: "Java" },
        { value: "javascript", label: "JavaScript" },
      ],
    },
  ];

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: "warning",
      accepted: "success",
      wrong: "danger",
      tle: "danger",
      runtime: "danger",
    };
    const badgeClass = statusMap[status] || "secondary";
    return <span className={`badge badge-${badgeClass}`}>{status}</span>;
  };

  if (loading) {
    return (
      <div className="submissions-page">
        <div className="loading">Loading submissions...</div>
      </div>
    );
  }

  return (
    <div className="submissions-page">
      <header className="page-header">
        <h1>All Submissions</h1>
        <p>View and manage all user submissions</p>
      </header>

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
            <option value="status">Sort by Status</option>
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

      {paginatedData.data.length === 0 ? (
        <div className="no-results">
          <p>No submissions found</p>
          {Object.keys(activeFilters).length > 0 && (
            <button className="reset-btn" onClick={handleClearFilters}>
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="submissions-table-wrapper">
            <table className="submissions-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Problem</th>
                  <th>Event</th>
                  <th>Language</th>
                  <th>Status</th>
                  <th>Score</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedData.data.map((s, index) => (
                  <tr key={s._id}>
                    <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>

                    <td>{s.user?.name || "N/A"}</td>
                    <td>{s.problem?.title || "N/A"}</td>
                    <td>{s.event?.name || "N/A"}</td>
                    <td>
                      <span className="language-badge">{s.language}</span>
                    </td>

                    {/* Status */}
                    <td>
                      {editId === s._id ? (
                        <select
                          name="status"
                          className="status-select"
                          value={editData.status}
                          onChange={handleChange}
                        >
                          <option value="pending">Pending</option>
                          <option value="accepted">Accepted</option>
                          <option value="wrong">Wrong Answer</option>
                          <option value="tle">TLE</option>
                          <option value="runtime">Runtime Error</option>
                        </select>
                      ) : (
                        getStatusBadge(s.status)
                      )}
                    </td>

                    <td>
                      <strong>{s.score ?? "-"}</strong>
                    </td>

                    <td>{new Date(s.createdAt).toLocaleString()}</td>

                    {/* Actions */}
                    <td className="actions">
                      {editId === s._id ? (
                        <>
                          <button
                            className="btn-save"
                            onClick={() => handleUpdate(s._id)}
                          >
                            Save
                          </button>
                          <button
                            className="btn-cancel"
                            onClick={() => setEditId(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn-edit"
                            onClick={() => handleEdit(s)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-view"
                            onClick={() => {
                              setSelectedSubmission(s);
                              setShowDetail(true);
                            }}
                          >
                            View
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={paginatedData.pages}
            onPageChange={setCurrentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={filteredSubmissions.length}
          />
        </>
      )}

      {/* Detail Modal */}
      {showDetail && selectedSubmission && (
        <div className="modal-overlay" onClick={() => setShowDetail(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Submission Details</h2>
              <button
                className="close-btn"
                onClick={() => setShowDetail(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-content">
              <div className="submission-info">
                <p>
                  <strong>Student:</strong> {selectedSubmission.user?.name}
                </p>
                <p>
                  <strong>Problem:</strong> {selectedSubmission.problem?.title}
                </p>
                <p>
                  <strong>Event:</strong> {selectedSubmission.event?.name}
                </p>
                <p>
                  <strong>Language:</strong> {selectedSubmission.language}
                </p>
                <p>
                  <strong>Score:</strong> {selectedSubmission.score || 0}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {getStatusBadge(selectedSubmission.status)}
                </p>
              </div>

              {selectedSubmission.code && (
                <div className="code-section">
                  <h3>Submitted Code:</h3>
                  <pre className="code-block">
                    {selectedSubmission.code}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Submissions;