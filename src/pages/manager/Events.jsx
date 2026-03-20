import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/common/Pagination";
import FilterPanel from "../../components/common/FilterPanel";
import { getBlutoStorage, setBlutoStorage } from "../../utils/storage";
import { applyFilters } from "../../utils/filters";
import { paginateArray } from "../../utils/pagination";
import API from "../../api/api";
import "../styles/ManagerEvents.css";

const ManagerEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Filters with bluto namespace
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(
    getBlutoStorage("manager-events-filters", {})
  );
  const [searchTerm, setSearchTerm] = useState(
    getBlutoStorage("manager-events-search", "")
  );
  const [sortBy, setSortBy] = useState(
    getBlutoStorage("manager-events-sort", "createdAt")
  );
  const [sortOrder, setSortOrder] = useState(
    getBlutoStorage("manager-events-sort-order", "desc")
  );

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await API.get("/manager/events/created");
      setEvents(res.data?.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = applyFilters(events, {
    searchTerm,
    searchFields: ["name", "description"],
    filters: activeFilters,
    sortBy,
    sortOrder,
  });

  const paginatedData = paginateArray(
    filteredEvents,
    currentPage,
    ITEMS_PER_PAGE
  );

  const handleFilterChange = (filters) => {
    setBlutoStorage("manager-events-filters", filters);
    setActiveFilters(filters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setBlutoStorage("manager-events-filters", {});
    setBlutoStorage("manager-events-search", "");
    setActiveFilters({});
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setBlutoStorage("manager-events-search", term);
    setCurrentPage(1);
  };

  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    setBlutoStorage("manager-events-sort", field);
    setBlutoStorage("manager-events-sort-order", order);
    setCurrentPage(1);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await API.delete(`/manager/event/${eventId}`);
        fetchEvents();
        alert("Event deleted successfully");
      } catch (err) {
        alert("Error deleting event");
      }
    }
  };

  const filterConfig = [
    {
      key: "status",
      type: "multiselect",
      label: "Event Status",
      options: [
        { value: "upcoming", label: "Upcoming" },
        { value: "ongoing", label: "Ongoing" },
        { value: "completed", label: "Completed" },
      ],
    },
  ];

  const getStatusBadge = (status) => {
    const statusClass = `status-${status}`;
    return <span className={`status-badge ${statusClass}`}>{status}</span>;
  };

  if (loading) {
    return (
      <div className="manager-events">
        <div className="loading">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="manager-events">
      <header className="page-header">
        <div className="header-content">
          <h1>My Events</h1>
          <p>Manage all events you have created</p>
        </div>
        <button
          className="btn-create-event"
          onClick={() => navigate("/manager/create-event")}
        >
          + Create New Event
        </button>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="events-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search events..."
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
            <option value="name">Sort by Name</option>
            <option value="startDate">Sort by Start Date</option>
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
          <div className="events-grid">
            {paginatedData.data.map((event) => (
              <div key={event._id} className="event-card">
                <div className="card-header">
                  <h3>{event.name}</h3>
                  {getStatusBadge(event.status)}
                </div>

                <p className="event-description">
                  {event.description?.substring(0, 100)}...
                </p>

                <div className="event-details">
                  <div className="detail-item">
                    <span className="detail-label">Participants:</span>
                    <span>{event.registrationCount || 0}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Start:</span>
                    <span>
                      {new Date(event.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">End:</span>
                    <span>{new Date(event.endDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="card-actions">
                  <button
                    className="btn-view"
                    onClick={() => navigate(`/manager/events/${event._id}`)}
                  >
                    View Details
                  </button>
                  <button
                    className="btn-edit"
                    onClick={() =>
                      navigate(`/manager/events/${event._id}/edit`)
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteEvent(event._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={paginatedData.pages}
            onPageChange={setCurrentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={filteredEvents.length}
          />
        </>
      ) : (
        <div className="no-results">
          <p>No events created yet</p>
          {Object.keys(activeFilters).length > 0 && (
            <button className="reset-btn" onClick={handleClearFilters}>
              Clear Filters
            </button>
          )}
          <button
            className="btn-create-event"
            onClick={() => navigate("/manager/create-event")}
          >
            Create Your First Event
          </button>
        </div>
      )}
    </div>
  );
};

export default ManagerEvents;
