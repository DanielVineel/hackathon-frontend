import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import "../styles/StudentDashboard.css";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    registeredEvents: 0,
    problemsSolved: 0,
    certificatesEarned: 0,
    totalSubmissions: 0,
  });
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [eventsRes, submissionsRes, certificatesRes] = await Promise.all([
        API.get("/student/my-events").catch(() => ({ data: { data: [] } })),
        API.get("/student/my-submissions").catch(() => ({
          data: { data: [] },
        })),
        API.get("/student/certificates").catch(() => ({ data: { data: [] } })),
      ]);

      const events = eventsRes.data?.data || [];
      const submissions = submissionsRes.data?.data || [];
      const certificates = certificatesRes.data?.data || [];

      // Calculate stats
      const problemsSolved = submissions.filter(
        (s) => s.status === "accepted"
      ).length;

      setStats({
        registeredEvents: events.length,
        problemsSolved,
        certificatesEarned: certificates.length,
        totalSubmissions: submissions.length,
      });

      setMyEvents(events.slice(0, 3));
      setError(null);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="student-dashboard loading">Loading...</div>;
  }

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <h1>Student Dashboard</h1>
        <p>Track your progress and explore coding challenges</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <h3>Registered Events</h3>
          <p className="stat-value">{stats.registeredEvents}</p>
          <button onClick={() => navigate("/student/events")}>View Events</button>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <h3>Problems Solved</h3>
          <p className="stat-value">{stats.problemsSolved}</p>
          <button onClick={() => navigate("/student/submissions")}>
            My Submissions
          </button>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <h3>Certificates</h3>
          <p className="stat-value">{stats.certificatesEarned}</p>
          <button onClick={() => navigate("/student/certificates")}>
            View Certificates
          </button>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <h3>Total Submissions</h3>
          <p className="stat-value">{stats.totalSubmissions}</p>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <button
          className="action-btn"
          onClick={() => navigate("/student/browse-events")}
        >
          🔍 Browse Events
        </button>
        <button
          className="action-btn"
          onClick={() => navigate("/student/submissions")}
        >
          ✅ My Submissions
        </button>
        <button
          className="action-btn"
          onClick={() => navigate("/student/leaderboard")}
        >
          🏆 Global Leaderboard
        </button>
      </div>

      <div className="recent-section">
        <h2>My Recent Events</h2>
        {myEvents.length > 0 ? (
          <div className="events-list">
            {myEvents.map((event) => (
              <div
                key={event._id}
                className="event-item"
                onClick={() => navigate(`/student/events/${event._id}`)}
              >
                <h3>{event.name}</h3>
                <p>{event.description?.substring(0, 80)}...</p>
                <div className="event-meta">
                  <span>📅 {new Date(event.startDate).toLocaleDateString()}</span>
                  <button className="btn-view">View Event →</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty">
            <p>No events registered yet. Browse events to get started!</p>
            <button
              className="btn-primary"
              onClick={() => navigate("/student/browse-events")}
            >
              Browse Events
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;