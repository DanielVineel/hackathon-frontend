// src/pages/manager/Events.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/api";

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    API.get("/manager/events")
      .then(res => setEvents(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleCancel = (eventId) => {
    API.put(`/manager/events/${eventId}/cancel`)
      .then(() => setEvents(events.map(e => e._id === eventId ? {...e, status: 'Cancelled'} : e)))
      .catch(err => console.log(err));
  };

  return (
    <div>
      <h2>My Events</h2>
      {events.map(e => (
        <div key={e._id} className="border p-2 mb-2">
          <h5>{e.name}</h5>
          <p>{e.description}</p>
          <p>Status: {e.status}</p>
          {e.status !== "Cancelled" && <button className="btn btn-danger btn-sm" onClick={() => handleCancel(e._id)}>Cancel Event</button>}
        </div>
      ))}
    </div>
  );
};

export default Events;