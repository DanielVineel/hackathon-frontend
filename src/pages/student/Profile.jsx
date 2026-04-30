import React, { useState, useEffect } from "react";
import API from "../../api/api";
import { getCurrentAuth, saveAuth } from "../../utils/blutoAuth.js";

const StudentProfile = () => {
  const { user } = getCurrentAuth();
  const [profile, setProfile] = useState(user);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [activityData, setActivityData] = useState(null);
  const [activityLoading, setActivityLoading] = useState(false);
  const [userPoints, setUserPoints] = useState(null);
  const [pointsLoading, setPointsLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (activeTab === "intensity") {
      fetchActivityData();
    } else if (activeTab === "points") {
      fetchPointsData();
    }
  }, [activeTab]);

  const fetchActivityData = async () => {
    try {
      setActivityLoading(true);
      const analysisRes = await API.get('/activity-intensity/analysis?days=30');
      setActivityData(analysisRes.data);
    } catch (err) {
      console.log("Activity data not available:", err.message);
    } finally {
      setActivityLoading(false);
    }
  };

  const fetchPointsData = async () => {
    try {
      setPointsLoading(true);
      const pointsRes = await API.get('/points/summary');
      setUserPoints(pointsRes.data);
    } catch (err) {
      console.log("Points data not available:", err.message);
    } finally {
      setPointsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const res = await API.put("/student/profile", profile);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      saveAuth(res.data?.data, getCurrentAuth()?.tokens);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: "error", text: "Error updating profile" });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords don't match" });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: "error", text: "Password change not available yet" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Error changing password" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.profileTop}>
          <div style={styles.avatar}>{profile?.firstName?.charAt(0)}</div>
          <div style={styles.profileInfo}>
            <h1 style={styles.name}>{profile?.firstName} {profile?.lastName}</h1>
            <p style={styles.email}>{profile?.email}</p>
            <p style={styles.memberSince}>Member since {new Date(profile?.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab("profile")}
          style={{ ...styles.tab, ...( activeTab === "profile" ? styles.tabActive : {}) }}
        >
          👤 Profile Settings
        </button>
        <button
          onClick={() => setActiveTab("intensity")}
          style={{ ...styles.tab, ...( activeTab === "intensity" ? styles.tabActive : {}) }}
        >
          📊 Intensity Calendar
        </button>
        <button
          onClick={() => setActiveTab("points")}
          style={{ ...styles.tab, ...( activeTab === "points" ? styles.tabActive : {}) }}
        >
          🏆 Points & Rewards
        </button>
        <button
          onClick={() => setActiveTab("security")}
          style={{ ...styles.tab, ...( activeTab === "security" ? styles.tabActive : {}) }}
        >
          🔐 Security
        </button>
      </div>

      {message && (
        <div style={{
          ...styles.message,
          backgroundColor: message.type === "success" ? "#d1fae5" : "#fee2e2",
          color: message.type === "success" ? "#065f46" : "#991b1b",
          borderColor: message.type === "success" ? "#6ee7b7" : "#fecaca"
        }}>
          {message.text}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>👤 Profile Information</h2>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>First Name</label>
              <input
                type="text"
                name="firstName"
                value={profile?.firstName || ""}
                onChange={handleInputChange}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={profile?.lastName || ""}
                onChange={handleInputChange}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email (Cannot be changed)</label>
              <input
                type="email"
                name="email"
                value={profile?.email || ""}
                disabled
                style={{ ...styles.input, ...styles.inputDisabled }}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Phone</label>
              <input
                type="tel"
                name="phone"
                value={profile?.phone || ""}
                onChange={handleInputChange}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>School/College</label>
              <input
                type="text"
                name="schoolCollege"
                value={profile?.schoolCollege || ""}
                onChange={handleInputChange}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Grade/Year</label>
              <input
                type="text"
                name="gradeYear"
                value={profile?.gradeYear || ""}
                onChange={handleInputChange}
                style={styles.input}
              />
            </div>
          </div>
          <button
            onClick={handleUpdateProfile}
            disabled={loading}
            style={{ ...styles.button, ...styles.buttonPrimary }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}

      {/* Intensity Calendar Tab */}
      {activeTab === "intensity" && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📊 Activity Intensity Calendar (30 Days)</h2>
          <p style={styles.cardSubtitle}>Darker color indicates higher engagement</p>
          {activityLoading ? (
            <p style={styles.loading}>Loading activity data...</p>
          ) : activityData?.daily ? (
            <>
              <div style={styles.calendarGrid}>
                {activityData.daily.slice(-30).map((day, idx) => {
                  const getColor = (intensity) => {
                    switch (intensity) {
                      case 'very_high': return '#10b981';
                      case 'high': return '#3b82f6';
                      case 'medium': return '#06b6d4';
                      case 'low': return '#f59e0b';
                      default: return '#e5e7eb';
                    }
                  };
                  const bg = getColor(day.intensity);
                  return (
                    <div
                      key={idx}
                      title={`${new Date(day.date).toLocaleDateString()}: ${day.loginCount} logins`}
                      style={{
                        ...styles.calendarDay,
                        backgroundColor: bg
                      }}
                    >
                      {new Date(day.date).getDate()}
                    </div>
                  );
                })}
              </div>
              <div style={styles.legend}>
                <div style={styles.legendItem}>
                  <div style={{ ...styles.legendBox, backgroundColor: '#10b981' }}></div>
                  <span>Very High</span>
                </div>
                <div style={styles.legendItem}>
                  <div style={{ ...styles.legendBox, backgroundColor: '#3b82f6' }}></div>
                  <span>High</span>
                </div>
                <div style={styles.legendItem}>
                  <div style={{ ...styles.legendBox, backgroundColor: '#06b6d4' }}></div>
                  <span>Medium</span>
                </div>
                <div style={styles.legendItem}>
                  <div style={{ ...styles.legendBox, backgroundColor: '#f59e0b' }}></div>
                  <span>Low</span>
                </div>
                <div style={styles.legendItem}>
                  <div style={{ ...styles.legendBox, backgroundColor: '#e5e7eb' }}></div>
                  <span>No Activity</span>
                </div>
              </div>
            </>
          ) : (
            <p style={styles.emptyState}>No activity data available</p>
          )}
        </div>
      )}

      {/* Points Tab */}
      {activeTab === "points" && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🏆 Points & Rewards</h2>
          {pointsLoading ? (
            <p style={styles.loading}>Loading points data...</p>
          ) : userPoints ? (
            <div>
              <div style={styles.pointsGrid}>
                <div style={styles.pointsCard}>
                  <span style={styles.pointsLabel}>Total Points</span>
                  <span style={styles.pointsValue}>{userPoints.totalPoints || 0}</span>
                </div>
                <div style={styles.pointsCard}>
                  <span style={styles.pointsLabel}>Problems Solved</span>
                  <span style={styles.pointsValue}>{userPoints.pointsBreakdown?.problemsSolved || 0}</span>
                </div>
                <div style={styles.pointsCard}>
                  <span style={styles.pointsLabel}>Rank</span>
                  <span style={styles.pointsValue}>{userPoints.rank || "Unranked"}</span>
                </div>
              </div>
              {userPoints.pointHistory && userPoints.pointHistory.length > 0 && (
                <div style={{ marginTop: "24px" }}>
                  <h3 style={styles.historyTitle}>Recent Activity</h3>
                  <div style={styles.historyList}>
                    {userPoints.pointHistory.slice(-10).reverse().map((item, idx) => (
                      <div key={idx} style={styles.historyItem}>
                        <span style={styles.historyAction}>{item.action.replace('_', ' ')}</span>
                        <span style={styles.historyPoints}>+{item.points} pts</span>
                        <span style={styles.historyDate}>{new Date(item.timestamp).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p style={styles.emptyState}>No points data available</p>
          )}
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🔐 Security Settings</h2>
          <div style={styles.securitySection}>
            <h3 style={styles.securityTitle}>Change Password</h3>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  style={styles.input}
                />
              </div>
            </div>
            <button
              onClick={handleChangePassword}
              disabled={loading}
              style={{ ...styles.button, ...styles.buttonSecondary }}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "30px 20px",
    maxWidth: "1200px",
    margin: "0 auto",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh"
  },
  header: {
    backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "40px 30px",
    borderRadius: "12px",
    marginBottom: "30px",
    color: "white"
  },
  profileTop: {
    display: "flex",
    alignItems: "center",
    gap: "24px"
  },
  avatar: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    backgroundColor: "rgba(255,255,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "48px",
    fontWeight: "700",
    color: "white"
  },
  profileInfo: {
    flex: 1
  },
  name: {
    fontSize: "28px",
    fontWeight: "700",
    margin: "0 0 8px 0"
  },
  email: {
    fontSize: "14px",
    opacity: 0.9,
    margin: "0 0 4px 0"
  },
  memberSince: {
    fontSize: "12px",
    opacity: 0.8,
    margin: "0"
  },
  tabs: {
    display: "flex",
    gap: "10px",
    marginBottom: "30px",
    borderBottom: "2px solid #e5e7eb",
    overflowX: "auto",
    paddingBottom: "0"
  },
  tab: {
    padding: "12px 20px",
    backgroundColor: "transparent",
    border: "none",
    borderBottom: "3px solid transparent",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    color: "#6b7280",
    transition: "all 0.3s",
    whiteSpace: "nowrap"
  },
  tabActive: {
    color: "#667eea",
    borderBottomColor: "#667eea"
  },
  message: {
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid",
    fontSize: "14px"
  },
  card: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb"
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "700",
    marginBottom: "8px",
    color: "#1f2937"
  },
  cardSubtitle: {
    fontSize: "13px",
    color: "#6b7280",
    marginBottom: "20px",
    margin: "0 0 20px 0"
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    marginBottom: "24px"
  },
  formGroup: {
    display: "flex",
    flexDirection: "column"
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "8px"
  },
  input: {
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "14px",
    fontFamily: "inherit",
    transition: "all 0.3s"
  },
  inputDisabled: {
    backgroundColor: "#f3f4f6",
    cursor: "not-allowed"
  },
  button: {
    padding: "12px 24px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.3s"
  },
  buttonPrimary: {
    backgroundColor: "#667eea",
    color: "white"
  },
  buttonSecondary: {
    backgroundColor: "#f3f4f6",
    color: "#1f2937"
  },
  calendarGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "10px",
    marginBottom: "24px"
  },
  calendarDay: {
    padding: "16px",
    borderRadius: "8px",
    textAlign: "center",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    color: "white",
    transition: "transform 0.3s",
    aspectRatio: "1"
  },
  legend: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px"
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  legendBox: {
    width: "16px",
    height: "16px",
    borderRadius: "4px"
  },
  pointsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "24px"
  },
  pointsCard: {
    backgroundColor: "#f9fafb",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    textAlign: "center"
  },
  pointsLabel: {
    fontSize: "12px",
    color: "#6b7280",
    fontWeight: "600"
  },
  pointsValue: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#667eea"
  },
  historyTitle: {
    fontSize: "16px",
    fontWeight: "700",
    marginBottom: "12px",
    color: "#1f2937"
  },
  historyList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  historyItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    backgroundColor: "#f9fafb",
    borderRadius: "6px",
    borderLeft: "3px solid #667eea"
  },
  historyAction: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#1f2937",
    textTransform: "capitalize"
  },
  historyPoints: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#10b981"
  },
  historyDate: {
    fontSize: "12px",
    color: "#9ca3af"
  },
  securitySection: {
    padding: "20px",
    backgroundColor: "#fef3c7",
    borderRadius: "8px",
    border: "1px solid #fcd34d"
  },
  securityTitle: {
    fontSize: "16px",
    fontWeight: "700",
    marginBottom: "16px",
    color: "#92400e"
  },
  loading: {
    textAlign: "center",
    color: "#6b7280",
    padding: "20px"
  },
  emptyState: {
    textAlign: "center",
    color: "#9ca3af",
    padding: "40px 20px",
    fontSize: "14px"
  }
};

export default StudentProfile;
