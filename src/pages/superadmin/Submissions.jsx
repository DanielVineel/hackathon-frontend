// src/pages/superadmin/Submissions.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/api";
import DataTable from "../../components/common/DataTable";
import Modal from "../../components/common/Modal";
import "../../styles/EnhancedPages.css";
import "./Submissions.css";

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: "",
    status: "all",
    language: "all"
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Modals
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch submissions
  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get("/submissions");
      setSubmissions(response.data?.data || response.data?.submissions || []);
      setCurrentPage(1);
    } catch (err) {
      setError("Failed to load submissions. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Filtered and sorted data
  const filteredData = React.useMemo(() => {
    let filtered = [...submissions];

    // Apply filters
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(sub =>
        sub.studentName?.toLowerCase().includes(term) ||
        sub.studentEmail?.toLowerCase().includes(term) ||
        sub.problemTitle?.toLowerCase().includes(term)
      );
    }

    if (filters.status !== "all") {
      filtered = filtered.filter(sub => {
        const status = (sub.status || "pending").toLowerCase();
        return status === filters.status.toLowerCase();
      });
    }

    if (filters.language !== "all") {
      filtered = filtered.filter(sub => sub.language === filters.language);
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (!aVal) aVal = "";
      if (!bVal) bVal = "";

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [submissions, filters, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Stats
  const stats = React.useMemo(() => ({
    total: submissions.length,
    accepted: submissions.filter(s => (s.status || "").toLowerCase() === "accepted").length,
    pending: submissions.filter(s => (s.status || "").toLowerCase() === "pending").length,
    failed: submissions.filter(s => {
      const status = (s.status || "").toLowerCase();
      return status === "wrong" || status === "runtime error" || status === "time limit exceeded";
    }).length
  }), [submissions]);

  // Handlers
  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const handleView = (submission) => {
    setSelectedSubmission(submission);
    setShowDetailsModal(true);
  };

  const getStatusColor = (status) => {
    const s = (status || "pending").toLowerCase();
    if (s === "accepted") return "accept";
    if (s === "pending") return "pending";
    if (s === "wrong") return "wrong";
    return "error";
  };

  // Table columns
  const columns = [
    {
      key: "studentName",
      header: "Student",
      render: (value, row) => (
        <div>
          <strong>{value}</strong>
          <br />
          <small style={{ color: "#6b7280" }}>{row.studentEmail}</small>
        </div>
      ),
      sortable: true
    },
    {
      key: "problemTitle",
      header: "Problem",
      render: (value) => <strong>{value}</strong>,
      sortable: true
    },
    {
      key: "language",
      header: "Language",
      render: (value) => value || "N/A",
      sortable: true
    },
    {
      key: "status",
      header: "Status",
      render: (value) => (
        <span className={`status-badge status-${getStatusColor(value)}`}>
          {(value || "Pending").toUpperCase()}
        </span>
      ),
      sortable: true
    },
    {
      key: "score",
      header: "Score",
      render: (value) => (
        <strong>{typeof value === "number" ? `${value}%` : "0%"}</strong>
      ),
      sortable: true
    },
    {
      key: "createdAt",
      header: "Submitted",
      render: (value) => new Date(value).toLocaleString(),
      sortable: true
    },
    {
      key: "actions",
      header: "Actions",
      render: (_, row) => (
        <div className="action-buttons compact">
          <button className="btn btn-sm btn-primary" onClick={() => handleView(row)} title="View Details">
            👁️
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="enhanced-page Submissions">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>📊 All Submissions</h1>
          <p>View and analyze user submission history</p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-card">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Total Submissions</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.accepted}</span>
          <span className="stat-label">Accepted</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.pending}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.failed}</span>
          <span className="stat-label">Failed</span>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Filters */}
      <div className="filter-section">
        <button
          className={`btn btn-outline ${showFilters ? "active" : ""}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>

        {showFilters && (
          <div className="filter-panel">
            <div className="filter-row">
              <div className="filter-group">
                <label>Search Student or Problem</label>
                <input
                  type="text"
                  placeholder="Search..."
                  value={filters.searchTerm}
                  onChange={(e) => {
                    setFilters({ ...filters, searchTerm: e.target.value });
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div className="filter-group">
                <label>Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => {
                    setFilters({ ...filters, status: e.target.value });
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="accepted">Accepted</option>
                  <option value="pending">Pending</option>
                  <option value="wrong">Wrong Answer</option>
                  <option value="runtime">Runtime Error</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Language</label>
                <select
                  value={filters.language}
                  onChange={(e) => {
                    setFilters({ ...filters, language: e.target.value });
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All Languages</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                  <option value="javascript">JavaScript</option>
                </select>
              </div>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setFilters({ searchTerm: "", status: "all", language: "all" });
                  setCurrentPage(1);
                }}
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="content-area">
        {loading ? (
          <div className="loading">Loading submissions...</div>
        ) : filteredData.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No submissions found</h3>
            <p>Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={paginatedData}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
            />

            {/* Pagination */}
            <div className="pagination-area">
              <span className="pagination-info">
                Page {currentPage} of {totalPages} | Showing {paginatedData.length} of {filteredData.length}
              </span>
              <div className="pagination-controls">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  ←
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = Math.max(1, currentPage - 2) + i;
                  return page <= totalPages ? (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page ? "active" : ""}
                    >
                      {page}
                    </button>
                  ) : null;
                })}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  →
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedSubmission && (
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title={`Submission Details`}
        >
          <div className="modal-content">
            <div className="details-row">
              <div className="label">Student:</div>
              <span>{selectedSubmission.studentName} ({selectedSubmission.studentEmail})</span>
            </div>
            <div className="details-row">
              <div className="label">Problem:</div>
              <span>{selectedSubmission.problemTitle}</span>
            </div>
            <div className="details-row">
              <div className="label">Language:</div>
              <span>{selectedSubmission.language}</span>
            </div>
            <div className="details-row">
              <div className="label">Status:</div>
              <span className={`status-badge status-${getStatusColor(selectedSubmission.status)}`}>
                {(selectedSubmission.status || "Pending").toUpperCase()}
              </span>
            </div>
            <div className="details-row">
              <div className="label">Score:</div>
              <span><strong>{typeof selectedSubmission.score === "number" ? `${selectedSubmission.score}%` : "0%"}</strong></span>
            </div>
            <div className="details-row">
              <div className="label">Submitted:</div>
              <span>{new Date(selectedSubmission.createdAt).toLocaleString()}</span>
            </div>
            <div className="details-row">
              <div className="label">Code:</div>
              <div style={{ backgroundColor: "#f3f4f6", padding: "8px", borderRadius: "4px", maxHeight: "200px", overflowY: "auto", fontSize: "12px", fontFamily: "monospace" }}>
                {selectedSubmission.code || "N/A"}
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowDetailsModal(false)}>
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Submissions;

       