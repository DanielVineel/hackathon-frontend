import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import "../styles/ManagerDashboard.css";

const ManagerDashboardNew = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalProblems: 0,
    totalSubmissions: 0,
    activeEvents: 0,
    totalParticipants: 0,
    averageScore: 0,
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [eventsRes] = await Promise.all([
        API.get("/manager/events").catch(() => ({ data: { data: [] } })),
      ]);

      const events = eventsRes.data?.data || [];

      // Calculate stats
      const activeEvents = events.filter((e) => {
        const now = new Date();
        return new Date(e.startDate) <= now && now <= new Date(e.endDate);
      }).length;

      const totalParticipants = events.reduce(
        (sum, e) => sum + (e.registrationCount || 0),
        0
      );

      setStats({
        totalEvents: events.length,
        totalProblems: events.reduce((sum, e) => sum + (e.problems?.length || 0), 0),
        totalSubmissions: 0,
        activeEvents,
        totalParticipants,
        averageScore: 0,
      });

      setRecentEvents(events.slice(0, 5));
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="manager-dashboard loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="manager-dashboard">
      <div className="dashboard-header">
        <h1>Manager Dashboard</h1>
        <p>Manage your events, problems, and submissions</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card" onClick={() => navigate("/manager/events")}>
          <div className="stat-icon">📅</div>
          <h3>Total Events</h3>
          <p className="stat-value">{stats.totalEvents}</p>
          <small>{stats.activeEvents} active</small>
        </div>

        <div className="stat-card" onClick={() => navigate("/manager/problems")}>
          <div className="stat-icon">📝</div>
          <h3>Total Problems</h3>
          <p className="stat-value">{stats.totalProblems}</p>
        </div>

        <div className="stat-card" onClick={() => navigate("/manager/submissions")}>
          <div className="stat-icon">✅</div>
          <h3>Submissions</h3>
          <p className="stat-value">{stats.totalSubmissions}</p>
        </div>

        <div className="stat-card" onClick={() => navigate("/manager/leaderboard")}>
          <div className="stat-icon">👥</div>
          <h3>Participants</h3>
          <p className="stat-value">{stats.totalParticipants}</p>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <button className="action-btn" onClick={() => navigate("/manager/events/create")}>
          ➕ Create Event
        </button>
        <button className="action-btn" onClick={() => navigate("/manager/problems")}>
          📝 Create Problem
        </button>
        <button className="action-btn" onClick={() => navigate("/manager/submissions")}>
          ✅ Review Submissions
        </button>
      </div>

      <div className="sections">
        <div className="section">
          <h2>Recent Events</h2>
          {recentEvents.length > 0 ? (
            <div className="events-list">
              {recentEvents.map((event) => (
                <div
                  key={event._id}
                  className="event-item"
                  onClick={() => navigate(`/manager/events/${event._id}`)}
                >
                  <h3>{event.name}</h3>
                  <p>{event.description?.substring(0, 80)}...</p>
                  <small>
                    📅 {new Date(event.startDate).toLocaleDateString()} • 👥{" "}
                    {event.registrationCount || 0} registered
                  </small>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty">No events yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboardNew;
