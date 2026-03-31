import React, { useState, useEffect } from "react";
import API from "../../api/api";
import "../styles/manager/Leaderboard.css";

const ManagerLeaderboard = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchLeaderboard();
    }
  }, [selectedEvent]);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/manager/events");
      const events = res.data?.data || [];
      setEvents(events);
      if (events.length > 0) {
        setSelectedEvent(events[0]._id);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await API.get(`/manager/leaderboard/${selectedEvent}`);
      setLeaderboard(res.data?.data || []);
    } catch (err) {
      console.error("Error:", err);
      setLeaderboard([]);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="manager-leaderboard">
      <h1>Event Leaderboard</h1>

      <div className="leaderboard-controls">
        <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)}>
          <option value="">Select Event</option>
          {events.map((e) => (
            <option key={e._id} value={e._id}>
              {e.name}
            </option>
          ))}
        </select>
      </div>

      {leaderboard.length > 0 ? (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Student</th>
              <th>Score</th>
              <th>Problems Solved</th>
              <th>Submissions</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={entry.studentId} className={index === 0 ? "top" : ""}>
                <td className="rank">
                  {index === 0 && "🥇"}
                  {index === 1 && "🥈"}
                  {index === 2 && "🥉"}
                  {index > 2 && `${index + 1}.`}
                </td>
                <td>{entry.studentName}</td>
                <td className="score">{entry.score}</td>
                <td>{entry.problemsSolved}</td>
                <td>{entry.submissions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty">No leaderboard data available</div>
      )}
    </div>
  );
};

export default ManagerLeaderboard;
