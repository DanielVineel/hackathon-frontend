import React, { useState, useEffect } from "react";
import Modal from "../../../components/common/Modal";
import API from "../../../api/api";

const UpdateProblem = ({ isOpen, problem, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "easy",
    score: 100,
    reusableInEvent: false
  });

  useEffect(() => {
    if (problem && isOpen) {
      setFormData({
        title: problem.title || "",
        description: problem.description || "",
        difficulty: problem.difficulty || problem.level || "easy",
        score: problem.score || 100,
        reusableInEvent: problem.reusableInEvent || false
      });
    }
  }, [problem, isOpen]);

  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      await API.put(`/manager/problem/${problem._id}`, formData);
      alert("Problem updated successfully!");
      onClose();
      onSuccess();
    } catch (err) {
      alert("Error updating problem: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Problem"
    >
      <div className="modal-content">
        <div className="form-group">
          <label>Problem Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="form-input"
            placeholder="e.g., Two Sum Problem"
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="form-input"
            rows="4"
            placeholder="Detailed problem description..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Difficulty</label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              className="form-input"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="form-group">
            <label>Score Points</label>
            <input
              type="number"
              value={formData.score}
              onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value) })}
              className="form-input"
              min="1"
            />
          </div>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={formData.reusableInEvent}
              onChange={(e) => setFormData({ ...formData, reusableInEvent: e.target.checked })}
            />
            {" "}Reusable in Events
          </label>
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
            {loading ? "Updating..." : "Update Problem"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateProblem;
