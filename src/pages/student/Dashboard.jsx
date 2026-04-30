// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../../api/api";
// import { getUserData } from "../../utils/auth";
// import "../styles/student/Dashboard.css";

// const StudentDashboard = () => {
//   const navigate = useNavigate();
//   const user = getUserData();

//   const [stats, setStats] = useState({
//     registeredEvents: 0,
//     participatedEvents: 0,
//     problemsSolved: 0,
//     certificatesEarned: 0,
//     totalScore: 0,
//     acceptanceRate: 0,
//     activeEvents: 0
//   });

//   const [leaderboard, setLeaderboard] = useState([]);
//   const [userRank, setUserRank] = useState(null);
//   const [activityIntensity, setActivityIntensity] = useState(null);
//   const [myEvents, setMyEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   const fetchAllData = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // Fetch events
//       const eventsRes = await API.get("/student/myEvents");
//       const registrations = Array.isArray(eventsRes.data.registrations)
//         ? eventsRes.data.registrations
//         : [];

//       const events = registrations
//         .map((reg) => reg.eventId)
//         .filter((event) => event && event._id);

//       setMyEvents(events.slice(0, 5));

//       // Fetch leaderboard
//       try {
//         const leaderRes = await API.get("/points/leaderboard?limit=10");
//         setLeaderboard(leaderRes.data.leaderboard || []);
//       } catch (err) {
//         console.log("Leaderboard fetch failed");
//       }

//       // Fetch user rank
//       try {
//         const rankRes = await API.get("/points/rank");
//         setUserRank(rankRes.data);
//       } catch (err) {
//         console.log("Rank fetch failed");
//       }

//       // Fetch activity
//       try {
//         const actRes = await API.get("/activity-intensity/current");
//         setActivityIntensity(actRes.data);
//       } catch (err) {
//         console.log("Activity fetch failed");
//       }

//       const now = new Date();
//       const participated = events.filter((e) => {
//         const endDate = new Date(e.endDate);
//         return endDate < now;
//       });

//       const active = events.filter((e) => {
//         const startDate = new Date(e.startDate);
//         return startDate > now;
//       });

//       setStats({
//         registeredEvents: registrations.length,
//         participatedEvents: participated.length,
//         problemsSolved: registrations.filter(
//           (reg) => reg.registrationStatus === "registered"
//         ).length,
//         certificatesEarned: 0,
//         totalScore: userRank?.totalPoints || 0,
//         acceptanceRate:
//           registrations.length > 0
//             ? Math.round(
//                 (registrations.filter(
//                   (reg) => reg.registrationStatus === "registered"
//                 ).length /
//                   registrations.length) *
//                   100
//               )
//             : 0,
//         activeEvents: active.length
//       });
//     } catch (err) {
//       console.error("Dashboard fetch error:", err);
//       setError("Failed to load dashboard data");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   if (loading) {
//     return (
//       <div style={styles.container}>
//         <div style={styles.loadingCenter}>Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div style={styles.container}>
//       {/* Header */}
//       <div style={styles.header}>
//         <div>
//           <h1 style={styles.greeting}>Welcome back, {user?.firstName}! 👋</h1>
//           <p style={styles.subtext}>Here's your platform overview</p>
//         </div>
//         <button
//           onClick={() => navigate("/student/events")}
//           style={{ ...styles.button, ...styles.buttonPrimary }}
//         >
//           🔍 Browse Events
//         </button>
//       </div>

//       {/* Stats Grid */}
//       <div style={styles.statsGrid}>
//         <div style={styles.statCard}>
//           <div style={styles.statIcon}>📅</div>
//           <div style={styles.statContent}>
//             <span style={styles.statLabel}>Registered</span>
//             <span style={styles.statValue}>{stats.registeredEvents}</span>
//           </div>
//         </div>
//         <div style={styles.statCard}>
//           <div style={styles.statIcon}>✅</div>
//           <div style={styles.statContent}>
//             <span style={styles.statLabel}>Participated</span>
//             <span style={styles.statValue}>{stats.participatedEvents}</span>
//           </div>
//         </div>
//         <div style={styles.statCard}>
//           <div style={styles.statIcon}>🚀</div>
//           <div style={styles.statContent}>
//             <span style={styles.statLabel}>Active Events</span>
//             <span style={styles.statValue}>{stats.activeEvents}</span>
//           </div>
//         </div>
//         <div style={styles.statCard}>
//           <div style={styles.statIcon}>💯</div>
//           <div style={styles.statContent}>
//             <span style={styles.statLabel}>Acceptance</span>
//             <span style={styles.statValue}>{stats.acceptanceRate}%</span>
//           </div>
//         </div>
//         <div style={styles.statCard}>
//           <div style={styles.statIcon}>🏆</div>
//           <div style={styles.statContent}>
//             <span style={styles.statLabel}>Total Points</span>
//             <span style={styles.statValue}>{stats.totalScore}</span>
//           </div>
//         </div>
//         <div style={styles.statCard}>
//           <div style={styles.statIcon}>⚡</div>
//           <div style={styles.statContent}>
//             <span style={styles.statLabel}>Intensity</span>
//             <span style={styles.statValue}>
//               {activityIntensity?.currentIntensity || "N/A"}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div style={styles.mainGrid}>
//         {/* Activity Insights */}
//         <div style={styles.card}>
//           <h2 style={styles.cardTitle}>📊 Activity Insights</h2>
//           {activityIntensity ? (
//             <div>
//               <div style={styles.insightRow}>
//                 <span>Current Streak</span>
//                 <span style={styles.bold}>
//                   {activityIntensity?.streak?.current || 0} days
//                 </span>
//               </div>
//               <div style={styles.insightRow}>
//                 <span>Best Streak</span>
//                 <span style={styles.bold}>
//                   {activityIntensity?.streak?.longest || 0} days
//                 </span>
//               </div>
//               <div style={styles.insightRow}>
//                 <span>Consistency</span>
//                 <span style={styles.bold}>
//                   {activityIntensity?.streak?.consistency || 0}%
//                 </span>
//               </div>
//               <div style={styles.insightRow}>
//                 <span>Intensity Score</span>
//                 <span style={styles.bold}>
//                   {activityIntensity?.intensityScore || 0}/100
//                 </span>
//               </div>
//             </div>
//           ) : (
//             <p style={styles.textMuted}>Activity data unavailable</p>
//           )}
//         </div>

