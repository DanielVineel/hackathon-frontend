import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";
import "../../styles/ManagerEvents.css";

const EventsList = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await API.get("/manager/events");
      setEvents(res.data?.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await API.delete(`/manager/events/${id}`);
      setEvents(events.filter((e) => e._id !== id));
    } catch (err) {
      alert("Error deleting event");
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || event.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <div className="manager-events loading">Loading events...</div>;
  }

  return (
    <div className="manager-events">
      <div className="events-header">
        <h1>My Events</h1>
        <button
          className="btn-create"
          onClick={() => navigate("/manager/events/create")}
        >
          ➕ Create Event
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="filters">
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {filteredEvents.length > 0 ? (
        <div className="events-grid">
          {filteredEvents.map((event) => (
            <div key={event._id} className="event-card">
              <div className="event-header">
                <h3>{event.name}</h3>
                <span className={`status ${event.status}`}>{event.status}</span>
              </div>
              <p className="description">
                {event.description?.substring(0, 100)}...
              </p>
              <div className="event-meta">
                <span>📅 {new Date(event.startDate).toLocaleDateString()}</span>
                <span>👥 {event.registrationCount || 0} participants</span>
              </div>
              <div className="event-actions">
                <button
                  className="btn-edit"
                  onClick={() => navigate(`/manager/events/${event._id}/edit`)}
                >
                  Edit
                </button>
                <button
                  className="btn-view"
                  onClick={() => navigate(`/manager/events/${event._id}`)}
                >
                  View
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(event._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No events found</p>
          <button
            className="btn-primary"
            onClick={() => navigate("/manager/events/create")}
          >
            Create First Event
          </button>
        </div>
      )}
    </div>
  );
};

export default EventsList;
