import React, { useState, useEffect } from "react";
import API from "../../api/api";

const GlobalLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myRank, setMyRank] = useState(null);
  const [filterPeriod, setFilterPeriod] = useState("all");

  useEffect(() => {
    fetchLeaderboard();
  }, [filterPeriod]);

  const fetchLeaderboard = async () => {
    try {
      const res = await API.get(`/points/leaderboard`, { params: { timeframe: filterPeriod } });
      setLeaderboard(res.data?.data || []);
      const userRank = res.data?.data?.findIndex((entry) => entry.isCurrentUser);
      if (userRank >= 0) {
        setMyRank(userRank + 1);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading leaderboard...</div>;

  return (
    <div className="student-leaderboard">
      <h1>Global Leaderboard</h1>

      <div className="filters">
        <select value={filterPeriod} onChange={(e) => setFilterPeriod(e.target.value)}>
          <option value="all">All Time</option>
          <option value="month">This Month</option>
          <option value="week">This Week</option>
        </select>
      </div>

      {myRank && (
        <div className="my-rank">
          <p>Your Rank: <strong>#{myRank}</strong></p>
        </div>
      )}

      {leaderboard.length > 0 ? (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Student</th>
              <th>Total Score</th>
              <th>Problems Solved</th>
              <th>Events</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={entry.studentId} className={entry.isCurrentUser ? "current-user" : ""}>
                <td className="rank">
                  {index === 0 && "🥇"}
                  {index === 1 && "🥈"}
                  {index === 2 && "🥉"}
                  {index > 2 && `${index + 1}.`}
                </td>
                <td>{entry.studentName} {entry.isCurrentUser && "(You)"}</td>
                <td className="score">{entry.totalScore}</td>
                <td>{entry.totalProblemsSolved}</td>
                <td>{entry.eventsParticipated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty">No data available</div>
      )}
    </div>
  );
};

export default GlobalLeaderboard;
