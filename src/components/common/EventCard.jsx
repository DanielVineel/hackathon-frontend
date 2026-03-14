import React from "react";
import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
  return (
    <div className="border p-2" style={{ width: "250px" }}>
      <h5>{event.name}</h5>
      <p>fee : {event.fee}</p>
      <p>Prize: {event.prizeMoney}</p>
      <p>Status: {event.status}</p>
      <p>Starting Date : {event.startDate}</p>
      <p>Organized By : {event.organizedBy.name}</p>
      <Link to={`/${role}/events/${event._id}`} className="btn btn-sm btn-primary">View</Link>
    </div>
  );
};

export default EventCard;