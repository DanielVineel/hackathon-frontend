import React, { useState } from "react";
import Modal from "../../../components/common/Modal";
import API from "../../../api/api";

const CreateProblem = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "easy",
    score: 100,
    reusableInEvent: false
  });

  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      await API.post("/manager/problem/create", formData);
      alert("Problem created successfully!");
      setFormData({
        title: "",
        description: "",
        difficulty: "easy",
        score: 100,
        reusableInEvent: false
      });
      onClose();
      onSuccess();
    } catch (err) {
      alert("Error creating problem: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Problem"
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
            {loading ? "Creating..." : "Create Problem"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateProblem;
