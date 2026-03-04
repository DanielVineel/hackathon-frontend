// src/pages/manager/Dashboard.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/api";

const Dashboard = () => {
  const [stats, setStats] = useState({ events: 0, participants: 0, problems: 0 });

  useEffect(() => {
    API.get("/manager/dashboard-stats")
      .then(res => setStats(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h2>Manager Dashboard</h2>
      <div className="d-flex gap-3 mt-3">
        <div className="p-3 border">Events Created: {stats.events}</div>
        <div className="p-3 border">Participants: {stats.participants}</div>
        <div className="p-3 border">Problems Added: {stats.problems}</div>
      </div>
    </div>
  );
};

export default Dashboard;