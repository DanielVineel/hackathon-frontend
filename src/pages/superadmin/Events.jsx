import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import DataTable from "../../components/common/DataTable";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { CreateEvent, UpdateEvent } from "./operations";
import "../../styles/EnhancedPages.css";
import "./Events.css";

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("startDate");
  const [sortOrder, setSortOrder] = useState("asc");

  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: "",
    status: "all",
    dateRange: "all"
  });

  // Bulk operations
  const [selectedEvents, setSelectedEvents] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Modals
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showUpdateEventModal, setShowUpdateEventModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Fetch events and problems
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get("/superadmin/events");
      setEvents(response.data?.events || []);
      setCurrentPage(1);
    } catch (err) {
      setError("Failed to load events. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProblems = async () => {
    try {
      const myresponse = await API.get("/superadmin/problems/created");
      const myProblems = myresponse.data?.problems || [];

      const response = await API.get("/problems");
      // Filter problems: only manager's problems + reusableInEvent problems
      const allProblems = response.data?.problems || [];
      
      // Combine arrays and remove duplicates based on _id
      const seenIds = new Set();
      const combinedProblems = [];
      
      [...myProblems, ...allProblems].forEach(problem => {
        if (problem._id && !seenIds.has(problem._id)) {
          seenIds.add(problem._id);
          combinedProblems.push(problem);
        }
      });
      
      setProblems(combinedProblems);
    } catch (err) {
      console.error("Failed to fetch problems:", err);
      setProblems([]);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchProblems();
  }, []);

  // Filtered and sorted data
  const filteredData = React.useMemo(() => {
    let filtered = [...events];

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(event =>
        event.title?.toLowerCase().includes(term) ||
        event.description?.toLowerCase().includes(term)
      );
    }

    if (filters.status !== "all") {
      filtered = filtered.filter(event => {
        const now = new Date();
        const start = new Date(event.startDate);
        const end = new Date(event.endDate);

        if (filters.status === "upcoming") return start > now;
        if (filters.status === "ongoing") return start <= now && end >= now;
        if (filters.status === "completed") return end < now;
        return true;
      });
    }

    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [events, filters, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Stats
  const stats = React.useMemo(() => {
    const now = new Date();
    return {
      total: events.length,
      upcoming: events.filter(e => new Date(e.startDate) > now).length,
      ongoing: events.filter(e => {
        const start = new Date(e.startDate);
        const end = new Date(e.endDate);
        return start <= now && end >= now;
      }).length,
      completed: events.filter(e => new Date(e.endDate) < now).length
    };
  }, [events]);

  // Handlers
  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const handleSelectEvent = (eventId) => {
    setSelectedEvents(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEvents.length === paginatedData.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(paginatedData.map(e => e._id));
    }
  };

  const handleCreate = () => {
    setSelectedEvent(null);
    setShowCreateEventModal(true);
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setShowUpdateEventModal(true);
  };

  const handleDelete = (event) => {
    setDeleteTarget(event);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await API.delete(`/superadmin/event/${deleteTarget._id}`);
      setShowConfirmDelete(false);
      alert("Event deleted successfully!");
      fetchEvents();
    } catch (err) {
      alert("Error deleting event: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getEventStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > now) return "Upcoming";
    if (start <= now && end >= now) return "Ongoing";
    return "Completed";
  };

  // DataTable columns
  const columns = [
    {
      key: "checkbox",
      header: (
        <input
          type="checkbox"
          checked={selectedEvents.length === paginatedData.length && paginatedData.length > 0}
          onChange={handleSelectAll}
        />
      ),
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedEvents.includes(row._id)}
          onChange={() => handleSelectEvent(row._id)}
        />
      ),
      width: "50px",
      hideOnMobile: false
    },
    {
      key: "title",
      header: "Event Title",
      sortable: true,
      render: (row) => (
        <div>
          <div className="font-bold">{row.name}</div>
          <div className="text-sm text-gray-500 mobile-hidden">{row.description?.substring(0, 40)}...</div>
        </div>
      ),
      hideOnMobile: false
    },
    {
      key: "startDate",
      header: "Start Date",
      sortable: true,
      render: (row) => new Date(row.startDate).toLocaleDateString(),
      hideOnMobile: true
    },
    {
      key: "endDate",
      header: "End Date",
      sortable: true,
      render: (row) => new Date(row.endDate).toLocaleDateString(),
      hideOnMobile: true
    },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        const status = getEventStatus(row.startDate, row.endDate);
        const statusClass = status === "Upcoming" ? "upcoming" : status === "Ongoing" ? "ongoing" : "completed";
        return <span className={`status-badge status-${statusClass}`}>{status}</span>;
      },
      hideOnMobile: false
    },
    {
      key: "fee",
      header: "Fee",
      render: (row) => `₹${row.fee || 0}`,
      hideOnMobile: true
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2 flex-wrap actions-column">
          <button
            className="btn btn-sm btn-info action-btn-view"
            onClick={() => {
              setSelectedEvent(row);
              setShowDetailsModal(true);
            }}
            title="View event details"
          >
            View
          </button>
          <button
            className="btn btn-sm btn-primary action-btn-edit"
            onClick={() => handleEdit(row)}
            title="Edit this event"
          >
            Edit
          </button>
          <button
            className="btn btn-sm btn-danger action-btn-delete"
            onClick={() => handleDelete(row)}
            title="Delete this event"
          >
            Delete
          </button>
        </div>
      ),
      hideOnMobile: false
    }
  ];

  if (loading && !events.length) {
    return <div className="p-8 text-center">Loading events...</div>;
  }

  return (
    <div className="enhanced-page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Events Management</h1>
          <p className="page-subtitle">Manage your hackathon events</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          + Create Event
        </button>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-label">Total Events</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Upcoming</div>
          <div className="stat-value text-blue-500">{stats.upcoming}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Ongoing</div>
          <div className="stat-value text-green-500">{stats.ongoing}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Completed</div>
          <div className="stat-value text-gray-500">{stats.completed}</div>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="error-message">⚠️ {error}</div>}

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
                placeholder="Search events..."
                value={filters.searchTerm}
                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="filter-group">
              <label>Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="form-input"
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Date Range</label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                className="form-input"
              >
                <option value="all">All Dates</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
            </div>

            <button
              className="btn btn-secondary"
              onClick={() => setFilters({ searchTerm: "", status: "all", dateRange: "all" })}
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
            <h3>No Events Found</h3>
            <p>Create your first event to get started</p>
            <button className="btn btn-primary" onClick={handleCreate}>
              Create Event
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

      {/* Event Form Modal */}
      <CreateEvent
        isOpen={showCreateEventModal}
        problems={problems}
        onClose={() => setShowCreateEventModal(false)}
        onSuccess={fetchEvents}
      />

      <UpdateEvent
        isOpen={showUpdateEventModal}
        event={selectedEvent}
        problems={problems}
        onClose={() => setShowUpdateEventModal(false)}
        onSuccess={fetchEvents}
      />

      {/* Details Modal */}
      {showDetailsModal && selectedEvent && (
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title={selectedEvent.title}
          size="large"
        >
          <div className="modal-content details-modal-content">
            {/* Event Information */}
            <div className="details-section">
              <h3 className="details-section-title">Event Information</h3>
              
              <div className="details-row">
                <div className="label">Title:</div>
                <span className="value">{selectedEvent.title || "-"}</span>
              </div>

              <div className="details-row">
                <div className="label">Description:</div>
                <span className="value description-text">{selectedEvent.description || "-"}</span>
              </div>

              <div className="details-row">
                <div className="label">Status:</div>
                <span>
                  {(() => {
                    const status = getEventStatus(selectedEvent.startDate, selectedEvent.endDate);
                    const statusClass = status === "Upcoming" ? "upcoming" : status === "Ongoing" ? "ongoing" : "completed";
                    return <span className={`status-badge status-${statusClass}`}>{status}</span>;
                  })()}
                </span>
              </div>
            </div>

            {/* Date & Time */}
            <div className="details-section">
              <h3 className="details-section-title">Date & Time</h3>
              
              <div className="details-row">
                <div className="label">Start Date:</div>
                <span className="value">{new Date(selectedEvent.startDate).toLocaleString()}</span>
              </div>

              <div className="details-row">
                <div className="label">End Date:</div>
                <span className="value">{new Date(selectedEvent.endDate).toLocaleString()}</span>
              </div>
            </div>

            {/* Financial Details */}
            <div className="details-section">
              <h3 className="details-section-title">Financial Details</h3>
              
              <div className="details-row">
                <div className="label">Fee:</div>
                <span className="value">₹{selectedEvent.fee || 0}</span>
              </div>

              <div className="details-row">
                <div className="label">Prize Money:</div>
                <span className="value">₹{selectedEvent.prizeMoney || 0}</span>
              </div>

              <div className="details-row">
                <div className="label">Venue:</div>
                <span className="value">{selectedEvent.venue || "Not specified"}</span>
              </div>
            </div>

            {/* Problems */}
            {selectedEvent.problems && selectedEvent.problems.length > 0 && (
              <div className="details-section">
                <h3 className="details-section-title">Associated Problems</h3>
                <div className="problems-list-display">
                  {selectedEvent.problems.map((problemId, index) => {
                    const problem = problems.find(p => p._id === problemId);
                    return (
                      <div key={index} className="problem-item-display">
                        <div className="problem-number">{index + 1}.</div>
                        <div className="problem-info">
                          <div className="problem-title">{problem?.title || "Unknown Problem"}</div>
                          <div className="problem-meta">
                            {problem?.level && (
                              <span className={`difficulty-badge difficulty-${problem.level.toLowerCase()}`}>
                                {problem.level}
                              </span>
                            )}
                            {problem?.score && (
                              <span className="problem-score">Score: {problem.score}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowDetailsModal(false)}>
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  handleEdit(selectedEvent);
                  setShowDetailsModal(false);
                }}
              >
                Edit Event
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirm Delete Modal */}
      {showConfirmDelete && deleteTarget && (
        <ConfirmDialog
          isOpen={showConfirmDelete}
          title="Delete Event"
          message={`Are you sure you want to delete "${deleteTarget.title}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirmDelete(false)}
          isDangerous={true}
        />
      )}
    </div>
  );
};

export default Events;
  