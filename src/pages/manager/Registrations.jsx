import React, { useState, useEffect } from "react";
import API from "../../api/api";
import "../styles/ManagerRegistrations.css";

const ManagerRegistrations = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchRegistrations();
    }
  }, [selectedEvent]);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/manager/events");
      const events = res.data?.data || [];
      setEvents(events);
      if (events.length > 0) {
        setSelectedEvent(events[0]._id);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const res = await API.get(`/manager/events/${selectedEvent}/registrations`);
      setRegistrations(res.data?.data || []);
    } catch (err) {
      console.error("Error:", err);
      setRegistrations([]);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="manager-registrations">
      <h1>Event Registrations</h1>

      <div className="controls">
        <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)}>
          <option value="">Select Event</option>
          {events.map((e) => (
            <option key={e._id} value={e._id}>
              {e.name} - {registrations.length} registered
            </option>
          ))}
        </select>
      </div>

      {registrations.length > 0 ? (
        <table className="registrations-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Student Name</th>
              <th>Email</th>
              <th>School/College</th>
              <th>Registration Date</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((reg, index) => (
              <tr key={reg._id}>
                <td>{index + 1}</td>
                <td>
                  {reg.studentId?.firstName} {reg.studentId?.lastName}
                </td>
                <td>{reg.studentId?.email}</td>
                <td>{reg.studentId?.schoolCollege}</td>
                <td>{new Date(reg.registeredAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty">No registrations yet</div>
      )}
    </div>
  );
};

export default ManagerRegistrations;