//         {/* User Rank */}
//         {userRank && (
//           <div style={styles.card}>
//             <h2 style={styles.cardTitle}>🎯 Your Rank</h2>
//             <div style={styles.rankBox}>
//               <div style={styles.rankCircle}>
//                 <span style={styles.rankNumber}>#{userRank.rank}</span>
//               </div>
//               <div style={styles.rankInfo}>
//                 <p style={styles.rankLevel}>{userRank.level || "Silver"}</p>
//                 <p style={styles.rankPoints}>{userRank.totalPoints} points</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Quick Actions */}
//         <div style={styles.card}>
//           <h2 style={styles.cardTitle}>⚙️ Quick Actions</h2>
//           <div style={styles.actionList}>
//             <button
//               onClick={() => navigate("/student/profile")}
//               style={styles.actionButton}
//             >
//               👤 Edit Profile
//             </button>
//             <button
//               onClick={() => navigate("/student/certificates")}
//               style={styles.actionButton}
//             >
//               🏅 View Certificates
//             </button>
//             <button
//               onClick={() => navigate("/student/problems")}
//               style={styles.actionButton}
//             >
//               💻 Solve Problems
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Global Leaderboard */}
//       <div style={styles.card}>
//         <div style={styles.cardHeader}>
//           <h2 style={styles.cardTitle}>🏆 Global Leaderboard</h2>
//           <button
//             onClick={() => window.location.reload()}
//             style={styles.refreshBtn}
//           >
//             🔄 Refresh
//           </button>
//         </div>
//         <div style={styles.leaderboardTable}>
//           <div style={styles.leaderboardHeader}>
//             <span style={{ flex: 1 }}>Rank</span>
//             <span style={{ flex: 3 }}>Student</span>
//             <span style={{ flex: 2 }}>Points</span>
//             <span style={{ flex: 2 }}>Level</span>
//           </div>
//           {leaderboard && leaderboard.length > 0 ? (
//             leaderboard.map((student, idx) => (
//               <div
//                 key={idx}
//                 style={{
//                   ...styles.leaderboardRow,
//                   backgroundColor:
//                     student.userId === user?._id
//                       ? "rgba(59, 130, 246, 0.1)"
//                       : "transparent",
//                   borderLeft:
//                     student.userId === user?._id
//                       ? "4px solid #3b82f6"
//                       : "4px solid transparent"
//                 }}
//               >
//                 <span style={{ flex: 1 }}>
//                   {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx + 1}
//                 </span>
//                 <span style={{ flex: 3 }}>
//                   {student.firstName || "User"} {idx === 0 && "👑"}
//                 </span>
//                 <span style={{ flex: 2, fontWeight: "bold" }}>
//                   {student.totalPoints || 0}
//                 </span>
//                 <span style={{ flex: 2 }}>{student.level || "Bronze"}</span>
//               </div>
//             ))
//           ) : (
//             <div style={styles.emptyState}>No leaderboard data available</div>
//           )}
//         </div>
//       </div>

