// src/pages/student/Events.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/api";
import EventCard from "../../components/common/EventCard";

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    API.get("/events")
      .then(res => setEvents(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h2>All Events</h2>
      <div className="d-flex flex-wrap gap-3">
        {events.map(event => (
          <EventCard key={event._id} event={event} role="student" />
        ))}
      </div>
    </div>
  );
};

export default Events;