import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";
import { getToken } from "../../utils/auth";

const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const token = getToken();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await API.getEventDetails(eventId);
        setEvent(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchEvent();
  }, [eventId, token]);

  if (!event) return <p>Loading...</p>;

  return (
    <div>
      <h2>{event.title}</h2>
      <p><b>Status:</b> {event.status}</p>
      <p><b>Description:</b> {event.description}</p>
      <p><b>Start Date:</b> {new Date(event.startDate).toLocaleString()}</p>
      <p><b>End Date:</b> {new Date(event.endDate).toLocaleString()}</p>
      <hr />

      {event.status === "upcoming" && <button>Register Now</button>}
      {event.status === "ongoing" && <button>Start Event</button>}
      {event.status === "completed" && <button>View Leaderboard</button>}
      {event.status === "canceled" && (
        <p style={{ color: "red" }}>This event has been cancelled</p>
      )}
    </div>
  );
};

export default EventDetails;