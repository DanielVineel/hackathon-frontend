// src/pages/manager/Dashboard.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { getToken } from "../../utils/auth";

const Dashboard = () => {
  const [stats, setStats] = useState({ events: 0, participants: 0, problems: 0 });
  const token=getToken();
  useEffect(() => {
    API.get("/manager/dashboard-stats", {
      headers: {
        Authorization: `Bearer ${token}`
      }
  })
      .then(res => setStats(res.data.stats))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h2>Manager Dashboard</h2>
      <div className="d-flex gap-3 mt-3">
        <div className="p-3 border">Events Created: {stats.totalEvents}</div>
        <div className="p-3 border">Participants: {stats.totalParticipants}</div>
        <div className="p-3 border">Problems Added: {stats.totalProblems}</div>
      </div>
    </div>
  );
};

export default Dashboard;