import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/common/DataTable";
import { useApi } from "../../hooks/useApi";
import { useFilter } from "../../hooks/useFilter";
import { usePagination } from "../../hooks/usePagination";
import "../../styles/EnhancedPages.css";

const StudentSubmissions = () => {
  const navigate = useNavigate();
  const { data: submissions, loading, error, refetch } = useApi("/submissions");
  const { filters, updateFilter, resetFilters } = useFilter({
    status: "",
    problemId: "",
    dateRange: ""
  });
  const { currentPage, pageSize, totalPages, paginatedData, goToPage } = usePagination(submissions || [], 10);

  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Apply filters and sorting
  const filteredSubmissions = React.useMemo(() => {
    let filtered = [...(submissions || [])];

    if (filters.status) {
      filtered = filtered.filter(s => s.status === filters.status);
    }
    if (filters.problemId) {
      filtered = filtered.filter(s => s.problemId === filters.problemId);
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      
      if (sortOrder === "asc") return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

    return filtered;
  }, [submissions, filters, sortBy, sortOrder]);

  const columns = [
    { key: "submissionId", label: "Submission ID", width: "12%" },
    { key: "problemTitle", label: "Problem", width: "20%" },
    { key: "language", label: "Language", width: "12%" },
    { key: "status", label: "Status", width: "12%", render: (val) => (
      <span className={`status-badge status-${val?.toLowerCase()}`}>{val}</span>
    )},
    { key: "score", label: "Score", width: "8%", render: (val) => `${val || 0}%` },
    { key: "submittedAt", label: "Submitted", width: "15%", render: (val) => new Date(val).toLocaleDateString() },
    { key: "actions", label: "Actions", width: "21%", render: (_, row) => (
      <div className="action-buttons">
        <button 
          className="btn btn-primary btn-sm"
          onClick={() => navigate(`/student/submissions/${row.submissionId}`)}
        >
          View
        </button>
        {row.status === "Pending" && (
          <button 
            className="btn btn-warning btn-sm"
            onClick={() => navigate(`/student/submissions/${row.submissionId}/edit`)}
          >
            Resubmit
          </button>
        )}
        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => handleDownloadCode(row)}
        >
          Download
        </button>
      </div>
    )},
  ];

  const handleDownloadCode = (submission) => {
    // Implement download logic
    console.log("Downloading code for submission:", submission.submissionId);
  };

  const getStatusStats = () => {
    const stats = {};
    submissions?.forEach(s => {
      stats[s.status] = (stats[s.status] || 0) + 1;
    });
    return stats;
  };

  const stats = React.useMemo(() => getStatusStats(), [submissions]);

  return (
    <div className="enhanced-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>📤 My Submissions</h1>
          <p>Track and manage your problem submissions</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/student/problems")}>
          Submit New Solution
        </button>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-value">{submissions?.length || 0}</div>
          <div className="stat-label">Total Submissions</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats["Accepted"] || 0}</div>
          <div className="stat-label">Accepted</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats["Wrong Answer"] || 0}</div>
          <div className="stat-label">Wrong Answer</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats["Runtime Error"] || 0}</div>
          <div className="stat-label">Runtime Error</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-section">
        <button 
          className={`btn btn-outline ${showFilters ? "active" : ""}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          🔍 {showFilters ? "Hide" : "Show"} Filters
        </button>

        {showFilters && (
          <div className="filter-panel">
            <div className="filter-row">
              <div className="filter-group">
                <label>Status</label>
                <select 
                  value={filters.status}
                  onChange={(e) => updateFilter("status", e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Wrong Answer">Wrong Answer</option>
                  <option value="Runtime Error">Runtime Error</option>
                  <option value="Time Limit Exceeded">Time Limit Exceeded</option>
                  <option value="Pending">Pending Review</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Problem</label>
                <input 
                  type="text"
                  placeholder="Filter by problem..."
                  value={filters.problemId}
                  onChange={(e) => updateFilter("problemId", e.target.value)}
                />
              </div>

              <button 
                className="btn btn-secondary"
                onClick={resetFilters}
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="content-area">
        {loading && <div className="loading">Loading submissions...</div>}
        {error && <div className="error-message">⚠️ {error}</div>}
        
        {!loading && filteredSubmissions.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No Submissions Yet</h3>
            <p>Start solving problems and submit your solutions</p>
            <button className="btn btn-primary" onClick={() => navigate("/student/problems")}>
              Browse Problems
            </button>
          </div>
        )}

        {!loading && filteredSubmissions.length > 0 && (
          <>
            <DataTable 
              columns={columns} 
              data={paginatedData}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={(key) => {
                if (sortBy === key) {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                } else {
                  setSortBy(key);
                  setSortOrder("asc");
                }
              }}
            />
            
            {totalPages > 1 && (
              <div className="pagination-area">
                <div className="pagination-info">
                  Showing {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, filteredSubmissions.length)} of {filteredSubmissions.length}
                </div>
                <div className="pagination-controls">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => goToPage(1)}
                  >
                    First
                  </button>
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => goToPage(currentPage - 1)}
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      className={currentPage === page ? "active" : ""}
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => goToPage(currentPage + 1)}
                  >
                    Next
                  </button>
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => goToPage(totalPages)}
                  >
                    Last
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StudentSubmissions;
