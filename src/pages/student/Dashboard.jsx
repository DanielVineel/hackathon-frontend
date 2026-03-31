import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import { getUserData } from "../../utils/auth";
import {
  StatCard,
  ProgressCard,
  ChartCard,
  ListItemCard,
  CardGrid,
  EmptyStateCard,
  ErrorCard,
  LoadingCard,
  ActionCard
} from "../../components/DashboardCard";
import "../styles/student/Dashboard.css";

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
    acceptanceRate: 0,
    activeEvents: 0
  });

  // Data State
  const [myEvents, setMyEvents] = useState([]);
  const [certificates, setCertificates] = useState([]);

  // UI State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registrationError, setRegistrationError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  /**
   * Fetch all dashboard data in parallel
   */
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 🔄 Fetch student's registered events
      const eventsRes = await API.get("/student/myEvents");
      const eventData = eventsRes.data;
      const registrations = Array.isArray(eventData.registrations) ? eventData.registrations : [];

      // Populate event details from registrations
      const events = registrations
        .map((reg) => reg.eventId)
        .filter((event) => event && event._id);

      // Filter active events (ongoing or upcoming)
      const now = new Date();
      const activeEvents = events.filter((e) => {
        const startDate = new Date(e.startDate);
        return startDate > now; // Upcoming
      });

      // Set events with safety checks
      setMyEvents(Array.isArray(events) ? events.slice(0, 5) : []);

      // 🔄 Fetch certificates
      const certificatesRes = await API.get("/student/certificates");
      const certData = certificatesRes.data;
      const certs = Array.isArray(certData.certificates)
        ? certData.certificates
        : Array.isArray(certData)
          ? certData
          : [];
      setCertificates(certs);

      // 🔄 Calculate stats
      let totalSubmissions = 0;
      let acceptedSubmissions = 0;

      // Calculate from successful registrations
      acceptedSubmissions = registrations.filter((reg) => reg.registrationStatus === "registered").length;
      totalSubmissions = registrations.length;

      const acceptanceRate =
        totalSubmissions > 0 ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 0;

      setStats({
        registeredEvents: registrations.length,
        problemsSolved: acceptedSubmissions,
        certificatesEarned: certs.length,
        totalSubmissions: totalSubmissions,
        acceptanceRate: acceptanceRate,
        activeEvents: activeEvents.length
      });
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      const errorMessage = err.response?.data?.message || "Failed to load dashboard data";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Handle event registration
   */
  const handleRegisterEvent = useCallback(async (eventId) => {
    try {
      setRegistrationError(null);
      await API.post(`/student/event/register/${eventId}`);
      // Refresh data after successful registration
      fetchDashboardData();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to register for event";
      setRegistrationError(errorMsg);
    }
  }, [fetchDashboardData]);

  /**
   * Handle event start
   */
  const handleStartEvent = useCallback((eventId) => {
    navigate(`/student/event/${eventId}`);
  }, [navigate]);

  /**
   * Retry data fetch
   */
  const handleRetry = useCallback(() => {
    setError(null);
    fetchDashboardData();
  }, [fetchDashboardData]);

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
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className="student-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-header__content">
          <h1>Welcome back, {user?.firstName || "Student"}! 👋</h1>
          <p className="dashboard-header__subtitle">
            Track your progress and explore coding challenges
          </p>
        </div>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => navigate("/student/events")}
        >
          🔍 Browse Events
        </button>
      </div>

      {/* Main Stats Grid */}
      <section className="stats-section">
        <h2 className="section-title">Your Stats</h2>
        <CardGrid columns={4} gap="20px">
          <StatCard
            icon="📅"
            title="Registered Events"
            value={stats.registeredEvents}
            color="primary"
            onClick={() => navigate("/student/events")}
            clickable
          />
          <StatCard
            icon="🚀"
            title="Active Events"
            value={stats.activeEvents}
            color="success"
            onClick={() => navigate("/student/events")}
            clickable
          />
          <StatCard
            icon="✅"
            title="Problems Solved"
            value={stats.problemsSolved}
            color="info"
          />
          <StatCard
            icon="🏆"
            title="Certificates"
            value={stats.certificatesEarned}
            color="warning"
            onClick={() => navigate("/student/certificates")}
            clickable
          />
        </CardGrid>
      </section>

      {/* Acceptance Rate */}
      <section className="progress-section">
        <h2 className="section-title">Performance</h2>
        <div className="card card--full">
          <ProgressCard
            icon="📊"
            title="Acceptance Rate"
            progress={stats.acceptanceRate}
            color="primary"
            label={`${stats.acceptanceRate}%`}
            subtitle={`${stats.problemsSolved} of ${stats.totalSubmissions} submissions accepted`}
          />
        </div>
      </section>

      {/* Quick Actions */}
      <section className="actions-section">
        <h2 className="section-title">Quick Actions</h2>
        <CardGrid columns={3} gap="20px">
          <ActionCard
            icon="🔍"
            title="Browse Events"
            description="Explore available events and register"
            buttonText="Browse"
            onAction={() => navigate("/student/events")}
            variant="primary"
          />
          <ActionCard
            icon="📝"
            title="My Submissions"
            description="Check your submission history"
            buttonText="View"
            onAction={() => navigate("/student/submissions")}
            variant="info"
          />
          <ActionCard
            icon="🎖️"
            title="Leaderboard"
            description="See global rankings and compete"
            buttonText="View"
            onAction={() => navigate("/student/leaderboard")}
            variant="warning"
          />
        </CardGrid>
      </section>

      {/* My Events Section */}
      <section className="events-section">
        <h2 className="section-title">
          My Events ({stats.registeredEvents})
        </h2>
        <ChartCard
          subtitle={`${myEvents.length} recent registrations`}
          action={
            myEvents.length > 0 ? (
              <button
                className="link"
                onClick={() => navigate("/student/events")}
              >
                View All →
              </button>
            ) : null
          }
        >
          {myEvents.length > 0 ? (
            <div className="events-list">
              {myEvents.map((event) => {
                // Safely get event data
                const eventObj = event.eventId || event;
                const eventName = eventObj?.name || "Unnamed Event";
                const startDate = eventObj?.startDate || eventObj?.startTime;
                const endDate = eventObj?.endDate;
                
                return (
                  <ListItemCard
                    key={eventObj?._id || Math.random()}
                    icon="📅"
                    title={eventName}
                    subtitle={
                      startDate && endDate ? (
                        <>
                          <span className="event-date">
                            {new Date(startDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })}{" "}
                            -{" "}
                            {new Date(endDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric"
                            })}
                          </span>
                          <span className="event-problems">
                            {eventObj?.problems?.length || 0} problems
                          </span>
                        </>
                      ) : (
                        <span className="event-problems">Event scheduled</span>
                      )
                    }
                    action={
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleStartEvent(eventObj?._id)}
                      >
                        Open →
                      </button>
                    }
                  />
                );
              })}
            </div>
          ) : (
            <EmptyStateCard
              icon="📭"
              title="No Events Yet"
              description="Start your journey by registering for an event"
              actionText="Browse Events"
              onAction={() => navigate("/student/events")}
            />
          )}
        </ChartCard>
      </section>

      {/* Registration Error */}
      {registrationError && (
        <div className="error-banner">
          <span>{registrationError}</span>
          <button
            className="error-banner__close"
            onClick={() => setRegistrationError(null)}
          >
            ✕
          </button>
        </div>
      )}

      {/* Certificates Section */}
      {certificates.length > 0 && (
        <section className="certificates-section">
          <h2 className="section-title">My Certificates ({certificates.length})</h2>
          <ChartCard
            action={
              <button
                className="link"
                onClick={() => navigate("/student/certificates")}
              >
                View All →
              </button>
            }
          >
            <div className="certificates-grid">
              {certificates.slice(0, 3).map((cert) => (
                <div key={cert._id} className="certificate-card">
                  <div className="certificate-card__header">
                    <h4 className="certificate-card__title">{cert.name}</h4>
                    <span className="badge badge--success">✓ Earned</span>
                  </div>
                  <p className="certificate-card__date">
                    {new Date(cert.earnedDate || cert.createdAt).toLocaleDateString()}
                  </p>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => navigate(`/student/certificates/${cert._id}`)}
                  >
                    View Certificate
                  </button>
                </div>
              ))}
            </div>
          </ChartCard>
        </section>
      )}

      {/* Profile Quick Access */}
      <section className="profile-section">
        <h2 className="section-title">Account</h2>
        <ChartCard>
          <div className="profile-quick">
            <div className="profile-quick__item">
              <span className="label">📧 Email</span>
              <span className="value">{user?.email || "Not set"}</span>
            </div>
            <div className="profile-quick__item">
              <span className="label">👤 Role</span>
              <span className="value">{user?.role || "Student"}</span>
            </div>
            <div className="profile-quick__item">
              <span className="label">📍 Status</span>
              <span className="value badge badge--active">Active</span>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/student/profile")}
            >
              Edit Profile
            </button>
          </div>
        </ChartCard>
      </section>
    </div>
  );
};

export default StudentDashboard;
 