//       {/* My Recent Events */}
//       {myEvents.length > 0 && (
//         <div style={styles.card}>
//           <div style={styles.cardHeader}>
//             <h2 style={styles.cardTitle}>📅 My Recent Events</h2>
//             <button
//               onClick={() => navigate("/student/events")}
//               style={styles.linkBtn}
//             >
//               View All →
//             </button>
//           </div>
//           <div style={styles.eventsList}>
//             {myEvents.map((event) => (
//               <div key={event._id} style={styles.eventItem}>
//                 <div style={styles.eventInfo}>
//                   <h4 style={styles.eventName}>{event.name}</h4>
//                   <p style={styles.eventDate}>
//                     {new Date(event.startDate).toLocaleDateString()} -{" "}
//                     {new Date(event.endDate).toLocaleDateString()}
//                   </p>
//                   <p style={styles.eventProblems}>
//                     {event.problems?.length || 0} problems
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => navigate(`/student/event/${event._id}`)}
//                   style={styles.eventButton}
//                 >
//                   Open →
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const styles = {
//   container: {
//     padding: "30px 20px",
//     maxWidth: "1400px",
//     margin: "0 auto",
//     backgroundColor: "#f8f9fa",
//     minHeight: "100vh"
//   },
//   header: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: "40px",
//     backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//     padding: "30px",
//     borderRadius: "12px",
//     color: "white"
//   },
//   greeting: {
//     fontSize: "28px",
//     fontWeight: "700",
//     marginBottom: "8px",
//     color: "white"
//   },
//   subtext: {
//     fontSize: "14px",
//     opacity: 0.9
//   },
//   button: {
//     padding: "12px 24px",
//     border: "none",
//     borderRadius: "8px",
//     cursor: "pointer",
//     fontWeight: "600",
//     fontSize: "14px",
//     transition: "all 0.3s"
//   },
//   buttonPrimary: {
//     backgroundColor: "white",
//     color: "#667eea"
//   },
//   statsGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
//     gap: "15px",
//     marginBottom: "40px"
//   },
//   statCard: {
//     backgroundColor: "white",
//     padding: "20px",
//     borderRadius: "12px",
//     display: "flex",
//     alignItems: "center",
//     gap: "15px",
//     boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//     border: "1px solid #e5e7eb"
//   },
//   statIcon: {
//     fontSize: "32px"
//   },
//   statContent: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "5px"
//   },
//   statLabel: {
//     fontSize: "12px",
//     color: "#6b7280",
//     fontWeight: "500"
//   },
//   statValue: {
//     fontSize: "24px",
//     fontWeight: "700",
//     color: "#1f2937"
//   },
//   mainGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
//     gap: "20px",
//     marginBottom: "40px"
//   },
//   card: {
//     backgroundColor: "white",
//     padding: "24px",
//     borderRadius: "12px",
//     boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//     border: "1px solid #e5e7eb"
//   },
//   cardHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: "16px"
//   },
//   cardTitle: {
//     fontSize: "18px",
//     fontWeight: "700",
//     margin: "0 0 16px 0",
//     color: "#1f2937"
//   },
//   insightRow: {
//     display: "flex",
//     justifyContent: "space-between",
//     padding: "12px 0",
//     borderBottom: "1px solid #f3f4f6"
//   },
//   bold: {
//     fontWeight: "700",
//     color: "#1f2937"
//   },
//   textMuted: {
//     color: "#9ca3af",
//     fontSize: "14px"
//   },
//   rankBox: {
//     display: "flex",
//     alignItems: "center",
//     gap: "20px",
//     padding: "16px",
//     backgroundColor: "#f3f4f6",
//     borderRadius: "8px"
//   },
//   rankCircle: {
//     width: "80px",
//     height: "80px",
//     borderRadius: "50%",
//     backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     color: "white"
//   },
//   rankNumber: {
//     fontSize: "32px",
//     fontWeight: "700"
//   },
//   rankInfo: {
//     flex: 1
//   },
//   rankLevel: {
//     fontSize: "18px",
//     fontWeight: "600",
//     margin: "0 0 4px 0",
//     color: "#1f2937"
//   },
//   rankPoints: {
//     fontSize: "14px",
//     color: "#6b7280",
//     margin: "0"
//   },
//   actionList: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "10px"
//   },
//   actionButton: {
//     padding: "12px 16px",
//     backgroundColor: "#f3f4f6",
//     border: "none",
//     borderRadius: "8px",
//     cursor: "pointer",
//     textAlign: "left",
//     fontWeight: "500",
//     transition: "all 0.3s",
//     fontSize: "14px"
//   },
//   refreshBtn: {
//     padding: "8px 16px",
//     backgroundColor: "#f3f4f6",
//     border: "none",
//     borderRadius: "6px",
//     cursor: "pointer",
//     fontWeight: "600",
//     fontSize: "13px"
//   },
//   linkBtn: {
//     padding: "8px 16px",
//     backgroundColor: "transparent",
//     border: "none",
//     color: "#667eea",
//     cursor: "pointer",
//     fontWeight: "600",
//     fontSize: "13px"
//   },
//   leaderboardTable: {
//     backgroundColor: "#f9fafb",
//     borderRadius: "8px",
//     overflow: "hidden"
//   },
//   leaderboardHeader: {
//     display: "grid",
//     gridTemplateColumns: "1fr 3fr 2fr 2fr",
//     padding: "16px 20px",
//     backgroundColor: "#f3f4f6",
//     fontWeight: "700",
//     fontSize: "13px",
//     color: "#6b7280",
//     borderBottom: "2px solid #e5e7eb"
//   },
//   leaderboardRow: {
//     display: "grid",
//     gridTemplateColumns: "1fr 3fr 2fr 2fr",
//     padding: "16px 20px",
//     borderBottom: "1px solid #e5e7eb",
//     fontSize: "14px",
//     alignItems: "center",
//     transition: "background-color 0.3s"
//   },
//   emptyState: {
//     padding: "40px 20px",
//     textAlign: "center",
//     color: "#9ca3af"
//   },
//   eventsList: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "12px"
//   },
//   eventItem: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "16px",
//     backgroundColor: "#f9fafb",
//     borderRadius: "8px",
//     border: "1px solid #e5e7eb"
//   },
//   eventInfo: {
//     flex: 1
//   },
//   eventName: {
//     fontSize: "15px",
//     fontWeight: "700",
//     margin: "0 0 4px 0",
//     color: "#1f2937"
//   },
//   eventDate: {
//     fontSize: "12px",
//     color: "#6b7280",
//     margin: "0 0 4px 0"
//   },
//   eventProblems: {
//     fontSize: "12px",
//     color: "#667eea",
//     margin: "0",
//     fontWeight: "600"
//   },
//   eventButton: {
//     padding: "8px 16px",
//     backgroundColor: "#667eea",
//     color: "white",
//     border: "none",
//     borderRadius: "6px",
//     cursor: "pointer",
//     fontWeight: "600",
//     fontSize: "13px"
//   },
//   loadingCenter: {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     height: "100vh",
//     fontSize: "18px",
//     color: "#6b7280"
//   }
// };

// export default StudentDashboard;

// /**
//  * Student Dashboard Component
//  * Shows student stats, events, submissions, and certificates
//  */
// const StudentDashboard = () => {
//   const navigate = useNavigate();
//   const user = getUserData();

//   // Stats State
//   const [stats, setStats] = useState({
//     registeredEvents: 0,
//     problemsSolved: 0,
//     certificatesEarned: 0,
//     totalSubmissions: 0,
//     acceptanceRate: 0,
//     activeEvents: 0
//   });

//   // Activity Insights State
//   const [activityIntensity, setActivityIntensity] = useState(null);
//   const [activityAnalysis, setActivityAnalysis] = useState(null);
//   const [activityLoading, setActivityLoading] = useState(false);

//   // Data State
//   const [myEvents, setMyEvents] = useState([]);
//   const [certificates, setCertificates] = useState([]);

//   // UI State
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [registrationError, setRegistrationError] = useState(null);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   /**
//    * Fetch all dashboard data in parallel
//    */
//   const fetchDashboardData = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       setActivityLoading(true);

//       // 🔄 Fetch student's registered events
//       const eventsRes = await API.get("/student/myEvents");
//       const eventData = eventsRes.data;
//       const registrations = Array.isArray(eventData.registrations) ? eventData.registrations : [];

//       // Populate event details from registrations
//       const events = registrations
//         .map((reg) => reg.eventId)
//         .filter((event) => event && event._id);

//       // Filter active events (ongoing or upcoming)
//       const now = new Date();
//       const activeEvents = events.filter((e) => {
//         const startDate = new Date(e.startDate);
//         return startDate > now; // Upcoming
//       });

//       // Set events with safety checks
//       setMyEvents(Array.isArray(events) ? events.slice(0, 5) : []);

//       // 🔄 Fetch certificates
//       const certificatesRes = await API.get("/student/certificates");
//       const certData = certificatesRes.data;
//       const certs = Array.isArray(certData.certificates)
//         ? certData.certificates
//         : Array.isArray(certData)
//           ? certData
//           : [];
//       setCertificates(certs);

//       // 🔄 Fetch activity insights
//       try {
//         const [intensityRes, analysisRes] = await Promise.all([
//           API.get('/activity-intensity/current'),
//           API.get('/activity-intensity/analysis?days=7')
//         ]);
//         setActivityIntensity(intensityRes.data);
//         setActivityAnalysis(analysisRes.data);
//       } catch (actErr) {
//         console.log("Activity insights not available:", actErr.message);
//         // Activity insights is optional, so we don't fail the dashboard
//       } finally {
//         setActivityLoading(false);
//       }

//       // 🔄 Calculate stats
//       let totalSubmissions = 0;
//       let acceptedSubmissions = 0;

//       // Calculate from successful registrations
//       acceptedSubmissions = registrations.filter((reg) => reg.registrationStatus === "registered").length;
//       totalSubmissions = registrations.length;

//       const acceptanceRate =
//         totalSubmissions > 0 ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 0;

//       setStats({
//         registeredEvents: registrations.length,
//         problemsSolved: acceptedSubmissions,
//         certificatesEarned: certs.length,
//         totalSubmissions: totalSubmissions,
//         acceptanceRate: acceptanceRate,
//         activeEvents: activeEvents.length
//       });
//     } catch (err) {
//       console.error("Dashboard fetch error:", err);
//       const errorMessage = err.response?.data?.message || "Failed to load dashboard data";
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   /**
//    * Handle event registration
//    */
//   const handleRegisterEvent = useCallback(async (eventId) => {
//     try {
//       setRegistrationError(null);
//       await API.post(`/student/event/register/${eventId}`);
//       // Refresh data after successful registration
//       fetchDashboardData();
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || "Failed to register for event";
//       setRegistrationError(errorMsg);
//     }
//   }, [fetchDashboardData]);

//   /**
//    * Handle event start
//    */
//   const handleStartEvent = useCallback((eventId) => {
//     navigate(`/student/event/${eventId}`);
//   }, [navigate]);

//   /**
//    * Retry data fetch
//    */
//   const handleRetry = useCallback(() => {
//     setError(null);
//     fetchDashboardData();
//   }, [fetchDashboardData]);

//   // Loading State
//   if (loading) {
//     return <LoadingCard message="Loading your dashboard..." />;
//   }

//   // Error State
//   if (error) {
//     return (
//       <ErrorCard
//         title="Dashboard Error"
//         message={error}
//         onRetry={handleRetry}
//       />
//     );
//   }

//   return (
//     <div className="student-dashboard">
//       {/* Header */}
//       <div className="dashboard-header">
//         <div className="dashboard-header__content">
//           <h1>Welcome back, {user?.firstName || "Student"}! 👋</h1>
//           <p className="dashboard-header__subtitle">
//             Track your progress and explore coding challenges
//           </p>
//         </div>
//         <button
//           className="btn btn-primary btn-lg"
//           onClick={() => navigate("/student/events")}
//         >
//           🔍 Browse Events
//         </button>
//       </div>

//       {/* Main Stats Grid */}
//       <section className="stats-section">
//         <h2 className="section-title">Your Stats</h2>
//         <CardGrid columns={4} gap="20px">
//           <StatCard
//             icon="📅"
//             title="Registered Events"
//             value={stats.registeredEvents}
//             color="primary"
//             onClick={() => navigate("/student/events")}
//             clickable
//           />
//           <StatCard
//             icon="🚀"
//             title="Active Events"
//             value={stats.activeEvents}
//             color="success"
//             onClick={() => navigate("/student/events")}
//             clickable
//           />
//           <StatCard
//             icon="✅"
//             title="Problems Solved"
//             value={stats.problemsSolved}
//             color="info"
//           />
//           <StatCard
//             icon="🏆"
//             title="Certificates"
//             value={stats.certificatesEarned}
//             color="warning"
//             onClick={() => navigate("/student/certificates")}
//             clickable
//           />
//         </CardGrid>
//       </section>

//       {/* Acceptance Rate */}
//       <section className="progress-section">
//         <h2 className="section-title">Performance</h2>
//         <div className="card card--full">
//           <ProgressCard
//             icon="📊"
//             title="Acceptance Rate"
//             progress={stats.acceptanceRate}
//             color="primary"
//             label={`${stats.acceptanceRate}%`}
//             subtitle={`${stats.problemsSolved} of ${stats.totalSubmissions} submissions accepted`}
//           />
//         </div>
//       </section>

//       {/* Activity Insights Section */}
//       {!activityLoading && activityIntensity && (
//         <section className="activity-insights-section">
//           <h2 className="section-title">Activity Insights</h2>
//           <CardGrid columns={3} gap="20px">
//             <StatCard
//               icon="⚡"
//               title="Current Intensity"
//               value={activityIntensity?.currentIntensity || 'Low'}
//               color={
//                 activityIntensity?.currentIntensity === 'very_high'
//                   ? 'success'
//                   : activityIntensity?.currentIntensity === 'high'
//                   ? 'primary'
//                   : activityIntensity?.currentIntensity === 'medium'
//                   ? 'info'
//                   : 'warning'
//               }
//             />
//             <StatCard
//               icon="📈"
//               title="Intensity Score"
//               value={`${activityIntensity?.intensityScore || 0}/100`}
//               subtitle="Daily average"
//               color="primary"
//             />
//             <StatCard
//               icon="🔥"
//               title="Current Streak"
//               value={`${activityIntensity?.streak?.current || 0} days`}
//               subtitle={`Best: ${activityIntensity?.streak?.longest || 0} days`}
//               color="success"
//             />
//           </CardGrid>

//           {/* Daily Breakdown */}
//           {activityAnalysis?.daily && Array.isArray(activityAnalysis.daily) && activityAnalysis.daily.length > 0 && (
//             <div className="card card--full" style={{ marginTop: '20px' }}>
//               <h3 style={{ marginBottom: '15px' }}>Last 7 Days Activity</h3>
//               <div className="daily-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
//                 {activityAnalysis.daily.slice(-7).reverse().map((day, idx) => (
//                   <div key={idx} style={{
//                     padding: '10px',
//                     borderRadius: '8px',
//                     backgroundColor: 
//                       day.intensity === 'very_high' ? '#10b981' :
//                       day.intensity === 'high' ? '#3b82f6' :
//                       day.intensity === 'medium' ? '#06b6d4' :
//                       day.intensity === 'low' ? '#f59e0b' :
//                       '#e5e7eb',
//                     color: day.intensity !== 'low' ? 'white' : '#000',
//                     textAlign: 'center',
//                     fontSize: '12px'
//                   }}>
//                     <p style={{ margin: '5px 0' }}>
//                       {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
//                     </p>
//                     <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{day.loginCount} logins</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </section>
//       )}

//       {/* Quick Actions */}
//       <section className="actions-section">
//         <h2 className="section-title">Quick Actions</h2>
//         <CardGrid columns={3} gap="20px">
//           <ActionCard
//             icon="🔍"
//             title="Browse Events"
//             description="Explore available events and register"
//             buttonText="Browse"
//             onAction={() => navigate("/student/events")}
//             variant="primary"
//           />
//           <ActionCard
//             icon="📝"
//             title="My Submissions"
//             description="Check your submission history"
//             buttonText="View"
//             onAction={() => navigate("/student/submissions")}
//             variant="info"
//           />
//           <ActionCard
//             icon="🎖️"
//             title="Leaderboard"
//             description="See global rankings and compete"
//             buttonText="View"
//             onAction={() => navigate("/student/leaderboard")}
//             variant="warning"
//           />
//         </CardGrid>
//       </section>

//       {/* My Events Section */}
//       <section className="events-section">
//         <h2 className="section-title">
//           My Events ({stats.registeredEvents})
//         </h2>
//         <ChartCard
//           subtitle={`${myEvents.length} recent registrations`}
//           action={
//             myEvents.length > 0 ? (
//               <button
//                 className="link"
//                 onClick={() => navigate("/student/events")}
//               >
//                 View All →
//               </button>
//             ) : null
//           }
//         >
//           {myEvents.length > 0 ? (
//             <div className="events-list">
//               {myEvents.map((event) => {
//                 // Safely get event data
//                 const eventObj = event.eventId || event;
//                 const eventName = eventObj?.name || "Unnamed Event";
//                 const startDate = eventObj?.startDate || eventObj?.startTime;
//                 const endDate = eventObj?.endDate;
                
//                 return (
//                   <ListItemCard
//                     key={eventObj?._id || Math.random()}
//                     icon="📅"
//                     title={eventName}
//                     subtitle={
//                       startDate && endDate ? (
//                         <>
//                           <span className="event-date">
//                             {new Date(startDate).toLocaleDateString("en-US", {
//                               month: "short",
//                               day: "numeric",
//                               year: "numeric"
//                             })}{" "}
//                             -{" "}
//                             {new Date(endDate).toLocaleDateString("en-US", {
//                               month: "short",
//                               day: "numeric"
//                             })}
//                           </span>
//                           <span className="event-problems">
//                             {eventObj?.problems?.length || 0} problems
//                           </span>
//                         </>
//                       ) : (
//                         <span className="event-problems">Event scheduled</span>
//                       )
//                     }
//                     action={
//                       <button
//                         className="btn btn-sm btn-primary"
//                         onClick={() => handleStartEvent(eventObj?._id)}
//                       >
//                         Open →
//                       </button>
//                     }
//                   />
//                 );
//               })}
//             </div>
//           ) : (
//             <EmptyStateCard
//               icon="📭"
//               title="No Events Yet"
//               description="Start your journey by registering for an event"
//               actionText="Browse Events"
//               onAction={() => navigate("/student/events")}
//             />
//           )}
//         </ChartCard>
//       </section>

//       {/* Registration Error */}
//       {registrationError && (
//         <div className="error-banner">
//           <span>{registrationError}</span>
//           <button
//             className="error-banner__close"
//             onClick={() => setRegistrationError(null)}
//           >
//             ✕
//           </button>
//         </div>
//       )}

//       {/* Certificates Section */}
//       {certificates.length > 0 && (
//         <section className="certificates-section">
//           <h2 className="section-title">My Certificates ({certificates.length})</h2>
//           <ChartCard
//             action={
//               <button
//                 className="link"
//                 onClick={() => navigate("/student/certificates")}
//               >
//                 View All →
//               </button>
//             }
//           >
//             <div className="certificates-grid">
//               {certificates.slice(0, 3).map((cert) => (
//                 <div key={cert._id} className="certificate-card">
//                   <div className="certificate-card__header">
//                     <h4 className="certificate-card__title">{cert.name}</h4>
//                     <span className="badge badge--success">✓ Earned</span>
//                   </div>
//                   <p className="certificate-card__date">
//                     {new Date(cert.earnedDate || cert.createdAt).toLocaleDateString()}
//                   </p>
//                   <button
//                     className="btn btn-sm btn-outline"
//                     onClick={() => navigate(`/student/certificates/${cert._id}`)}
//                   >
//                     View Certificate
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </ChartCard>
//         </section>
//       )}

//       {/* Profile Quick Access */}
//       <section className="profile-section">
//         <h2 className="section-title">Account</h2>
//         <ChartCard>
//           <div className="profile-quick">
//             <div className="profile-quick__item">
//               <span className="label">📧 Email</span>
//               <span className="value">{user?.email || "Not set"}</span>
//             </div>
//             <div className="profile-quick__item">
//               <span className="label">👤 Role</span>
//               <span className="value">{user?.role || "Student"}</span>
//             </div>
//             <div className="profile-quick__item">
//               <span className="label">📍 Status</span>
//               <span className="value badge badge--active">Active</span>
//             </div>
//             <button
//               className="btn btn-primary"
//               onClick={() => navigate("/student/profile")}
//             >
//               Edit Profile
//             </button>
//           </div>
//         </ChartCard>
//       </section>
//     </div>
//   );
// };

// export default StudentDashboard;
 import React, { useState, useEffect, useCallback } from "react";
 import { useNavigate } from "react-router-dom";
 import API from "../../api/api";
 import { getUserData } from "../../utils/auth";
 import "../styles/student/Dashboard.css";
 
 const StudentDashboard = () => {
   const navigate = useNavigate();
   const user = getUserData();
 
   const [stats, setStats] = useState({
     registeredEvents: 0,
     participatedEvents: 0,
     problemsSolved: 0,
     certificatesEarned: 0,
     totalScore: 0,
     acceptanceRate: 0,
     activeEvents: 0
   });
 
   const [leaderboard, setLeaderboard] = useState([]);
   const [userRank, setUserRank] = useState(null);
   const [activityIntensity, setActivityIntensity] = useState(null);
   const [myEvents, setMyEvents] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
 
   useEffect(() => {
     fetchAllData();
   }, []);
 
   const fetchAllData = useCallback(async () => {
     try {
       setLoading(true);
       setError(null);
 
       // Fetch events
       const eventsRes = await API.get("/student/myEvents");
       const registrations = Array.isArray(eventsRes.data.registrations)
         ? eventsRes.data.registrations
         : [];
 
       const events = registrations
         .map((reg) => reg.eventId)
         .filter((event) => event && event._id);
 
       setMyEvents(events.slice(0, 5));
 
       // Fetch leaderboard
       try {
         const leaderRes = await API.get("/points/leaderboard?limit=10");
         setLeaderboard(leaderRes.data.leaderboard || []);
       } catch (err) {
         console.log("Leaderboard fetch failed");
       }
 
       // Fetch user rank
       try {
         const rankRes = await API.get("/points/rank");
         setUserRank(rankRes.data);
       } catch (err) {
         console.log("Rank fetch failed");
       }
 
       // Fetch activity
       try {
         const actRes = await API.get("/activity-intensity/current");
         setActivityIntensity(actRes.data);
       } catch (err) {
         console.log("Activity fetch failed");
       }
 
       const now = new Date();
       const participated = events.filter((e) => {
         const endDate = new Date(e.endDate);
         return endDate < now;
       });
 
       const active = events.filter((e) => {
         const startDate = new Date(e.startDate);
         return startDate > now;
       });
 
       setStats({
         registeredEvents: registrations.length,
         participatedEvents: participated.length,
         problemsSolved: registrations.filter(
           (reg) => reg.registrationStatus === "registered"
         ).length,
         certificatesEarned: 0,
         totalScore: userRank?.totalPoints || 0,
         acceptanceRate:
           registrations.length > 0
             ? Math.round(
                 (registrations.filter(
                   (reg) => reg.registrationStatus === "registered"
                 ).length /
                   registrations.length) *
                   100
               )
             : 0,
         activeEvents: active.length
       });
     } catch (err) {
       console.error("Dashboard fetch error:", err);
       setError("Failed to load dashboard data");
     } finally {
       setLoading(false);
     }
   }, []);
 
   if (loading) {
     return (
       <div style={styles.container}>
         <div style={styles.loadingCenter}>Loading...</div>
       </div>
     );
   }
 
   return (
     <div style={styles.container}>
       {/* Header */}
       <div style={styles.header}>
         <div>
           <h1 style={styles.greeting}>Welcome back, {user?.firstName}! 👋</h1>
           <p style={styles.subtext}>Here's your platform overview</p>
         </div>
         <button
           onClick={() => navigate("/student/events")}
           style={{ ...styles.button, ...styles.buttonPrimary }}
         >
           🔍 Browse Events
         </button>
       </div>
 
       {/* Stats Grid */}
       <div style={styles.statsGrid}>
         <div style={styles.statCard}>
           <div style={styles.statIcon}>📅</div>
           <div style={styles.statContent}>
             <span style={styles.statLabel}>Registered</span>
             <span style={styles.statValue}>{stats.registeredEvents}</span>
           </div>
         </div>
         <div style={styles.statCard}>
           <div style={styles.statIcon}>✅</div>
           <div style={styles.statContent}>
             <span style={styles.statLabel}>Participated</span>
             <span style={styles.statValue}>{stats.participatedEvents}</span>
           </div>
         </div>
         <div style={styles.statCard}>
           <div style={styles.statIcon}>🚀</div>
           <div style={styles.statContent}>
             <span style={styles.statLabel}>Active Events</span>
             <span style={styles.statValue}>{stats.activeEvents}</span>
           </div>
         </div>
         <div style={styles.statCard}>
           <div style={styles.statIcon}>💯</div>
           <div style={styles.statContent}>
             <span style={styles.statLabel}>Acceptance</span>
             <span style={styles.statValue}>{stats.acceptanceRate}%</span>
           </div>
         </div>
         <div style={styles.statCard}>
           <div style={styles.statIcon}>🏆</div>
           <div style={styles.statContent}>
             <span style={styles.statLabel}>Total Points</span>
             <span style={styles.statValue}>{stats.totalScore}</span>
           </div>
         </div>
         <div style={styles.statCard}>
           <div style={styles.statIcon}>⚡</div>
           <div style={styles.statContent}>
             <span style={styles.statLabel}>Intensity</span>
             <span style={styles.statValue}>
               {activityIntensity?.currentIntensity || "N/A"}
             </span>
           </div>
         </div>
       </div>
 
       {/* Main Content */}
       <div style={styles.mainGrid}>
         {/* Activity Insights */}
         <div style={styles.card}>
           <h2 style={styles.cardTitle}>📊 Activity Insights</h2>
           {activityIntensity ? (
             <div>
               <div style={styles.insightRow}>
                 <span>Current Streak</span>
                 <span style={styles.bold}>
                   {activityIntensity?.streak?.current || 0} days
                 </span>
               </div>
               <div style={styles.insightRow}>
                 <span>Best Streak</span>
                 <span style={styles.bold}>
                   {activityIntensity?.streak?.longest || 0} days
                 </span>
               </div>
               <div style={styles.insightRow}>
                 <span>Consistency</span>
                 <span style={styles.bold}>
                   {activityIntensity?.streak?.consistency || 0}%
                 </span>
               </div>
               <div style={styles.insightRow}>
                 <span>Intensity Score</span>
                 <span style={styles.bold}>
                   {activityIntensity?.intensityScore || 0}/100
                 </span>
               </div>
             </div>
           ) : (
             <p style={styles.textMuted}>Activity data unavailable</p>
           )}
         </div>
 
         {/* User Rank */}
         {userRank && (
           <div style={styles.card}>
             <h2 style={styles.cardTitle}>🎯 Your Rank</h2>
             <div style={styles.rankBox}>
               <div style={styles.rankCircle}>
                 <span style={styles.rankNumber}>#{userRank.rank}</span>
               </div>
               <div style={styles.rankInfo}>
                 <p style={styles.rankLevel}>{userRank.level || "Silver"}</p>
                 <p style={styles.rankPoints}>{userRank.totalPoints} points</p>
               </div>
             </div>
           </div>
         )}
 
         {/* Quick Actions */}
         <div style={styles.card}>
           <h2 style={styles.cardTitle}>⚙️ Quick Actions</h2>
           <div style={styles.actionList}>
             <button
               onClick={() => navigate("/student/profile")}
               style={styles.actionButton}
             >
               👤 Edit Profile
             </button>
             <button
               onClick={() => navigate("/student/certificates")}
               style={styles.actionButton}
             >
               🏅 View Certificates
             </button>
             <button
               onClick={() => navigate("/student/problems")}
               style={styles.actionButton}
             >
               💻 Solve Problems
             </button>
           </div>
         </div>
       </div>
 
       {/* Global Leaderboard */}
       <div style={styles.card}>
         <div style={styles.cardHeader}>
           <h2 style={styles.cardTitle}>🏆 Global Leaderboard</h2>
           <button
             onClick={() => window.location.reload()}
             style={styles.refreshBtn}
           >
             🔄 Refresh
           </button>
         </div>
         <div style={styles.leaderboardTable}>
           <div style={styles.leaderboardHeader}>
             <span style={{ flex: 1 }}>Rank</span>
             <span style={{ flex: 3 }}>Student</span>
             <span style={{ flex: 2 }}>Points</span>
             <span style={{ flex: 2 }}>Level</span>
           </div>
           {leaderboard && leaderboard.length > 0 ? (
             leaderboard.map((student, idx) => (
               <div
                 key={idx}
                 style={{
                   ...styles.leaderboardRow,
                   backgroundColor:
                     student.userId === user?._id
                       ? "rgba(59, 130, 246, 0.1)"
                       : "transparent",
                   borderLeft:
                     student.userId === user?._id
                       ? "4px solid #3b82f6"
                       : "4px solid transparent"
                 }}
               >
                 <span style={{ flex: 1 }}>
                   {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx + 1}
                 </span>
                 <span style={{ flex: 3 }}>
                   {student.firstName || "User"} {idx === 0 && "👑"}
                 </span>
                 <span style={{ flex: 2, fontWeight: "bold" }}>
                   {student.totalPoints || 0}
                 </span>
                 <span style={{ flex: 2 }}>{student.level || "Bronze"}</span>
               </div>
             ))
           ) : (
             <div style={styles.emptyState}>No leaderboard data available</div>
           )}
         </div>
       </div>
 
       {/* My Recent Events */}
       {myEvents.length > 0 && (
         <div style={styles.card}>
           <div style={styles.cardHeader}>
             <h2 style={styles.cardTitle}>📅 My Recent Events</h2>
             <button
               onClick={() => navigate("/student/events")}
               style={styles.linkBtn}
             >
               View All →
             </button>
           </div>
           <div style={styles.eventsList}>
             {myEvents.map((event) => (
               <div key={event._id} style={styles.eventItem}>
                 <div style={styles.eventInfo}>
                   <h4 style={styles.eventName}>{event.name}</h4>
                   <p style={styles.eventDate}>
                     {new Date(event.startDate).toLocaleDateString()} -{" "}
                     {new Date(event.endDate).toLocaleDateString()}
                   </p>
                   <p style={styles.eventProblems}>
                     {event.problems?.length || 0} problems
                   </p>
                 </div>
                 <button
                   onClick={() => navigate(`/student/event/${event._id}`)}
                   style={styles.eventButton}
                 >
                   Open →
                 </button>
               </div>
             ))}
           </div>
         </div>
       )}
     </div>
   );
 };
 
 const styles = {
   container: {
     padding: "30px 20px",
     maxWidth: "1400px",
     margin: "0 auto",
     backgroundColor: "#f8f9fa",
     minHeight: "100vh"
   },
   header: {
     display: "flex",
     justifyContent: "space-between",
     alignItems: "center",
     marginBottom: "40px",
     backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
     padding: "30px",
     borderRadius: "12px",
     color: "white"
   },
   greeting: {
     fontSize: "28px",
     fontWeight: "700",
     marginBottom: "8px",
     color: "white"
   },
   subtext: {
     fontSize: "14px",
     opacity: 0.9
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
     backgroundColor: "white",
     color: "#667eea"
   },
   statsGrid: {
     display: "grid",
     gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
     gap: "15px",
     marginBottom: "40px"
   },
   statCard: {
     backgroundColor: "white",
     padding: "20px",
     borderRadius: "12px",
     display: "flex",
     alignItems: "center",
     gap: "15px",
     boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
     border: "1px solid #e5e7eb"
   },
   statIcon: {
     fontSize: "32px"
   },
   statContent: {
     display: "flex",
     flexDirection: "column",
     gap: "5px"
   },
   statLabel: {
     fontSize: "12px",
     color: "#6b7280",
     fontWeight: "500"
   },
   statValue: {
     fontSize: "24px",
     fontWeight: "700",
     color: "#1f2937"
   },
   mainGrid: {
     display: "grid",
     gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
     gap: "20px",
     marginBottom: "40px"
   },
   card: {
     backgroundColor: "white",
     padding: "24px",
     borderRadius: "12px",
     boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
     border: "1px solid #e5e7eb"
   },
   cardHeader: {
     display: "flex",
     justifyContent: "space-between",
     alignItems: "center",
     marginBottom: "16px"
   },
   cardTitle: {
     fontSize: "18px",
     fontWeight: "700",
     margin: "0 0 16px 0",
     color: "#1f2937"
   },
   insightRow: {
     display: "flex",
     justifyContent: "space-between",
     padding: "12px 0",
     borderBottom: "1px solid #f3f4f6"
   },
   bold: {
     fontWeight: "700",
     color: "#1f2937"
   },
   textMuted: {
     color: "#9ca3af",
     fontSize: "14px"
   },
   rankBox: {
     display: "flex",
     alignItems: "center",
     gap: "20px",
     padding: "16px",
     backgroundColor: "#f3f4f6",
     borderRadius: "8px"
   },
   rankCircle: {
     width: "80px",
     height: "80px",
     borderRadius: "50%",
     backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
     display: "flex",
     alignItems: "center",
     justifyContent: "center",
     color: "white"
   },
   rankNumber: {
     fontSize: "32px",
     fontWeight: "700"
   },
   rankInfo: {
     flex: 1
   },
   rankLevel: {
     fontSize: "18px",
     fontWeight: "600",
     margin: "0 0 4px 0",
     color: "#1f2937"
   },
   rankPoints: {
     fontSize: "14px",
     color: "#6b7280",
     margin: "0"
   },
   actionList: {
     display: "flex",
     flexDirection: "column",
     gap: "10px"
   },
   actionButton: {
     padding: "12px 16px",
     backgroundColor: "#f3f4f6",
     border: "none",
     borderRadius: "8px",
     cursor: "pointer",
     textAlign: "left",
     fontWeight: "500",
     transition: "all 0.3s",
     fontSize: "14px"
   },
   refreshBtn: {
     padding: "8px 16px",
     backgroundColor: "#f3f4f6",
     border: "none",
     borderRadius: "6px",
     cursor: "pointer",
     fontWeight: "600",
     fontSize: "13px"
   },
   linkBtn: {
     padding: "8px 16px",
     backgroundColor: "transparent",
     border: "none",
     color: "#667eea",
     cursor: "pointer",
     fontWeight: "600",
     fontSize: "13px"
   },
   leaderboardTable: {
     backgroundColor: "#f9fafb",
     borderRadius: "8px",
     overflow: "hidden"
   },
   leaderboardHeader: {
     display: "grid",
     gridTemplateColumns: "1fr 3fr 2fr 2fr",
     padding: "16px 20px",
     backgroundColor: "#f3f4f6",
     fontWeight: "700",
     fontSize: "13px",
     color: "#6b7280",
     borderBottom: "2px solid #e5e7eb"
   },
   leaderboardRow: {
     display: "grid",
     gridTemplateColumns: "1fr 3fr 2fr 2fr",
     padding: "16px 20px",
     borderBottom: "1px solid #e5e7eb",
     fontSize: "14px",
     alignItems: "center",
     transition: "background-color 0.3s"
   },
   emptyState: {
     padding: "40px 20px",
     textAlign: "center",
     color: "#9ca3af"
   },
   eventsList: {
     display: "flex",
     flexDirection: "column",
     gap: "12px"
   },
   eventItem: {
     display: "flex",
     justifyContent: "space-between",
     alignItems: "center",
     padding: "16px",
     backgroundColor: "#f9fafb",
     borderRadius: "8px",
     border: "1px solid #e5e7eb"
   },
   eventInfo: {
     flex: 1
   },
   eventName: {
     fontSize: "15px",
     fontWeight: "700",
     margin: "0 0 4px 0",
     color: "#1f2937"
   },
   eventDate: {
     fontSize: "12px",
     color: "#6b7280",
     margin: "0 0 4px 0"
   },
   eventProblems: {
     fontSize: "12px",
     color: "#667eea",
     margin: "0",
     fontWeight: "600"
   },
   eventButton: {
     padding: "8px 16px",
     backgroundColor: "#667eea",
     color: "white",
     border: "none",
     borderRadius: "6px",
     cursor: "pointer",
     fontWeight: "600",
     fontSize: "13px"
   },
   loadingCenter: {
     display: "flex",
     justifyContent: "center",
     alignItems: "center",
     height: "100vh",
     fontSize: "18px",
     color: "#6b7280"
   }
 };
 
 export default StudentDashboard;
 