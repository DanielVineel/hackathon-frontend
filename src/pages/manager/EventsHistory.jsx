import { useEffect, useState } from "react";
import API from "../../api/api";
import { getToken } from "../../utils/auth";

const EventsHistory = () => {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState("all");
  const token = getToken();

  const fetchEvents = async (selectedStatus) => {
    try {
      let url = "/events";
      if (selectedStatus !== "all") url += `?status=${selectedStatus}`;

      const res = await API.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

      {/* Status Tabs - 5 options */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <button onClick={() => setStatus("all")}>All</button>
        <button onClick={() => setStatus("upcoming")}>Upcoming</button>
        <button onClick={() => setStatus("ongoing")}>Ongoing</button>
        <button onClick={() => setStatus("completed")}>Completed</button>
        <button onClick={() => setStatus("cancelled")}>Cancelled</button>
      </div>

      {events.length === 0 && <p>No events found</p>}

      {events.map((e) => (
        <div key={e._id} className="border p-2 mb-2">
          <h5>{e.name}</h5>
          <p>{e.description}</p>
          <p>Status: {e.status}</p>
        </div>
      ))}
    </div>
  );
};

export default EventsHistory;