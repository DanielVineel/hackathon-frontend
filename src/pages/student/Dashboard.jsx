// src/pages/student/Dashboard.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/api";
import EventCard from "../../components/common/EventCard";

const Dashboard = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch upcoming/ongoing events
    API.get("/events")
      .then(res => setEvents(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <h4>Upcoming & Ongoing Events</h4>
      <div className="d-flex flex-wrap gap-3">
        {events.map(event => (
          <EventCard key={event._id} event={event} role="student" />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;