import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/common/Pagination";
import FilterPanel from "../../components/common/FilterPanel";
import { getBlutoStorage, setBlutoStorage } from "../../utils/storage";
import { applyFilters } from "../../utils/filters";
import { paginateArray } from "../../utils/pagination";
import API from "../../api/api";
import "../styles/StudentBrowseEvents.css";

const BrowseEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  // Filter state - using bluto namespace
  const [filterOpen, setFilterOpen] = useState(false);
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
    getBlutoStorage("student-events-sort-order", "desc")
  );

  // Fetch events
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await API.get("/events");
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

  const handleRegister = async (eventId) => {
    try {
      await API.post(`/student/event/register/${eventId}`);
      // Store registration in localStorage
      const registrations = getBlutoStorage("student-registrations", []);
      if (!registrations.includes(eventId)) {
        registrations.push(eventId);
        setBlutoStorage("student-registrations", registrations);
      }
      alert("Registered successfully!");
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || "Error registering");
    }
  };

  // Apply filters and pagination
  const filteredEvents = applyFilters(events, {
    searchTerm,
    searchFields: ["name", "description"],
    filters: activeFilters,
    sortBy,
    sortOrder,
  });

  const paginatedData = paginateArray(filteredEvents, currentPage, ITEMS_PER_PAGE);

  // Handle filter change
  const handleFilterChange = (filters) => {
    setBlutoStorage("student-events-filters", filters);
    setActiveFilters(filters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setBlutoStorage("student-events-filters", {});
    setBlutoStorage("student-events-search", "");
    setActiveFilters({});
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setBlutoStorage("student-events-search", term);
    setCurrentPage(1);
  };

  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    setBlutoStorage("student-events-sort", field);
    setBlutoStorage("student-events-sort-order", order);
    setCurrentPage(1);
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

  if (loading) {
    return <div className="browse-events loading">Loading events...</div>;
  }

  return (
    <div className="browse-events">
      <div className="header">
        <h1>Browse Events</h1>
        <p>Find and register for coding challenges</p>
      </div>

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
            <option value="startDate">Sort by Start Date</option>
            <option value="name">Sort by Title</option>
            <option value="registrationCount">Sort by Popularity</option>
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
                  <span className={`status ${event.status}`}>{event.status}</span>
                </div>
                <p className="description">
                  {event.description?.substring(0, 100)}...
                </p>
                <div className="card-meta">
                  <span>📅 {new Date(event.startDate).toLocaleDateString()}</span>
                  <span>👥 {event.registrationCount || 0} participants</span>
                </div>
                <div className="card-actions">
                  <button
                    className="btn-view"
                    onClick={() => navigate(`/student/events/${event._id}`)}
                  >
                    View Details
                  </button>
                  <button
                    className="btn-register"
                    onClick={() => handleRegister(event._id)}
                  >
                    Register
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
        <div className="empty-state">
          <p>No events found matching your search</p>
          {Object.keys(activeFilters).length > 0 && (
            <button className="reset-btn" onClick={handleClearFilters}>
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BrowseEvents;
