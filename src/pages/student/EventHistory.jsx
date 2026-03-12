import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { getToken } from "../../utils/auth";

const EventHistory = () => {
  const [history, setHistory] = useState([]);
  const token=getToken();

  useEffect(() => {
    API.get("/student/events/history", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => setHistory(res.data.history))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h2>Event Participation History</h2>
      {history.map(h => <div key={h._id} className="border p-2 mb-2">{h.eventName} - {h.status}</div>)}
    </div>
  );
};

export default EventHistory;