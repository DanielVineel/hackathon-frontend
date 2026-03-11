import React from "react";
import { Link } from "react-router-dom";

const EventCard = ({ event, role }) => {
  return (
    <div className="border p-2" style={{ width: "250px" }}>
      <h5>{event.name}</h5>
      <p>{event.description}</p>
      <p>Prize: {event.prizeMoney}</p>
      <p>Status: {event.status}</p>
      <Link to={`/${role}/events/${event._id}`} className="btn btn-sm btn-primary">View</Link>
    </div>
  );
};

export default EventCard;