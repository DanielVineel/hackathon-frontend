// src/pages/manager/Dashboard.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useTheme } from "../../context/ThemeContext";
import "./Dashboard.css";

const ManagerDashboard = () => {
  const { theme } = useTheme();
  const [manager, setManager] = useState(null);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalParticipants: 0,
    totalSubmissions: 0,
    averageParticipants: 0
  });
  const [loading, setLoading] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    maxParticipants: "",
    prize: ""
  });

  useEffect(() => {
    fetchManagerData();
  }, []);

  const fetchManagerData = async () => {
    try {
      setLoading(true);
      const [managerRes, eventsRes] = await Promise.all([
        API.get("/managers/profile"),
        API.get("/events?manager=true")
      ]);

      setManager(managerRes.data?.data);
      const eventData = eventsRes.data?.data || [];
      setEvents(eventData);

      // Calculate stats
      const activeCount = eventData.filter(e => e.status === "ongoing").length;
      const totalParticipants = eventData.reduce((sum, e) => sum + (e.registrations?.length || 0), 0);
      const totalSubmissions = eventData.reduce((sum, e) => sum + (e.submissions?.length || 0), 0);

      setStats({
        totalEvents: eventData.length,
        activeEvents: activeCount,
        totalParticipants,
        totalSubmissions,
        averageParticipants: eventData.length > 0 ? Math.round(totalParticipants / eventData.length) : 0
      });
    } catch (err) {
      console.error("Error fetching manager data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/events/create", newEvent);
      if (res.data?.success) {
        alert("Event created successfully!");
        setNewEvent({
          name: "",
          description: "",
          startDate: "",
          endDate: "",
          location: "",
          maxParticipants: "",
          prize: ""
        });
        setShowCreateEvent(false);
        fetchManagerData();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error creating event");
    }
  };

  const handleEventFieldChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      ongoing: "badge-success",
      completed: "badge-info",
      canceled: "badge-danger",
      upcoming: "badge-warning"
    };
    return statusMap[status] || "badge-secondary";
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className={`manager-dashboard theme-${theme}`}>
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Welcome, {manager?.name || "Manager"}!</h1>
          <p>Manage your coding events and track participant progress</p>
        </div>
        <button
          className="btn-create-event"
          onClick={() => setShowCreateEvent(!showCreateEvent)}
        >
          {showCreateEvent ? "Cancel" : "+ Create Event"}
        </button>
      </div>

      {/* Create Event Form */}
      {showCreateEvent && (
        <div className="create-event-container">
          <form onSubmit={handleCreateEvent} className="create-form">
            <h3>Create New Event</h3>
            
            <div className="form-row">
              <input
                type="text"
                name="name"
                placeholder="Event Name"
                value={newEvent.name}
                onChange={handleEventFieldChange}
                required
              />
              <input
                type="date"
                name="startDate"
                value={newEvent.startDate}
                onChange={handleEventFieldChange}
                required
              />
            </div>

            <div className="form-row">
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={newEvent.description}
                onChange={handleEventFieldChange}
                required
              />
              <input
                type="date"
                name="endDate"
                value={newEvent.endDate}
                onChange={handleEventFieldChange}
                required
              />
            </div>

            <div className="form-row">
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={newEvent.location}
                onChange={handleEventFieldChange}
              />
              <input
                type="number"
                name="maxParticipants"
                placeholder="Max Participants"
                value={newEvent.maxParticipants}
                onChange={handleEventFieldChange}
              />
            </div>

            <input
              type="text"
              name="prize"
              placeholder="Prize"
              value={newEvent.prize}
              onChange={handleEventFieldChange}
            />

            <button type="submit" className="btn-submit">
              Create Event
            </button>
          </form>
        </div>
      )}

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h3>Total Events</h3>
            <p className="stat-value">{stats.totalEvents}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-info">
            <h3>Active Events</h3>
            <p className="stat-value">{stats.activeEvents}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Total Participants</h3>
            <p className="stat-value">{stats.totalParticipants}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <h3>Total Submissions</h3>
            <p className="stat-value">{stats.totalSubmissions}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>Avg Participants</h3>
            <p className="stat-value">{stats.averageParticipants}</p>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="events-container">
        <h2>Your Events</h2>
        {events.length === 0 ? (
          <div className="no-events">
            <p>No events created yet. Create your first event to get started!</p>
          </div>
        ) : (
          <div className="events-list">
            {events.map(event => (
              <div key={event._id} className="event-item">
                <div className="event-header">
                  <h3>{event.name}</h3>
                  <span className={`badge ${getStatusBadge(event.status)}`}>
                    {event.status?.toUpperCase()}
                  </span>
                </div>

                <div className="event-meta">
                  <div className="meta-row">
                    <span className="meta-label">Started:</span>
                    <span className="meta-value">{formatDate(event.startDate)}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Ends:</span>
                    <span className="meta-value">{formatDate(event.endDate)}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Location:</span>
                    <span className="meta-value">{event.location || "Online"}</span>
                  </div>
                </div>

                <div className="event-stats">
                  <div className="stat">
                    <span className="stat-number">{event.registrations?.length || 0}</span>
                    <span className="stat-label">Registered</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">{event.submissions?.length || 0}</span>
                    <span className="stat-label">Submissions</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">{event.maxParticipants || "∞"}</span>
                    <span className="stat-label">Capacity</span>
                  </div>
                </div>

                <div className="event-description">
                  <p>{event.description}</p>
                </div>

                <div className="event-actions">
                  <button className="btn-view">View Details</button>
                  <button className="btn-edit">Edit</button>
                  <button className="btn-leaderboard">Leaderboard</button>
                  <button className="btn-delete">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="quick-links">
        <h2>Quick Links</h2>
        <div className="links-grid">
          <a href="/manager/analytics" className="link-card">
            <div className="link-icon">📊</div>
            <h4>Analytics</h4>
            <p>View detailed event analytics</p>
          </a>
          <a href="/manager/participants" className="link-card">
            <div className="link-icon">👥</div>
            <h4>Participants</h4>
            <p>Manage event participants</p>
          </a>
          <a href="/manager/submissions" className="link-card">
            <div className="link-icon">📝</div>
            <h4>Submissions</h4>
            <p>Review code submissions</p>
          </a>
          <a href="/manager/settings" className="link-card">
            <div className="link-icon">⚙️</div>
            <h4>Settings</h4>
            <p>Manage your account</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;