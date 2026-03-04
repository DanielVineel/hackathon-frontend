// src/pages/superadmin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/api";

const Dashboard = () => {
  const [stats, setStats] = useState({ managers:0, students:0, events:0, problems:0 });

  useEffect(() => {
    API.get("/superadmin/dashboard-stats")
      .then(res=>setStats(res.data))
      .catch(err=>console.log(err));
  }, []);

  return (
    <div>
      <h2>Superadmin Dashboard</h2>
      <div className="d-flex gap-3 mt-3">
        <div className="p-3 border">Managers: {stats.managers}</div>
        <div className="p-3 border">Students: {stats.students}</div>
        <div className="p-3 border">Events: {stats.events}</div>
        <div className="p-3 border">Problems: {stats.problems}</div>
      </div>
    </div>
  );
};

export default Dashboard;