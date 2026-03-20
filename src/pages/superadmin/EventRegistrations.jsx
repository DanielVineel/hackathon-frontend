import React, { useEffect, useState } from "react";
// import {
//   getEventRegistrations,
//   updateEventRegistration,
// } from "../../services/api";

const EventRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    status: "",
    score: "",
  });

  // Fetch registrations
  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const res = await getEventRegistrations();
      setRegistrations(res.data || []);
    } catch (err) {
      console.error("Error fetching registrations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  // Handle edit click
  const handleEdit = (reg) => {
    setEditId(reg._id);
    setEditData({
      status: reg.status || "",
      score: reg.score || "",
    });
  };

  // Handle change
  const handleChange = (e) => {
    setEditData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Save update
  const handleUpdate = async (id) => {
    try {
      await updateEventRegistration(id, editData);
      setEditId(null);
      fetchRegistrations();
    } catch (err) {
      console.error("Error updating registration", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Event Registrations</h2>

      <div className="card p-3 mt-3">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Student</th>
                <th>Event</th>
                <th>Status</th>
                <th>Score</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    No registrations found
                  </td>
                </tr>
              ) : (
                registrations.map((reg, index) => (
                  <tr key={reg._id}>
                    <td>{index + 1}</td>
                    <td>{reg.student?.name || "N/A"}</td>
                    <td>{reg.event?.name || "N/A"}</td>

                    {/* Editable Fields */}
                    <td>
                      {editId === reg._id ? (
                        <select
                          name="status"
                          className="form-control"
                          value={editData.status}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="disqualified">Disqualified</option>
                        </select>
                      ) : (
                        reg.status
                      )}
                    </td>

                    <td>
                      {editId === reg._id ? (
                        <input
                          type="number"
                          name="score"
                          className="form-control"
                          value={editData.score}
                          onChange={handleChange}
                        />
                      ) : (
                        reg.score || "-"
                      )}
                    </td>

                    {/* Actions */}
                    <td>
                      {editId === reg._id ? (
                        <>
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() => handleUpdate(reg._id)}
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
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleEdit(reg)}
                        >
                          Edit
                        </button>
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

export default EventRegistrations;