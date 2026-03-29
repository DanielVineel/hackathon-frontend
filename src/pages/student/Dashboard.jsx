import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import { getUserData, getToken } from "../../utils/auth";
import {
  StatCard,
  ProgressCard,
  ChartCard,
  ListItemCard,
  CardGrid,
  EmptyStateCard,
  ErrorCard,
  LoadingCard,
  ActionCard,
  Badge
} from "../../components/DashboardCard";
import "../../styles/StudentDashboard.css";

/**
 * Student Dashboard Component
 * Shows student stats, events, submissions, and certificates
 */
const StudentDashboard = () => {
  const navigate = useNavigate();
  const user = getUserData();

  // Stats State
  const [stats, setStats] = useState({
    registeredEvents: 0,
    problemsSolved: 0,
    certificatesEarned: 0,
    totalSubmissions: 0,
    acceptanceRate: 0
  });

  // Data State
  const [myEvents, setMyEvents] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [profile, setProfile] = useState(null);

  // UI State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  /**
   * Fetch all dashboard data in parallel
   */
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [profileRes, eventsRes, certificatesRes] = await Promise.all([
        API.get("/student/profile").catch(() => ({ data: null })),
        API.get("/student/myEvents").catch(() => ({ data: [] })),
        API.get("/student/certificates").catch(() => ({ data: [] }))
      ]);

      // Get profile
      if (profileRes.data) {
        setProfile(profileRes.data);
      }

      // Get events
      const events = eventsRes.data || [];
      setMyEvents(events.slice(0, 5)); // Show first 5 events

      // Get certificates
      const certs = certificatesRes.data || [];
      setCertificates(certs);

      // Calculate stats
      const acceptedSubmissions = events.reduce((count, event) => {
        return count + (event.submissions?.filter(s => s.status === "accepted").length || 0);
      }, 0);

      const totalSubs = events.reduce((count, event) => {
        return count + (event.submissions?.length || 0);
      }, 0);

      const acceptanceRate = totalSubs > 0 
        ? Math.round((acceptedSubmissions / totalSubs) * 100)
        : 0;

      setStats({
        registeredEvents: events.length,
        problemsSolved: acceptedSubmissions,
        certificatesEarned: certs.length,
        totalSubmissions: totalSubs,
        acceptanceRate
      });
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle event registration
   */
  const handleRegisterEvent = async (eventId) => {
    try {
      await API.post(`/student/event/register/${eventId}`);
      // Refresh data
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register for event");
    }
  };

  /**
   * Handle event start
   */
  const handleStartEvent = async (eventId) => {
    try {
      await API.post(`/student/event/start/${eventId}`);
      navigate(`/student/events/${eventId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to start event");
    }
  };

  // Loading State
  if (loading) {
    return <LoadingCard message="Loading your dashboard..." />;
  }

  // Error State
  if (error) {
    return (
      <ErrorCard
        title="Dashboard Error"
        message={error}
        onRetry={fetchDashboardData}
      />
    );
  }

  return (
    <div className="student-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-header__content">
          <h1>Welcome, {user?.firstName}! 👋</h1>
          <p>Track your progress and explore coding challenges</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/student/browse-events")}
        >
          🔍 Browse Events
        </button>
      </div>

      {/* Main Stats */}
      <CardGrid columns={4}>
        <StatCard
          icon="📅"
          title="Registered Events"
          value={stats.registeredEvents}
          color="primary"
          onClick={() => navigate("/student/events")}
        />
        <StatCard
          icon="✅"
          title="Problems Solved"
          value={stats.problemsSolved}
          color="success"
        />
        <StatCard
          icon="🏆"
          title="Certificates"
          value={stats.certificatesEarned}
          color="warning"
        />
        <StatCard
          icon="📝"
          title="Total Submissions"
          value={stats.totalSubmissions}
          color="info"
        />
      </CardGrid>

      {/* Acceptance Rate Progress */}
      <div className="card">
        <ProgressCard
          icon="📊"
          title="Acceptance Rate"
          progress={stats.acceptanceRate}
          color="primary"
          label={`${stats.acceptanceRate}%`}
        />
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3 style={{ marginBottom: "16px" }}>Quick Actions</h3>
        <CardGrid columns={3}>
          <ActionCard
            icon="🔍"
            title="Browse Events"
            description="Explore available events"
            buttonText="Browse"
            onAction={() => navigate("/student/browse-events")}
            variant="primary"
          />
          <ActionCard
            icon="✅"
            title="My Submissions"
            description="View your submissions"
            buttonText="View"
            onAction={() => navigate("/student/submissions")}
            variant="info"
          />
          <ActionCard
            icon="🏆"
            title="Leaderboard"
            description="Check global rankings"
            buttonText="View"
            onAction={() => navigate("/student/leaderboard")}
            variant="warning"
          />
        </CardGrid>
      </div>

      {/* My Events Section */}
      <ChartCard
        title="My Recent Events"
        subtitle={`${myEvents.length} active events`}
        action={
          myEvents.length > 0 ? (
            <a href="/student/events" className="link">
              View All →
            </a>
          ) : null
        }
      >
        {myEvents.length > 0 ? (
          <div className="events-list">
            {myEvents.map((event) => (
              <ListItemCard
                key={event._id}
                icon="📅"
                title={event.name}
                subtitle={
                  <>
                    <span>
                      {new Date(event.startDate).toLocaleDateString()} -{" "}
                      {new Date(event.endDate).toLocaleDateString()}
                    </span>
                    <br />
                    <span>{event.problems?.length || 0} problems</span>
                  </>
                }
                action={
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleStartEvent(event._id)}
                  >
                    Start →
                  </button>
                }
                onClick={() => navigate(`/student/events/${event._id}`)}
              />
            ))}
          </div>
        ) : (
          <EmptyStateCard
            icon="📭"
            title="No Events Registered"
            description="Start your journey by registering for an event"
            actionText="Browse Events"
            onAction={() => navigate("/student/browse-events")}
          />
        )}
      </ChartCard>

      {/* Certificates Section */}
      {certificates.length > 0 && (
        <ChartCard
          title="My Certificates"
          subtitle={`${certificates.length} certificates earned`}
          action={
            <a href="/student/certificates" className="link">
              View All →
            </a>
          }
        >
          <div className="certificates-grid">
            {certificates.slice(0, 3).map((cert) => (
              <div key={cert._id} className="certificate-item">
                <div className="certificate-item__header">
                  <h4>{cert.name}</h4>
                  <span className="badge badge--success">✓ Earned</span>
                </div>
                <p className="certificate-item__date">
                  {new Date(cert.earnedDate).toLocaleDateString()}
                </p>
                <button
                  className="btn btn-sm"
                  onClick={() => navigate(`/student/certificates/${cert._id}`)}
                >
                  View Certificate
                </button>
              </div>
            ))}
          </div>
        </ChartCard>
      )}

      {/* Profile Info */}
      {profile && (
        <ChartCard title="Profile Info">
          <div className="profile-info">
            <div className="profile-info__item">
              <label>Email</label>
              <p>{profile.email}</p>
            </div>
            <div className="profile-info__item">
              <label>Phone</label>
              <p>{profile.phone || "Not provided"}</p>
            </div>
            <div className="profile-info__item">
              <label>Status</label>
              <p>{profile.status}</p>
            </div>
            <div className="profile-info__item">
              <label>Organization</label>
              <p>{profile.latestOrganization || "Not provided"}</p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/student/profile")}
            >
              Edit Profile
            </button>
          </div>
        </ChartCard>
      )}
    </div>
  );
};

export default StudentDashboard;