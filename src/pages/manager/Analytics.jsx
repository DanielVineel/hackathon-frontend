import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { getToken } from "../../utils/auth";

const Analytics = () => {
  const [stats, setStats] = useState([]);
  const token = getToken();

  useEffect(() => {
    API.get("/manager/analytics", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => setStats(res.data))
      .catch((err) => console.log(err));
  }, [token]);

  return (
    <div>
      <h2>Analytics</h2>
      {stats.length === 0 && <p>No analytics data found</p>}
      {stats.map((s) => (
        <div key={s.eventId} className="border p-2 mb-2">
          <h5>{s.eventName}</h5>
          <p>Total Participants: {s.totalParticipants}</p>
          <p>
            Problems Solved: {s.totalTestCasesPassed}/{s.totalTestCases}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Analytics;