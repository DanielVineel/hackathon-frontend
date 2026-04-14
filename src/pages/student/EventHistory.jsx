import React, { useEffect, useState } from "react";
import Pagination from "../../components/common/Pagination";
import FilterPanel from "../../components/common/FilterPanel";
import { getBlutoStorage, setBlutoStorage } from "../../utils/storage";
import { applyFilters } from "../../utils/filters";
import { paginateArray } from "../../utils/pagination";
import API from "../../api/api";
import "../styles/student/EventHistory.css";

const EventHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  // Filters with bluto namespace
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(
    getBlutoStorage("student-event-history-filters", {})
  );
  const [searchTerm, setSearchTerm] = useState(
    getBlutoStorage("student-event-history-search", "")
  );
  const [sortBy, setSortBy] = useState(
    getBlutoStorage("student-event-history-sort", "registeredAt")
  );
  const [sortOrder, setSortOrder] = useState(
    getBlutoStorage("student-event-history-sort-order", "desc")
  );

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await API.get("/student/myEvents");
      setHistory(res.data?.history || res.data?.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching history:", err);
      setError("Failed to load event history");
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = applyFilters(history, {
    searchTerm,
    searchFields: ["eventName", "description"],
    filters: activeFilters,
    sortBy,
    sortOrder,
  });

  const paginatedData = paginateArray(
    filteredHistory,
    currentPage,
    ITEMS_PER_PAGE
  );

  const handleFilterChange = (filters) => {
    setBlutoStorage("student-event-history-filters", filters);
    setActiveFilters(filters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setBlutoStorage("student-event-history-filters", {});
    setBlutoStorage("student-event-history-search", "");
    setActiveFilters({});
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setBlutoStorage("student-event-history-search", term);
    setCurrentPage(1);
  };

  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    setBlutoStorage("student-event-history-sort", field);
    setBlutoStorage("student-event-history-sort-order", order);
    setCurrentPage(1);
  };

  const filterConfig = [
    {
      key: "status",
      type: "multiselect",
      label: "Event Status",
      options: [
        { value: "completed", label: "Completed" },
        { value: "ongoing", label: "Ongoing" },
        { value: "registered", label: "Registered" },
      ],
    },
  ];

  const getStatusBadge = (status) => {
    const statusMap = {
      completed: "completed",
      ongoing: "ongoing",
      registered: "registered",
    };
    const statusClass = statusMap[status] || "unknown";
    return <span className={`status-badge ${statusClass}`}>{status}</span>;
  };

  if (loading) {
    return (
      <div className="event-history-page">
        <div className="loading">Loading event history...</div>
      </div>
    );
  }

  return (
    <div className="event-history-page">
      <header className="page-header">
        <h1>Event Participation History</h1>
        <p>View all events you have participated in</p>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="history-controls">
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
            <option value="registeredAt">Sort by Date</option>
            <option value="eventName">Sort by Name</option>
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
          <div className="history-grid">
            {paginatedData.data.map((event) => (
              <div key={event._id} className="history-card">
                <div className="card-header">
                  <h3>{event.eventName}</h3>
                  {getStatusBadge(event.status)}
                </div>

                <p className="card-description">{event.description || "No description"}</p>

                <div className="card-meta">
                  <div className="meta-item">
                    <span className="meta-label">Registered:</span>
                    <span>
                      {new Date(event.registeredAt).toLocaleDateString()}
                    </span>
                  </div>
                  {event.completedAt && (
                    <div className="meta-item">
                      <span className="meta-label">Completed:</span>
                      <span>
                        {new Date(event.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {event.performanceMetrics && (
                  <div className="metrics-section">
                    <div className="metric">
                      <span className="metric-label">Score:</span>
                      <span className="metric-value">{event.performanceMetrics.score || "N/A"}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Rank:</span>
                      <span className="metric-value">{event.performanceMetrics.rank || "N/A"}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={paginatedData.pages}
            onPageChange={setCurrentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={filteredHistory.length}
          />
        </>
      ) : (
        <div className="no-results">
          <p>No events in your history</p>
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

export default EventHistory;