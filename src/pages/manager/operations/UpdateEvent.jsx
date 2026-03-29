import React, { useState, useEffect } from "react";
import Modal from "../../../components/common/Modal";
import API from "../../../api/api";

const UpdateEvent = ({ isOpen, event, problems, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    venue: "",
    fee: 0,
    prizeMoney: 0,
    problems: []
  });

  useEffect(() => {
    if (event && isOpen) {
      setFormData({
        title: event.title || event.name || "",
        description: event.description || "",
        startDate: event.startDate || "",
        endDate: event.endDate || "",
        venue: event.venue || "",
        fee: event.fee || 0,
        prizeMoney: event.prizeMoney || 0,
        problems: event.problems || []
      });
    }
  }, [event, isOpen]);

  const handleSelectProblems = (problemId) => {
    setFormData(prev => ({
      ...prev,
      problems: prev.problems?.includes(problemId)
        ? prev.problems.filter(id => id !== problemId)
        : [...(prev.problems || []), problemId]
    }));
  };

  const handleSave = async () => {
    if (!formData.title || !formData.startDate || !formData.endDate) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      await API.put(`/manager/event/${event._id}`, formData);
      alert("Event updated successfully!");
      onClose();
      onSuccess();
    } catch (err) {
      alert("Error updating event: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Event"
      size="large"
    >
      <div className="modal-content">
        <div className="form-group">
          <label>Event Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="form-input"
            placeholder="e.g., Winter Coding Challenge"
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="form-input"
            rows="3"
            placeholder="Event description..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Start Date *</label>
            <input
              type="datetime-local"
              value={formData.startDate ? formData.startDate.slice(0, 16) : ""}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>End Date *</label>
            <input
              type="datetime-local"
              value={formData.endDate ? formData.endDate.slice(0, 16) : ""}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Fee (₹)</label>
            <input
              type="number"
              value={formData.fee || 0}
              onChange={(e) => setFormData({ ...formData, fee: parseFloat(e.target.value) })}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Prize Money (₹)</label>
            <input
              type="number"
              value={formData.prizeMoney || 0}
              onChange={(e) => setFormData({ ...formData, prizeMoney: parseFloat(e.target.value) })}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Venue</label>
          <input
            type="text"
            value={formData.venue || ""}
            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
            className="form-input"
            placeholder="Event venue or online"
          />
        </div>

        {/* Problems Selection */}
        <div className="form-group">
          <label>Event Problems</label>
          {problems && problems.length > 0 ? (
            <div className="problems-checkbox-list">
              {problems.map(problem => (
                <div key={problem._id} className="problem-checkbox-item">
                  <input
                    type="checkbox"
                    id={`problem-${problem._id}`}
                    checked={formData.problems?.includes(problem._id)}
                    onChange={() => handleSelectProblems(problem._id)}
                  />
                  <label htmlFor={`problem-${problem._id}`} className="flex-1">
                    <div className="font-bold">{problem.title || problem.name}</div>
                    <div className="text-sm text-gray-500">
                      Difficulty: {problem.difficulty || problem.level || "Easy"} | Points: {problem.score || 100}
                    </div>
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No problems available</p>
          )}
          {formData.problems && formData.problems.length > 0 && (
            <p className="text-sm text-blue-600 mt-2">Selected: {formData.problems.length} problem(s)</p>
          )}
        </div>

        <div className="modal-actions">
          <button
            className="btn btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Event"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateEvent;
