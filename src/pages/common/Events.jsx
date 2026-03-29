import { useEffect, useState } from "react";
import API from "../../api/api";
import { getToken } from "../../utils/auth";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState("all");
  const token = getToken();

  const fetchEvents = async (selectedStatus) => {
    const data={"status":status}
    try {
      const res=await API.get("/events", {params: data})

      setEvents(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEvents(status);
  }, [status, token]);

  return (
    <div>
      <h2>Events</h2>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => setStatus("all")}>All</button>
        <button onClick={() => setStatus("upcoming")}>Upcoming</button>
        <button onClick={() => setStatus("ongoing")}>Ongoing</button>
        <button onClick={() => setStatus("completed")}>Completed</button>
        <button onClick={() => setStatus("canceled")}>Canceled</button>
      </div>

      <hr />

      {/* Events List */}
      <div>
        {events.length === 0 && <p>No events found</p>}

        {events.map((event) => (
          <div
            key={event._id}
            style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}
          >
            <h3>{event.title}</h3>
            <p>Status: {event.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;