import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import DataTable from "../../components/common/DataTable";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { CreateProblem, UpdateProblem } from "./operations";
import "../../styles/EnhancedPages.css";
import "./Problems.css";

const Problems = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // TAB STATE
  const [activeTab, setActiveTab] = useState("all"); // "all" or "myProblems"

  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: "",
    level: "all"
  });

  // Bulk operations
  const [selectedProblems, setSelectedProblems] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Modals
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateProblemModal, setShowCreateProblemModal] = useState(false);
  const [showUpdateProblemModal, setShowUpdateProblemModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Fetch all problems (reusable in events)
  const fetchAllProblems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get("/problems");
      
      const problemsData = response.data?.problems || [];
      const problemsArray = Array.isArray(problemsData) ? problemsData : [];
      
      setProblems(problemsArray);
      setCurrentPage(1);
    } catch (err) {
      setError("Failed to load problems. Please try again.");
      console.error(err);
      setProblems([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch my created problems
  const fetchMyProblems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get("/superadmin/problems/created");
      
      const problemsData = response.data?.problems || [];
      const problemsArray = Array.isArray(problemsData) ? problemsData : [];
      
      setProblems(problemsArray);
      setCurrentPage(1);
    } catch (err) {
      setError("Failed to load your problems. Please try again.");
      console.error(err);
      setProblems([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (activeTab === "all") {
      fetchAllProblems();
    } else {
      fetchMyProblems();
    }
  }, [activeTab]);

  // Filtered and sorted data
  const filteredData = React.useMemo(() => {
    let filtered = [...problems];

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(problem =>
        (problem.title || "").toLowerCase().includes(term) ||
        (problem.description  || "").toLowerCase().includes(term)
      );
    }

    if (filters.level !== "all") {
      filtered = filtered.filter(problem => (problem.level || "easy") === filters.level);
    }

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
  }, [problems, filters, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Stats
  const stats = React.useMemo(() => {
    return {
      total: problems.length,
      easy: problems.filter(p => (p.level || "easy") === "easy").length,
      medium: problems.filter(p => (p.level || "easy") === "medium").length,
      hard: problems.filter(p => (p.level || "easy") === "hard").length
    };
  }, [problems]);

  // Handlers
  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const handleSelectProblem = (problemId) => {
    setSelectedProblems(prev =>
      prev.includes(problemId)
        ? prev.filter(id => id !== problemId)
        : [...prev, problemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProblems.length === paginatedData.length) {
      setSelectedProblems([]);
    } else {
      setSelectedProblems(paginatedData.map(p => p._id));
    }
  };

  const handleCreate = () => {
    setSelectedProblem(null);
    setShowCreateProblemModal(true);
  };

  const handleEdit = (problem) => {
    setSelectedProblem(problem);
    setShowUpdateProblemModal(true);
  };

  const handleDelete = (problem) => {
    setDeleteTarget(problem);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await API.delete(`/superadmin/problem/${deleteTarget._id}`);
      setShowConfirmDelete(false);
      alert("Problem deleted successfully!");
      if (activeTab === "all") {
        fetchAllProblems();
      } else {
        fetchMyProblems();
      }
    } catch (err) {
      alert("Error deleting problem: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProblems.length === 0) return;
    if (!window.confirm(`Delete ${selectedProblems.length} problem(s)?`)) return;

    try {
      setLoading(true);
      await Promise.all(selectedProblems.map(id => API.delete(`/superadmin/problem/${id}`)));
      setSelectedProblems([]);
      alert("Problems deleted successfully!");
      if (activeTab === "all") {
        fetchAllProblems();
      } else {
        fetchMyProblems();
      }
    } catch (err) {
      alert("Error deleting problems: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level) => {
    if (level === "easy") return "easy";
    if (level === "medium") return "medium";
    if (level === "hard") return "hard";
    return "medium";
  };

  // DataTable columns
  const columns = [
    {
      key: "checkbox",
      header: (
        <input
          type="checkbox"
          checked={selectedProblems.length === paginatedData.length && paginatedData.length > 0}
          onChange={handleSelectAll}
        />
      ),
      render: (row) => {
        if (!row?._id) return null;
        return (
          <input
            type="checkbox"
            checked={selectedProblems.includes(row._id)}
            onChange={() => handleSelectProblem(row._id)}
          />
        );
      },
      width: "50px",
      hideOnMobile: false
    },
    {
      key: "title",
      header: "Problem Title",
      sortable: true,
      render: (row) => {
        if (!row) return <div>-</div>;
        return (
          <div>
            <div className="font-bold">{row.title  || "-"}</div>
            <div className="text-sm text-gray-500 mobile-hidden">{( row.description || "").substring(0, 40)}...</div>
          </div>
        );
      },
      hideOnMobile: false
    },
    {
      key: "level",
      header: "Difficulty",
      sortable: true,
      render: (row) => {
        if (!row) return <span>-</span>;
        return (
          <span className={`status-badge difficulty-${getLevelColor(row.level || "easy")}`}>
            {(row.level || "easy").toUpperCase()}
          </span>
        );
      },
      hideOnMobile: true
    },
    {
      key: "score",
      header: "Points",
      sortable: true,
      render: (row) => {
        if (!row) return <span>-</span>;
        return `${row.score || 100}`;
      },
      hideOnMobile: false
    },
    {
      key: "submissions",
      header: "Submissions",
      sortable: true,
      render: (row) => {
        if (!row) return <span>-</span>;
        return row.submissions || 0;
      },
      hideOnMobile: true
    },
    {
      key: "reusableInEvents",
      header: "Reusable",
      render: (row) => {
        if (!row) return <span>-</span>;
        return row.reusableInEvents ? "✓ Yes" : "✗ No";
      },
      hideOnMobile: true
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => {
        if (!row?._id) return <span>-</span>;
        return (
          <div className="flex gap-2 flex-wrap actions-column">
            <button
              className="btn btn-sm btn-info action-btn-view"
              onClick={() => {
                setSelectedProblem(row);
                setShowDetailsModal(true);
              }}
              title="View problem details"
            >
              View
            </button>
            <button
              className="btn btn-sm btn-primary action-btn-edit"
              onClick={() => handleEdit(row)}
              title="Edit this problem"
            >
              Edit
            </button>
            <button
              className="btn btn-sm btn-danger action-btn-delete"
              onClick={() => handleDelete(row)}
              title="Delete this problem"
            >
              Delete
            </button>
          </div>
        );
      },
      hideOnMobile: false
    }
  ];

  if (loading && !problems.length) {
    return <div className="p-8 text-center">Loading problems...</div>;
  }

  return (
    <div className="enhanced-page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Problems Management</h1>
          <p className="page-subtitle">Create and manage coding problems</p>
        </div>
        <button className="btn btn-primary btn-create-fixed" onClick={handleCreate}>
          + Create Problem
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === "all" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("all");
            setCurrentPage(1);
            setSelectedProblems([]);
          }}
        >
          All Problems
        </button>
        <button
          className={`tab-button ${activeTab === "myProblems" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("myProblems");
            setCurrentPage(1);
            setSelectedProblems([]);
          }}
        >
          My Created Problems
        </button>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-label">Total Problems</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Easy</div>
          <div className="stat-value text-green-500">{stats.easy}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Medium</div>
          <div className="stat-value text-orange-500">{stats.medium}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Hard</div>
          <div className="stat-value text-red-500">{stats.hard}</div>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="error-message">⚠️ {error}</div>}

      {/* Bulk Actions */}
      {selectedProblems.length > 0 && (
        <div className="bulk-actions-toolbar">
          <span>{selectedProblems.length} problem(s) selected</span>
          <button className="btn btn-sm btn-danger" onClick={handleBulkDelete}>
            Delete Selected
          </button>
          <button className="btn btn-sm btn-secondary" onClick={() => setSelectedProblems([])}>
            Clear Selection
          </button>
        </div>
      )}

      {/* Filter Section */}
      <div className="filter-section">
        <button
          className="filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          🔍 Filters {showFilters ? "▾" : "▸"}
        </button>

        {showFilters && (
          <div className="filter-panel">
            <div className="filter-group">
              <label>Search</label>
              <input
                type="text"
                placeholder="Search problems..."
                value={filters.searchTerm}
                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="filter-group">
              <label>Difficulty</label>
              <select
                value={filters.level}
                onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                className="form-input"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <button
              className="btn btn-secondary"
              onClick={() => setFilters({ searchTerm: "", level: "all" })}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="content-area">
        {filteredData.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No Problems Found</h3>
            <p>{activeTab === "all" ? "No reusable problems available" : "You haven't created any problems yet"}</p>
            <button className="btn btn-primary" onClick={handleCreate}>
              Create Problem
            </button>
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

      {/* Problem Form Modal */}
      <CreateProblem
        isOpen={showCreateProblemModal}
        onClose={() => setShowCreateProblemModal(false)}
        onSuccess={() => {
          if (activeTab === "all") {
            fetchAllProblems();
          } else {
            fetchMyProblems();
          }
        }}
      />

      <UpdateProblem
        isOpen={showUpdateProblemModal}
        problem={selectedProblem}
        onClose={() => setShowUpdateProblemModal(false)}
        onSuccess={() => {
          if (activeTab === "all") {
            fetchAllProblems();
          } else {
            fetchMyProblems();
          }
        }}
      />

      {/* Details Modal */}
      {showDetailsModal && selectedProblem && (
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title={selectedProblem.title}
          size="large"
        >
          <div className="modal-content details-modal-content">
            {/* Basic Info */}
            <div className="details-section">
              <h3 className="details-section-title">Problem Information</h3>
              
              <div className="details-row">
                <div className="label">Title:</div>
                <span className="value">{selectedProblem.title || "-"}</span>
              </div>

              <div className="details-row">
                <div className="label">Description:</div>
                <span className="value description-text">{selectedProblem.description || "-"}</span>
              </div>

              <div className="details-row">
                <div className="label">Difficulty Level:</div>
                <span className={`status-badge difficulty-${getLevelColor(selectedProblem.level || "easy")}`}>
                  {(selectedProblem.level || "easy").toUpperCase()}
                </span>
              </div>

              <div className="details-row">
                <div className="label">Points:</div>
                <span className="value">{selectedProblem.score || 100}</span>
              </div>

              <div className="details-row">
                <div className="label">Total Submissions:</div>
                <span className="value">{selectedProblem.submissions || 0}</span>
              </div>

              <div className="details-row">
                <div className="label">Reusable in Events:</div>
                <span className="value">
                  {selectedProblem.reusableInEvents ? (
                    <span style={{ color: '#16a34a' }}>✓ Yes</span>
                  ) : (
                    <span style={{ color: '#dc2626' }}>✗ No</span>
                  )}
                </span>
              </div>
            </div>

            {/* Sample Test Cases */}
            {selectedProblem.sampleTestCases && selectedProblem.sampleTestCases.length > 0 && (
              <div className="details-section">
                <h3 className="details-section-title">Sample Test Cases</h3>
                {selectedProblem.sampleTestCases.map((testCase, index) => (
                  <div key={index} className="test-case-display">
                    <div className="test-case-number">Sample #{index + 1}</div>
                    <div className="test-case-content">
                      <div className="test-case-item">
                        <span className="test-case-label">Input:</span>
                        <pre className="test-case-value">{testCase.input || "-"}</pre>
                      </div>
                      <div className="test-case-item">
                        <span className="test-case-label">Output:</span>
                        <pre className="test-case-value">{testCase.output || "-"}</pre>
                      </div>
                      {testCase.explanation && (
                        <div className="test-case-item">
                          <span className="test-case-label">Explanation:</span>
                          <p className="test-case-explanation">{testCase.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Hidden Test Cases */}
            {selectedProblem.hiddenTestCases && selectedProblem.hiddenTestCases.length > 0 && (
              <div className="details-section">
                <h3 className="details-section-title">Hidden Test Cases</h3>
                {selectedProblem.hiddenTestCases.map((testCase, index) => (
                  <div key={index} className="test-case-display">
                    <div className="test-case-number">Hidden #{index + 1}</div>
                    <div className="test-case-content">
                      <div className="test-case-item">
                        <span className="test-case-label">Input:</span>
                        <pre className="test-case-value">{testCase.input || "-"}</pre>
                      </div>
                      <div className="test-case-item">
                        <span className="test-case-label">Output:</span>
                        <pre className="test-case-value">{testCase.output || "-"}</pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowDetailsModal(false)}>
                Close
              </button>
              <button className="btn btn-primary" onClick={() => {
                handleEdit(selectedProblem);
                setShowDetailsModal(false);
              }}>
                Edit Problem
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirm Delete Modal */}
      {showConfirmDelete && deleteTarget && (
        <ConfirmDialog
          isOpen={showConfirmDelete}
          title="Delete Problem"
          message={`Are you sure you want to delete "${ deleteTarget.title}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirmDelete(false)}
          isDangerous={true}
        />
      )}
    </div>
  );
};

export default Problems;