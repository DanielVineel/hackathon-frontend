import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/common/Pagination";
import { getBlutoStorage, setBlutoStorage } from "../../utils/storage";
import "../styles/ProblemsPage.css";

const SuperAdminProblems = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Filters with bluto namespace
  const [searchTerm, setSearchTerm] = useState(
    getBlutoStorage("superadmin-problems-search", "")
  );
  const [selectedEvent, setSelectedEvent] = useState(
    getBlutoStorage("superadmin-problems-event", "all")
  );
  const [selectedLevel, setSelectedLevel] = useState(
    getBlutoStorage("superadmin-problems-level", "all")
  );
  const [sortBy, setSortBy] = useState(
    getBlutoStorage("superadmin-problems-sort", "name")
  );
  const [sortOrder, setSortOrder] = useState(
    getBlutoStorage("superadmin-problems-sort-order", "asc")
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    statement: "",
    level: "easy",
    score: 100,
    sampleTestCases: [{ input: "", output: "", explanation: "" }],
    hiddenTestCases: [{ input: "", output: "" }],
  });

  useEffect(() => {
    fetchProblems();
    fetchEvents();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/problems", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("bluto_superadmin_token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProblems(data.problems || []);
      } else {
        console.error("Failed to fetch problems");
      }
    } catch (error) {
      console.error("Error fetching problems:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("bluto_superadmin_token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "score" ? Number(value) : value,
    }));
  };

  const handleSampleTestCaseChange = (index, field, value) => {
    const updated = [...formData.sampleTestCases];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({
      ...prev,
      sampleTestCases: updated,
    }));
  };

  const handleHiddenTestCaseChange = (index, field, value) => {
    const updated = [...formData.hiddenTestCases];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({
      ...prev,
      hiddenTestCases: updated,
    }));
  };

  const addSampleTestCase = () => {
    setFormData((prev) => ({
      ...prev,
      sampleTestCases: [...prev.sampleTestCases, { input: "", output: "", explanation: "" }],
    }));
  };

  const addHiddenTestCase = () => {
    setFormData((prev) => ({
      ...prev,
      hiddenTestCases: [...prev.hiddenTestCases, { input: "", output: "" }],
    }));
  };

  const removeSampleTestCase = (index) => {
    setFormData((prev) => ({
      ...prev,
      sampleTestCases: prev.sampleTestCases.filter((_, i) => i !== index),
    }));
  };

  const removeHiddenTestCase = (index) => {
    setFormData((prev) => ({
      ...prev,
      hiddenTestCases: prev.hiddenTestCases.filter((_, i) => i !== index),
    }));
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      const url = editingProblem
        ? `/api/problems/${editingProblem._id}`
        : "/api/problems";
      const method = editingProblem ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("bluto_superadmin_token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowCreateModal(false);
        setEditingProblem(null);
        setFormData({
          name: "",
          statement: "",
          level: "easy",
          score: 100,
          sampleTestCases: [{ input: "", output: "", explanation: "" }],
          hiddenTestCases: [{ input: "", output: "" }],
        });
        fetchProblems();
      } else {
        alert("Error creating/updating problem");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating/updating problem");
    }
  };

  const handleEdit = (problem) => {
    setEditingProblem(problem);
    setFormData({
      name: problem.name,
      statement: problem.statement,
      level: problem.level,
      score: problem.score,
      sampleTestCases: problem.sampleTestCases || [{ input: "", output: "", explanation: "" }],
      hiddenTestCases: problem.hiddenTestCases || [{ input: "", output: "" }],
    });
    setShowCreateModal(true);
  };

  const handleDelete = async (problemId) => {
    try {
      const response = await fetch(`/api/problems/${problemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("bluto_superadmin_token")}`,
        },
      });

      if (response.ok) {
        fetchProblems();
        setDeleteConfirm(null);
      } else {
        alert("Error deleting problem");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error deleting problem");
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setBlutoStorage("superadmin-problems-search", term);
    setCurrentPage(1);
  };

  const handleEventChange = (e) => {
    const value = e.target.value;
    setSelectedEvent(value);
    setBlutoStorage("superadmin-problems-event", value);
    setCurrentPage(1);
  };

  const handleLevelChange = (e) => {
    const value = e.target.value;
    setSelectedLevel(value);
    setBlutoStorage("superadmin-problems-level", value);
    setCurrentPage(1);
  };

  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    setBlutoStorage("superadmin-problems-sort", field);
    setBlutoStorage("superadmin-problems-sort-order", order);
    setCurrentPage(1);
  };

  // Filter logic: robust, case-insensitive, trims whitespace
  const filteredProblems = problems.filter((problem) => {
    const search = (searchTerm || "").trim().toLowerCase();
    const name = (problem.name || "").toLowerCase();
    const statement = (problem.statement || "").toLowerCase();
    const matchesSearch = !search || name.includes(search) || statement.includes(search);
    const matchesEvent = selectedEvent === "all" || (problem.events && Array.isArray(problem.events) && problem.events.includes(selectedEvent));
    const matchesLevel = selectedLevel === "all" || problem.level === selectedLevel;
    return matchesSearch && matchesEvent && matchesLevel;
  });

  // Sort logic
  const sortedProblems = [...filteredProblems].sort((a, b) => {
    let compareValue = 0;
    if (sortBy === "name") {
      compareValue = (a.name || "").localeCompare(b.name || "");
    } else if (sortBy === "difficulty") {
      const diffOrder = { easy: 1, medium: 2, hard: 3 };
      compareValue = (diffOrder[a.level] || 0) - (diffOrder[b.level] || 0);
    } else if (sortBy === "score") {
      compareValue = (a.score || 0) - (b.score || 0);
    }
    return sortOrder === "asc" ? compareValue : -compareValue;
  });

  const paginatedData = {
    data: sortedProblems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    pages: Math.ceil(sortedProblems.length / ITEMS_PER_PAGE),
  };

  if (loading) {
    return (
      <div className="problems-container">
        <p>Loading problems...</p>
      </div>
    );
  }

  return (
    <div className="problems-container">
      {/* Header */}
      <div className="page-header">
        <h1>Problems Management</h1>
        <button
          className="btn-primary"
          onClick={() => {
            setEditingProblem(null);
            setFormData({
              name: "",
              statement: "",
              level: "easy",
              score: 100,
              sampleTestCases: [{ input: "", output: "", explanation: "" }],
              hiddenTestCases: [{ input: "", output: "" }],
            });
            setShowCreateModal(true);
          }}
        >
          + Create Problem
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <input
            type="text"
            placeholder="🔍 Search problems by name or statement..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>Filter by Event:</label>
          <select
            value={selectedEvent}
            onChange={handleEventChange}
            className="filter-select"
          >
            <option value="all">All Events</option>
            {events.map((event) => (
              <option key={event._id} value={event._id}>
                {event.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Filter by Difficulty:</label>
          <select
            value={selectedLevel}
            onChange={handleLevelChange}
            className="filter-select"
          >
            <option value="all">All Levels</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value, sortOrder)}
            className="filter-select"
          >
            <option value="name">Name</option>
            <option value="difficulty">Difficulty</option>
            <option value="score">Points</option>
          </select>
          <button
            className="sort-order-btn"
            onClick={() =>
              handleSortChange(sortBy, sortOrder === "asc" ? "desc" : "asc")
            }
            title="Toggle sort order"
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>

      {/* Problems List */}
      <div className="problems-list">
        {paginatedData.data.length === 0 ? (
          <div className="no-problems">
            <p>No problems found. Create one to get started! 🚀</p>
          </div>
        ) : (
          <div className="problems-grid">
            {paginatedData.data.map((problem) => (
              <div key={problem._id} className="problem-card">
                <div className="problem-header">
                  <h3>{problem.name}</h3>
                  <span className={`level-badge level-${problem.level}`}>
                    {problem.level.toUpperCase()}
                  </span>
                </div>

                <p className="problem-statement">
                  {problem.statement.substring(0, 100)}...
                </p>

                <div className="problem-meta">
                  <span className="score-badge">🏆 {problem.score} pts</span>
                  <span className="reusable-badge">
                    {problem.reusableInEvents ? "✅ Reusable" : "🔒 Private"}
                  </span>
                </div>

                <div className="problem-testcases">
                  <span>📋 {problem.sampleTestCases?.length || 0} sample test cases</span>
                  <span>🔒 {problem.hiddenTestCases?.length || 0} hidden test cases</span>
                </div>

                <div className="problem-actions">
                  <button
                    className="btn-action edit"
                    onClick={() => handleEdit(problem)}
                    title="Edit this problem"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn-action assign"
                    onClick={() => navigate(`/superadmin/problems/${problem._id}/assign`)}
                    title="Assign to events"
                  >
                    🎯 Assign
                  </button>
                  <button
                    className="btn-action delete"
                    onClick={() => setDeleteConfirm(problem._id)}
                    title="Delete this problem"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={paginatedData.pages}
        onPageChange={setCurrentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={sortedProblems.length}
      />

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProblem ? "Edit Problem" : "Create New Problem"}</h2>
              <button
                className="modal-close"
                onClick={() => setShowCreateModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdate} className="problem-form">
              {/* Basic Info */}
              <div className="form-section">
                <h3>Problem Details</h3>

                <div className="form-group">
                  <label htmlFor="name">Problem Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Two Sum, Binary Search Tree"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="statement">Problem Statement *</label>
                  <textarea
                    id="statement"
                    name="statement"
                    value={formData.statement}
                    onChange={handleInputChange}
                    placeholder="Detailed problem description..."
                    rows="6"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="level">Difficulty Level *</label>
                    <select
                      id="level"
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="score">Points *</label>
                    <input
                      type="number"
                      id="score"
                      name="score"
                      value={formData.score}
                      onChange={handleInputChange}
                      min="1"
                      max="1000"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Sample Test Cases */}
              <div className="form-section">
                <div className="section-header">
                  <h3>Sample Test Cases (Visible to Users)</h3>
                  <button
                    type="button"
                    className="btn-small"
                    onClick={addSampleTestCase}
                  >
                    + Add Sample
                  </button>
                </div>

                {formData.sampleTestCases.map((testCase, index) => (
                  <div key={index} className="testcase-block">
                    <div className="testcase-number">Sample {index + 1}</div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Input</label>
                        <textarea
                          value={testCase.input}
                          onChange={(e) =>
                            handleSampleTestCaseChange(index, "input", e.target.value)
                          }
                          placeholder="Test input"
                          rows="3"
                        />
                      </div>

                      <div className="form-group">
                        <label>Expected Output</label>
                        <textarea
                          value={testCase.output}
                          onChange={(e) =>
                            handleSampleTestCaseChange(index, "output", e.target.value)
                          }
                          placeholder="Expected output"
                          rows="3"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Explanation (Optional)</label>
                      <textarea
                        value={testCase.explanation}
                        onChange={(e) =>
                          handleSampleTestCaseChange(index, "explanation", e.target.value)
                        }
                        placeholder="Explain this test case to help users"
                        rows="2"
                      />
                    </div>

                    {formData.sampleTestCases.length > 1 && (
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => removeSampleTestCase(index)}
                      >
                        Remove Sample
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Hidden Test Cases */}
              <div className="form-section">
                <div className="section-header">
                  <h3>Hidden Test Cases (For Evaluation)</h3>
                  <button
                    type="button"
                    className="btn-small"
                    onClick={addHiddenTestCase}
                  >
                    + Add Hidden
                  </button>
                </div>

                {formData.hiddenTestCases.map((testCase, index) => (
                  <div key={index} className="testcase-block hidden">
                    <div className="testcase-number">Hidden {index + 1}</div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Input</label>
                        <textarea
                          value={testCase.input}
                          onChange={(e) =>
                            handleHiddenTestCaseChange(index, "input", e.target.value)
                          }
                          placeholder="Test input"
                          rows="2"
                        />
                      </div>

                      <div className="form-group">
                        <label>Expected Output</label>
                        <textarea
                          value={testCase.output}
                          onChange={(e) =>
                            handleHiddenTestCaseChange(index, "output", e.target.value)
                          }
                          placeholder="Expected output"
                          rows="2"
                        />
                      </div>
                    </div>

                    {formData.hiddenTestCases.length > 1 && (
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => removeHiddenTestCase(index)}
                      >
                        Remove Hidden
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  {editingProblem ? "Update Problem" : "Create Problem"}
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-content modal-small">
            <h2>Delete Problem?</h2>
            <p>
              Are you sure you want to delete this problem? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button
                className="btn-danger"
                onClick={() => handleDelete(deleteConfirm)}
              >
                Yes, Delete
              </button>
              <button
                className="btn-secondary"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminProblems;
