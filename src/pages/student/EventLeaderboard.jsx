import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/api";
import "../styles/StudentLeaderboard.css";

const EventLeaderboard = () => {
  const { eventId } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myRank, setMyRank] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [eventId]);

  const fetchLeaderboard = async () => {
    try {
      const res = await API.get(`/student/events/${eventId}/leaderboard`);
      setLeaderboard(res.data?.data || []);
      // Find current user's rank
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
      <h1>Event Leaderboard</h1>

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
              <th>Score</th>
              <th>Problems Solved</th>
              <th>Time</th>
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
                <td className="score">{entry.score}</td>
                <td>{entry.problemsSolved}</td>
                <td>{entry.time}</td>
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

export default EventLeaderboard;
