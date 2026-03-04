import React, { useEffect, useState } from "react";
import API from "../../api/api";

const EventHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    API.get("/student/events/history")
      .then(res => setHistory(res.data))
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