import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/common/Pagination";
import FilterPanel from "../../components/common/FilterPanel";
import { getBlutoStorage, setBlutoStorage } from "../../utils/storage";
import { applyFilters } from "../../utils/filters";
import { paginateArray } from "../../utils/pagination";
import API from "../../api/api";
import "../../styles/StudentEvents.css";

/**
 * StudentEvents Component
 * Displays all available events for students to view and register
 */
const StudentEvents = () => {
  const navigate = useNavigate();

  // Data States
  const [events, setEvents] = useState([]);

  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Filters with bluto namespace
  const [activeFilters, setActiveFilters] = useState(
    getBlutoStorage("student-events-filters", {})
  );
  const [searchTerm, setSearchTerm] = useState(
    getBlutoStorage("student-events-search", "")
  );
  const [sortBy, setSortBy] = useState(
    getBlutoStorage("student-events-sort", "startDate")
  );
  const [sortOrder, setSortOrder] = useState(
    getBlutoStorage("student-events-sort-order", "asc")
  );

  useEffect(() => {
    fetchEvents();
  }, []);

  /**
   * Fetch all available events
   */
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await API.get(`/events`);
      
      // Handle API response - returns { events: [...] }
      let eventsData = [];
      if (res.data?.events && Array.isArray(res.data.events)) {
        eventsData = res.data.events;
      } else if (Array.isArray(res.data)) {
        eventsData = res.data;
      }

      // Ensure it's always an array
      setEvents(Array.isArray(eventsData) ? eventsData : []);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error fetching events:", err);
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to load events";
      setError(errorMsg);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Determine event status based on dates
   */
  const getEventStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > now) return "Upcoming";
    if (start <= now && end >= now) return "Ongoing";
    return "Completed";
  };

  /**
   * Apply filters to events
   */
  const filteredEvents = applyFilters(events, {
    searchTerm,
    searchFields: ["name", "description", "venue"],
    filters: activeFilters,
    sortBy,
    sortOrder,
  });

  /**
   * Paginate filtered events
   */
  const paginatedData = paginateArray(
    filteredEvents,
    currentPage,
    ITEMS_PER_PAGE
  );

  /**
   * Handle filter changes
   */
  const handleFilterChange = (filters) => {
    setBlutoStorage("student-events-filters", filters);
    setActiveFilters(filters);
    setCurrentPage(1);
  };

  /**
   * Clear all filters
   */
  const handleClearFilters = () => {
    setBlutoStorage("student-events-filters", {});
    setBlutoStorage("student-events-search", "");
    setActiveFilters({});
    setSearchTerm("");
    setCurrentPage(1);
  };

  /**
   * Handle search input
   */
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setBlutoStorage("student-events-search", term);
    setCurrentPage(1);
  };

  /**
   * Handle sort changes
   */
  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    setBlutoStorage("student-events-sort", field);
    setBlutoStorage("student-events-sort-order", order);
    setCurrentPage(1);
  };

  /**
   * Handle navigate to event details
   */
  const handleViewEvent = (eventId) => {
    if (eventId) {
      navigate(`/student/event/${eventId}`);
    }
  };

  /**
   * Filter configuration
   */
  const filterConfig = [
    {
      key: "status",
      type: "multiselect",
      label: "Event Status",
      options: [
        { value: "Upcoming", label: "Upcoming" },
        { value: "Ongoing", label: "Ongoing" },
        { value: "Completed", label: "Completed" },
      ],
    },
    {
      key: "fee",
      type: "multiselect",
      label: "Event Type",
      options: [
        { value: "free", label: "Free" },
        { value: "paid", label: "Paid" },
      ],
    },
  ];

  // Loading State
  if (loading) {
    return (
      <div className="student-events loading">
        <div className="loader"></div>
        <p>Loading events...</p>
      </div>
    );
  }

  const eventStats = {
    total: events.length,
    upcoming: events.filter(e => getEventStatus(e.startDate, e.endDate) === "Upcoming").length,
    ongoing: events.filter(e => getEventStatus(e.startDate, e.endDate) === "Ongoing").length,
    completed: events.filter(e => getEventStatus(e.startDate, e.endDate) === "Completed").length,
  };

  return (
    <div className="student-events">
      {/* Header */}
      <div className="header">
        <div className="header-content">
          <h1>Available Events</h1>
          <p className="events-count">
            {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          className="btn-back"
          onClick={() => navigate("/student/dashboard")}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Stats Bar */}
      <div className="events-stats">
        <div className="stat-card">
          <span className="stat-label">Total Events</span>
          <span className="stat-value">{eventStats.total}</span>
        </div>
        <div className="stat-card upcoming">
          <span className="stat-label">Upcoming</span>
          <span className="stat-value">{eventStats.upcoming}</span>
        </div>
        <div className="stat-card ongoing">
          <span className="stat-label">Ongoing</span>
          <span className="stat-value">{eventStats.ongoing}</span>
        </div>
        <div className="stat-card completed">
          <span className="stat-label">Completed</span>
          <span className="stat-value">{eventStats.completed}</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchEvents} className="retry-btn">
            Try Again
          </button>
        </div>
      )}

      {/* Controls */}
      {events.length > 0 && !error && (
        <div className="events-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search events by name, venue, or description..."
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
              <option value="name">Sort by Name</option>
              <option value="startDate">Sort by Start Date</option>
              <option value="fee">Sort by Fee</option>
            </select>
            <button
              className={`sort-order-btn ${sortOrder}`}
              onClick={() =>
                handleSortChange(sortBy, sortOrder === "asc" ? "desc" : "asc")
              }
              title={sortOrder === "asc" ? "Ascending" : "Descending"}
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>
      )}

      {/* Events Grid */}
      {paginatedData.data && paginatedData.data.length > 0 ? (
        <>
          <div className="events-grid">
            {paginatedData.data.map((event) => {
              const status = getEventStatus(event.startDate, event.endDate);
              const statusClass = status.toLowerCase();
              
              return (
                <div key={event._id} className="event-card">
                  <div className="card-header">
                    <h3 className="event-name">
                      {event.name || event.title || "Untitled Event"}
                    </h3>
                    <span className={`status-badge ${statusClass}`}>
                      {status}
                    </span>
                  </div>

                  {(event.description) && (
                    <p className="event-description">
                      {event.description.substring(0, 100)}
                      {event.description.length > 100 ? "..." : ""}
                    </p>
                  )}

                  <div className="card-meta">
                    <div className="meta-item">
                      <span className="meta-label">📅 Start:</span>
                      <span className="meta-value">
                        {new Date(event.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">⏱️ End:</span>
                      <span className="meta-value">
                        {new Date(event.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    {event.fee && event.fee > 0 && (
                      <div className="meta-item">
                        <span className="meta-label">💰 Fee:</span>
                        <span className="meta-value">₹{event.fee}</span>
                      </div>
                    )}
                    {event.venue && (
                      <div className="meta-item">
                        <span className="meta-label">📍 Venue:</span>
                        <span className="meta-value">{event.venue}</span>
                      </div>
                    )}
                  </div>

                  <button
                    className="btn-view-event"
                    onClick={() => handleViewEvent(event._id)}
                  >
                    View Details →
                  </button>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {paginatedData.pages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={paginatedData.pages}
              onPageChange={setCurrentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={filteredEvents.length}
            />
          )}
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No Events Found</h3>
          <p>
            {Object.keys(activeFilters).length > 0 || searchTerm
              ? "No events match your search criteria"
              : "No events available at the moment"}
          </p>
          {(Object.keys(activeFilters).length > 0 || searchTerm) && (
            <button
              className="btn-reset-filters"
              onClick={handleClearFilters}
            >
              Clear Filters & Search
            </button>
          )}
          <button
            className="btn-back-to-dashboard"
            onClick={() => navigate("/student/dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentEvents;
