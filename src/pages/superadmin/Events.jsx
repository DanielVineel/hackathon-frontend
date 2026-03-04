// src/pages/superadmin/Events.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/api";

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    API.get("/superadmin/events")
      .then(res=>setEvents(res.data))
      .catch(err=>console.log(err));
  }, []);

  return (
    <div>
      <h2>All Events</h2>
      {events.map(e=>(
        <div key={e._id} className="border p-2 mb-2">
          <h5>{e.name}</h5>
          <p>Organized By: {e.organizedBy}</p>
          <p>Status: {e.status}</p>
        </div>
      ))}
    </div>
  );
};

export default Events;