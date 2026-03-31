// src/pages/superadmin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useTheme } from "../../context/ThemeContext";
import { useGlobalLoader } from "../../hooks/useLoading";
import "../styles/superadmin/Dashboard.css";

const Dashboard = () => {
  const { theme } = useTheme();
  const { showLoader, hideLoader } = useGlobalLoader();
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalUsers: 0,
    totalStudents: 0,
    totalManagers: 0,
    ongoingEvents: 0,
    totalSubmissions: 0,
    totalPayments: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(false);
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [chartData, setChartData] = useState({
    eventStatus: {},
    userGrowth: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      showLoader("Loading dashboard...");
      
      // Fetch statistics
      const [events, students, managers, submissions] = await Promise.all([
        API.get("/superadmin/events"),
        API.get("/superadmin/students"),
        API.get("/superadmin/managers"),
        API.get("/superadmin/submissions")
      ]);

      const eventData = events.data?.data || [];
      const studentData = students.data?.data || [];
      const managerData = managers.data?.data || [];
      const submissionData = submissions.data?.data || [];
      const paymentData = []; // Payments endpoint not yet configured

      // Calculate stats
      const ongoingCount = eventData.filter(e => e.status === "ongoing").length;
      const totalRevenue = paymentData.reduce((sum, p) => sum + (p.amount || 0), 0);

      setStats({
        totalEvents: eventData.length,
        totalStudents: studentData.length,
        totalManagers: managerData.length,
        totalUsers: studentData.length + managerData.length,
        ongoingEvents: ongoingCount,
        totalSubmissions: submissionData.length,
        totalPayments: paymentData.length,
        revenue: totalRevenue
      });

      // Set recent data
      setRecentEvents(eventData.slice(0, 5));
      setRecentUsers([...studentData.slice(0, 3), ...managerData.slice(0, 2)]);

      // Chart data
      const statusCounts = {};
      eventData.forEach(e => {
        statusCounts[e.status] = (statusCounts[e.status] || 0) + 1;
      });
      setChartData(prev => ({
        ...prev,
        eventStatus: statusCounts
      }));
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className={`dashboard-page theme-${theme}`}>
      {/* Header */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="dashboard-subtitle">Welcome to the SuperAdmin Dashboard</p>
      </div>

      {/* Key Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon events">📅</div>
          <div className="stat-content">
            <h3 className="stat-title">Total Events</h3>
            <p className="stat-value">{stats.totalEvents}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon users">👥</div>
          <div className="stat-content">
            <h3 className="stat-title">Total Users</h3>
            <p className="stat-value">{stats.totalUsers}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon students">🎓</div>
          <div className="stat-content">
            <h3 className="stat-title">Students</h3>
            <p className="stat-value">{stats.totalStudents}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon managers">🔧</div>
          <div className="stat-content">
            <h3 className="stat-title">Managers</h3>
            <p className="stat-value">{stats.totalManagers}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon ongoing">⚡</div>
          <div className="stat-content">
            <h3 className="stat-title">Ongoing Events</h3>
            <p className="stat-value">{stats.ongoingEvents}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon submissions">📝</div>
          <div className="stat-content">
            <h3 className="stat-title">Submissions</h3>
            <p className="stat-value">{stats.totalSubmissions}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon payments">💳</div>
          <div className="stat-content">
            <h3 className="stat-title">Payments</h3>
            <p className="stat-value">{stats.totalPayments}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue">💰</div>
          <div className="stat-content">
            <h3 className="stat-title">Revenue</h3>
            <p className="stat-value">{formatCurrency(stats.revenue)}</p>
          </div>
        </div>
      </div>

      {/* Charts and Recent Data */}
      <div className="dashboard-content">
        {/* Event Status Chart */}
        <div className="chart-container">
          <h2>Event Status Distribution</h2>
          <div className="status-chart">
            {Object.entries(chartData.eventStatus).map(([status, count]) => (
              <div key={status} className="chart-item">
                <div className="chart-label">{status?.toUpperCase()}</div>
                <div className="chart-bar-container">
                  <div
                    className="chart-bar"
                    style={{
                      width: `${(count / Math.max(...Object.values(chartData.eventStatus), 1)) * 100}%`,
                      backgroundColor: getStatusColor(status)
                    }}
                  ></div>
                </div>
                <div className="chart-value">{count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Events */}
        <div className="recent-container">
          <h2>Recent Events</h2>
          <div className="recent-list">
            {recentEvents.length === 0 ? (
              <p className="no-data">No recent events</p>
            ) : (
              recentEvents.map(event => (
                <div key={event._id} className="recent-item">
                  <div className="recent-item-header">
                    <h4>{event.name}</h4>
                    <span className="status-badge">{event.status}</span>
                  </div>
                  <p className="recent-item-meta">
                    <strong>By:</strong> {event.organizedBy}
                  </p>
                  <p className="recent-item-date">
                    📅 {formatDate(event.startDate)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="recent-users-container">
        <h2>Recent Users</h2>
        <div className="recent-users-list">
          {recentUsers.length === 0 ? (
            <p className="no-data">No recent users</p>
          ) : (
            recentUsers.map(user => (
              <div key={user._id} className="recent-user-item">
                <div className="user-avatar">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="user-info">
                  <h4>{user.name || "N/A"}</h4>
                  <p>{user.email}</p>
                </div>
                <div className="user-role">
                  <span className={`role-badge role-${user.role}`}>
                    {user.role}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case "ongoing":
      return "#10b981";
    case "completed":
      return "#3b82f6";
    case "canceled":
      return "#ef4444";
    default:
      return "#8b5cf6";
  }
};

export default Dashboard;