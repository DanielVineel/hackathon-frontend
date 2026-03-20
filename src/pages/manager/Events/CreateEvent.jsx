import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../api/api";
import "../../styles/ManagerEvents.css";

const CreateEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEditing] = useState(!!id);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    maxParticipants: "",
    prize: "",
  });

  useEffect(() => {
    if (isEditing) {
      fetchEvent();
    }
  }, [id, isEditing]);

  const fetchEvent = async () => {
    try {
      const res = await API.get(`/manager/events/${id}`);
      setFormData(res.data?.data);
      setError(null);
    } catch (err) {
      setError("Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await API.put(`/manager/events/${id}`, formData);
        alert("Event updated successfully!");
      } else {
        await API.post("/manager/events", formData);
        alert("Event created successfully!");
      }
      navigate("/manager/events");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save event");
    }
  };

  if (loading)
    return <div className="manager-events loading">Loading...</div>;

  return (
    <div className="manager-events form-page">
      <div className="form-header">
        <h1>{isEditing ? "Edit Event" : "Create Event"}</h1>
        <button
          className="btn-cancel"
          onClick={() => navigate("/manager/events")}
        >
          ← Back
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-group">
          <label>Event Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Start Date *</label>
            <input
              type="datetime-local"
              name="startDate"
              value={formData.startDate?.slice(0, 16)}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>End Date *</label>
            <input
              type="datetime-local"
              name="endDate"
              value={formData.endDate?.slice(0, 16)}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Max Participants</label>
            <input
              type="number"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              min="1"
            />
          </div>
          <div className="form-group">
            <label>Prize</label>
            <input
              type="text"
              name="prize"
              value={formData.prize}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit">
            {isEditing ? "Update Event" : "Create Event"}
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/manager/events")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
