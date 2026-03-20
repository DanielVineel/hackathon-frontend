import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/common/Pagination";
import { getBlutoStorage, setBlutoStorage } from "../../utils/storage";
import { applyFilters } from "../../utils/filters";
import { paginateArray } from "../../utils/pagination";
import API from "../../api/api";
import "../styles/ManagerProblems.css";

const ManagerProblems = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Filters with bluto namespace
  const [searchTerm, setSearchTerm] = useState(
    getBlutoStorage("manager-problems-search", "")
  );
  const [selectedEvent, setSelectedEvent] = useState(
    getBlutoStorage("manager-problems-event", "all")
  );
  const [sortBy, setSortBy] = useState(
    getBlutoStorage("manager-problems-sort", "name")
  );
  const [sortOrder, setSortOrder] = useState(
    getBlutoStorage("manager-problems-sort-order", "asc")
  );
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    statement: "",
    difficulty: "medium",
    score: 100,
    eventId: "",
    reusable: false,
    sampleTestCases: [],
    hiddenTestCases: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [problemsRes, eventsRes] = await Promise.all([
        API.get("/manager/problems").catch(() => ({ data: { data: [] } })),
        API.get("/manager/events").catch(() => ({ data: { data: [] } })),
      ]);
      setProblems(problemsRes.data?.data || []);
      setEvents(eventsRes.data?.data || []);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/manager/problems/${editingId}`, formData);
        alert("Problem updated!");
      } else {
        await API.post("/manager/problems", formData);
        alert("Problem created!");
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (err) {
      alert("Error saving problem");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this problem?")) return;
    try {
      await API.delete(`/manager/problems/${id}`);
      setProblems(problems.filter((p) => p._id !== id));
    } catch (err) {
      alert("Error deleting problem");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      statement: "",
      difficulty: "medium",
      score: 100,
      eventId: "",
      reusable: false,
      sampleTestCases: [],
      hiddenTestCases: [],
    });
    setEditingId(null);
  };

  const filteredProblems = applyFilters(problems, {
    searchTerm,
    searchFields: ["name", "statement"],
    sortBy,
    sortOrder,
  }).filter((problem) => {
    return selectedEvent === "all" || problem.eventId === selectedEvent;
  });

  const paginatedData = paginateArray(
    filteredProblems,
    currentPage,
    ITEMS_PER_PAGE
  );

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setBlutoStorage("manager-problems-search", term);
    setCurrentPage(1);
  };

  const handleEventChange = (e) => {
    const event = e.target.value;
    setSelectedEvent(event);
    setBlutoStorage(handleSearchChange}
          className="search-input"
        />
        <select value={selectedEvent} onChange={handleEventChange} className="event-select">
          <option value="all">All Events</option>
          {events.map((e) => (
            <option key={e._id} value={e._id}>
              {e.name}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value, sortOrder)}
          className="sort-select"
        >
          <option value="name">Sort by Name</option>
          <option value="difficulty">Sort by Difficulty</option>
          <option value="score">Sort by Score</option>
        </select>
        <button
          className="sort-order-btn"
          onClick={() =>
            handleSortChange(sortBy, sortOrder === "asc" ? "desc" : "asc")
          }
          title="Toggle sort order"
        >
          {sortOrder === "asc" ? "↑" : "↓"}
        </buttonge(1);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="manager-problems">
      <div className="header">
        <h1>Problems</h1>
        <button className="btn-create" onClick={() => setShowModal(true)}>
          ➕ Create Problem
        </button>
      <paginatedData.data.length > 0 ? (
        <>
          <div className="problems-grid">
            {paginatedData.datars">
        <input
          type="text"
          placeholder="Search problems..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)}>
          <option value="all">All Events</option>
          {events.map((e) => (
            <option key={e._id} value={e._id}>
              {e.name}
            </option>
          ))}
        </select>
      </div>

      {filteredProblems.length > 0 ? (
        <div className="problems-grid">
          {filteredProblems.map((problem) => (
            <div key={problem._id} className="problem-card">
              <div className="card-header">
                <h3>{problem.name}</h3>
                <span className={`difficulty ${problem.difficulty}`}>
                  {problem.difficulty}
                </span>
              </div>
              <p>{problem.statement?.substring(0, 100)}...</p>
              <div className="card-meta">
                <span>Score: {problem.score}</span>
                <span>Tests: {(problem.sampleTestCases?.length || 0) + (problem.hiddenTestCases?.length || 0)}</span>
              </div>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={paginatedData.pages}
            onPageChange={setCurrentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={filteredProblems.length}
          />
        </ <div className="card-actions">
                <button
                  className="btn-edit"
                  onClick={() => {
                    setFormData(problem);
                    setEditingId(problem._id);
                    setShowModal(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(problem._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty">No problems found</div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? "Edit Problem" : "Create Problem"}</h2>
              <button
                className="close-btn"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSave} className="modal-form">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Statement *</label>
                <textarea
                  value={formData.statement}
                  onChange={(e) =>
                    setFormData({ ...formData, statement: e.target.value })
                  }
                  rows="5"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData({ ...formData, difficulty: e.target.value })
                    }
                  >
                    <option>easy</option>
                    <option>medium</option>
                    <option>hard</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Score</label>
                  <input
                    type="number"
                    value={formData.score}
                    onChange={(e) =>
                      setFormData({ ...formData, score: parseInt(e.target.value) })
                    }
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Event</label>
                <select
                  value={formData.eventId}
                  onChange={(e) =>
                    setFormData({ ...formData, eventId: e.target.value })
                  }
                >
                  <option value="">Select Event</option>
                  {events.map((e) => (
                    <option key={e._id} value={e._id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  {editingId ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerProblems;
