// src/pages/manager/Problems.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import DataTable from "../../components/common/DataTable";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { CreateProblem, UpdateProblem } from "./operations";
import "../styles/manager/Problems.css";

const Problems = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: "",
    difficulty: "all"
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



  // Fetch problems
  const fetchProblems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get("/manager/problems");
      setProblems(response.data?.data || response.data?.problems || []);
      setCurrentPage(1);
    } catch (err) {
      setError("Failed to load problems. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  // Filtered and sorted data
  const filteredData = React.useMemo(() => {
    let filtered = [...problems];

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(problem =>
        problem.title?.toLowerCase().includes(term) ||
        problem.name?.toLowerCase().includes(term) ||
        problem.description?.toLowerCase().includes(term)
      );
    }

    if (filters.difficulty !== "all") {
      filtered = filtered.filter(problem => problem.difficulty === filters.difficulty || problem.level === filters.difficulty);
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
      easy: problems.filter(p => p.difficulty === "easy" || p.level === "easy").length,
      medium: problems.filter(p => p.difficulty === "medium" || p.level === "medium").length,
      hard: problems.filter(p => p.difficulty === "hard" || p.level === "hard").length
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
      await API.delete(`/manager/problem/${deleteTarget._id}`);
      setShowConfirmDelete(false);
      alert("Problem deleted successfully!");
      fetchProblems();
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
      await Promise.all(selectedProblems.map(id => API.delete(`/manager/problem/${id}`)));
      setSelectedProblems([]);
      alert("Problems deleted successfully!");
      fetchProblems();
    } catch (err) {
      alert("Error deleting problems: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty === "easy") return "easy";
    if (difficulty === "medium") return "medium";
    if (difficulty === "hard") return "hard";
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
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedProblems.includes(row._id)}
          onChange={() => handleSelectProblem(row._id)}
        />
      ),
      width: "50px"
    },
    {
      key: "title",
      header: "Problem Title",
      sortable: true,
      render: (row) => (
        <div>
          <div className="font-bold">{row.title || row.name}</div>
          <div className="text-sm text-gray-500">{row.description?.substring(0, 40)}...</div>
        </div>
      )
    },
    {
      key: "difficulty",
      header: "Difficulty",
      sortable: true,
      render: (row) => (
        <span className={`status-badge difficulty-${getDifficultyColor(row.difficulty || row.level)}`}>
          {(row.difficulty || row.level || "Easy").toUpperCase()}
        </span>
      )
    },
    {
      key: "score",
      header: "Points",
      sortable: true,
      render: (row) => `${row.score || 100}`
    },
    {
      key: "submissions",
      header: "Submissions",
      sortable: true,
      render: (row) => row.submissions || 0
    },
    {
      key: "reusableInEvent",
      header: "Reusable",
      render: (row) => row.reusableInEvent ? "✓ Yes" : "✗ No"
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            className="btn btn-sm btn-info"
            onClick={() => {
              setSelectedProblem(row);
              setShowDetailsModal(true);
            }}
          >
            View
          </button>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => handleEdit(row)}
          >
            Edit
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => handleDelete(row)}
          >
            Delete
          </button>
        </div>
      )
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
        <button className="btn btn-primary" onClick={handleCreate}>
          + Create Problem
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
                value={filters.difficulty}
                onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
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
              onClick={() => setFilters({ searchTerm: "", difficulty: "all" })}
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
            <p>Create your first problem to get started</p>
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

      <CreateProblem
        isOpen={showCreateProblemModal}
        onClose={() => setShowCreateProblemModal(false)}
        onSuccess={fetchProblems}
      />

      <UpdateProblem
        isOpen={showUpdateProblemModal}
        problem={selectedProblem}
        onClose={() => setShowUpdateProblemModal(false)}
        onSuccess={fetchProblems}
      />

      {/* Details Modal */}
      {showDetailsModal && selectedProblem && (
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title={selectedProblem.title || selectedProblem.name}
        >
          <div className="modal-content">
            <div className="details-row">
              <div className="label">Title:</div>
              <span>{selectedProblem.title || selectedProblem.name}</span>
            </div>
            <div className="details-row">
              <div className="label">Description:</div>
              <span>{selectedProblem.description}</span>
            </div>
            <div className="details-row">
              <div className="label">Difficulty:</div>
              <span className={`status-badge difficulty-${getDifficultyColor(selectedProblem.difficulty || selectedProblem.level)}`}>
                {(selectedProblem.difficulty || selectedProblem.level || "Easy").toUpperCase()}
              </span>
            </div>
            <div className="details-row">
              <div className="label">Points:</div>
              <span>{selectedProblem.score || 100}</span>
            </div>
            <div className="details-row">
              <div className="label">Submissions:</div>
              <span>{selectedProblem.submissions || 0}</span>
            </div>
            <div className="details-row">
              <div className="label">Reusable in Events:</div>
              <span>{selectedProblem.reusableInEvent ? "✓ Yes" : "✗ No"}</span>
            </div>
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
          message={`Are you sure you want to delete "${deleteTarget.title || deleteTarget.name}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirmDelete(false)}
          isDangerous={true}
        />
      )}
    </div>
  );
};

export default Problems;
