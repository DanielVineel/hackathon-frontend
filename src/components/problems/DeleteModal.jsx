import React from "react";

const DeleteModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-content modal-small"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Delete Problem?</h2>
        <p>This action cannot be undone.</p>

        <div className="modal-actions">
          <button className="btn-danger" onClick={onConfirm}>
            Yes, Delete
          </button>
          <button className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;