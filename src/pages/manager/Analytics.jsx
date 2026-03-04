// src/pages/manager/Analytics.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/api";

const Analytics = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    API.get("/manager/analytics")
      .then(res => setStats(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h2>Analytics</h2>
      {stats.map(s => (
        <div key={s.eventId} className="border p-2 mb-2">
          <h5>{s.eventName}</h5>
          <p>Total Participants: {s.totalParticipants}</p>
          <p>Problems Solved: {s.totalTestCasesPassed}/{s.totalTestCases}</p>
        </div>
      ))}
    </div>
  );
};

export default Analytics;