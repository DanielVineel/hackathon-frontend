import React, { useEffect, useState } from "react";
// import {
//   managerEventHistory,
//   managerUpdateEvent,
//   managerCancelEvent,
// } from "../../services/api";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch my events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await managerEventHistory();
      setEvents(res.data || []);
    } catch (err) {
      console.error("Error fetching my events", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Edit click
  const handleEdit = (event) => {
    setEditId(event._id);
    setEditData({
      name: event.name,
      status: event.status,
    });
  };

  // Handle change
  const handleChange = (e) => {
    setEditData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Update
  const handleUpdate = async (id) => {
    try {
      await managerUpdateEvent(id, editData);
      setEditId(null);
      fetchEvents();
    } catch (err) {
      console.error("Error updating event", err);
    }
  };

  // Cancel event
  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this event?")) return;

    try {
      await managerCancelEvent(id);
      fetchEvents();
    } catch (err) {
      console.error("Error canceling event", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>My Events</h2>

      <div className="card p-3 mt-3">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Event Name</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    No events found
                  </td>
                </tr>
              ) : (
                events.map((e, index) => (
                  <tr key={e._id}>
                    <td>{index + 1}</td>

                    {/* Name */}
                    <td>
                      {editId === e._id ? (
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          value={editData.name}
                          onChange={handleChange}
                        />
                      ) : (
                        e.name
                      )}
                    </td>

                    {/* Status */}
                    <td>
                      {editId === e._id ? (
                        <select
                          name="status"
                          className="form-control"
                          value={editData.status}
                          onChange={handleChange}
                        >
                          <option value="upcoming">Upcoming</option>
                          <option value="ongoing">Ongoing</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      ) : (
                        e.status
                      )}
                    </td>

                    <td>
                      {new Date(e.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td>
                      {editId === e._id ? (
                        <>
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() => handleUpdate(e._id)}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setEditId(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => handleEdit(e)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-dark btn-sm"
                            onClick={() => handleCancel(e._id)}
                          >
                            Cancel Event
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MyEvents;