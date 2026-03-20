// src/pages/superadmin/Events.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useTheme } from "../../context/ThemeContext";
import "./Events.css";

const Events = () => {
  const { theme } = useTheme();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, ongoing, completed, canceled
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    organizedBy: "",
    startDate: "",
    endDate: "",
    location: "",
    maxParticipants: "",
    prize: ""
  });

  // Fetch events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await API.get("/events");
      setEvents(res.data?.data || []);
      applyFiltersAndSearch(res.data?.data || [], searchTerm, filterStatus);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Improved filter: robust, case-insensitive, trims whitespace, handles nulls
  const applyFiltersAndSearch = (eventList, searchValue, status) => {
    let filtered = eventList;
    const search = (searchValue || "").trim().toLowerCase();
    if (search) {
      filtered = filtered.filter(event => {
        const name = (event.name || "").toLowerCase();
        const desc = (event.description || "").toLowerCase();
        const org = (event.organizedBy || "").toLowerCase();
        return name.includes(search) || desc.includes(search) || org.includes(search);
      });
    }
    if (status !== "all") {
      filtered = filtered.filter(event => event.status === status);
    }
    setFilteredEvents(filtered);
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    applyFiltersAndSearch(events, value, filterStatus);
  };

  // Handle filter
  const handleFilter = (status) => {
    setFilterStatus(status);
    applyFiltersAndSearch(events, searchTerm, status);
  };

  // Handle form input
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Create event
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/events/create", formData);
      if (res.data?.success) {
        alert("Event created successfully!");
        setFormData({
          name: "",
          description: "",
          organizedBy: "",
          startDate: "",
          endDate: "",
          location: "",
          maxParticipants: "",
          prize: ""
        });
        setShowCreateForm(false);
        fetchEvents();
      }
    } catch (err) {
      console.error("Error creating event:", err);
      alert(err.response?.data?.message || "Error creating event");
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "ongoing":
        return "badge-success";
      case "completed":
        return "badge-info";
      case "canceled":
        return "badge-danger";
      default:
        return "badge-secondary";
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <div className={`events-page theme-${theme}`}>
      <div className="events-header">
        <h2>Event Management</h2>
        <button
          className="btn-primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? "Cancel" : "Create Event"}
        </button>
      </div>

      {/* Create Event Form */}
      {showCreateForm && (
        <div className="create-event-form">
          <h3>Create New Event</h3>
          <form onSubmit={handleCreateEvent}>
            <div className="form-row">
              <input
                type="text"
                name="name"
                placeholder="Event Name"
                value={formData.name}
                onChange={handleFormChange}
                required
              />
              <input
                type="text"
                name="organizedBy"
                placeholder="Organized By"
                value={formData.organizedBy}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="form-row">
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleFormChange}
                rows="3"
              />
            </div>
            <div className="form-row">
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleFormChange}
                required
              />
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="form-row">
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleFormChange}
              />
              <input
                type="number"
                name="maxParticipants"
                placeholder="Max Participants"
                value={formData.maxParticipants}
                onChange={handleFormChange}
              />
            </div>
            <div className="form-row">
              <input
                type="text"
                name="prize"
                placeholder="Prize"
                value={formData.prize}
                onChange={handleFormChange}
              />
            </div>
            <button type="submit" className="btn-success">
              Create Event
            </button>
          </form>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search events by name, description, or organizer..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterStatus === "all" ? "active" : ""}`}
            onClick={() => handleFilter("all")}
          >
            All Events
          </button>
          <button
            className={`filter-btn ${filterStatus === "ongoing" ? "active" : ""}`}
            onClick={() => handleFilter("ongoing")}
          >
            Ongoing
          </button>
          <button
            className={`filter-btn ${filterStatus === "completed" ? "active" : ""}`}
            onClick={() => handleFilter("completed")}
          >
            Completed
          </button>
          <button
            className={`filter-btn ${filterStatus === "canceled" ? "active" : ""}`}
            onClick={() => handleFilter("canceled")}
          >
            Canceled
          </button>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="loading">Loading events...</div>
      ) : filteredEvents.length === 0 ? (
        <div className="no-events">
          <p>No events found</p>
        </div>
      ) : (
        <div className="events-grid">
          {filteredEvents.map(event => (
            <div
              key={event._id}
              className="event-card"
              onClick={() => {
                setSelectedEvent(event);
                setShowEventDetails(true);
              }}
            >
              <div className="event-card-header">
                <h3>{event.name}</h3>
                <span className={`badge ${getStatusColor(event.status)}`}>
                  {event.status?.toUpperCase()}
                </span>
              </div>
              <div className="event-card-body">
                <p className="organized-by">
                  <strong>By:</strong> {event.organizedBy}
                </p>
                <p className="description">{event.description?.substring(0, 100)}...</p>
                <div className="event-meta">
                  <span className="meta-item">
                    <strong>Start:</strong> {formatDate(event.startDate)}
                  </span>
                  <span className="meta-item">
                    <strong>Participants:</strong> {event.maxParticipants || "N/A"}
                  </span>
                </div>
                <p className="location">
                  <strong>📍</strong> {event.location || "TBD"}
                </p>
              </div>
              <div className="event-card-footer">
                <button className="view-details-btn">View Details →</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Event Details Modal */}
      {showEventDetails && selectedEvent && (
        <div className="event-details-modal" onClick={() => setShowEventDetails(false)}>
          <div className="event-details-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowEventDetails(false)}>✕</button>
            
            <div className="details-tabs">
              <div className="tab-header">
                <h2>{selectedEvent.name}</h2>
                <span className={`badge ${getStatusColor(selectedEvent.status)}`}>
                  {selectedEvent.status?.toUpperCase()}
                </span>
              </div>

              <div className="tab-content">
                <div className="detail-section">
                  <h3>Event Overview</h3>
                  <div className="detail-row">
                    <label>Organized By:</label>
                    <value>{selectedEvent.organizedBy}</value>
                  </div>
                  <div className="detail-row">
                    <label>Description:</label>
                    <value>{selectedEvent.description}</value>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Event Details</h3>
                  <div className="detail-row">
                    <label>Start Date:</label>
                    <value>{formatDate(selectedEvent.startDate)}</value>
                  </div>
                  <div className="detail-row">
                    <label>End Date:</label>
                    <value>{formatDate(selectedEvent.endDate)}</value>
                  </div>
                  <div className="detail-row">
                    <label>Location:</label>
                    <value>{selectedEvent.location || "TBD"}</value>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Additional Information</h3>
                  <div className="detail-row">
                    <label>Max Participants:</label>
                    <value>{selectedEvent.maxParticipants || "Unlimited"}</value>
                  </div>
                  <div className="detail-row">
                    <label>Prize:</label>
                    <value>{selectedEvent.prize || "N/A"}</value>
                  </div>
                  <div className="detail-row">
                    <label>Created At:</label>
                    <value>{formatDate(selectedEvent.createdAt)}</value>
                  </div>
                </div>

                <div className="detail-actions">
                  <button className="btn-edit">Edit Event</button>
                  <button className="btn-delete">Delete Event</button>
                  <button className="btn-close" onClick={() => setShowEventDetails(false)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;