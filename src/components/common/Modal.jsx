/**
 * Modal Component
 * Reusable modal dialog with customizable content
 */

import React from 'react';
import './Modal.css';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  actions = [],
  size = 'md',
  closeButton = true
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className={`modal modal-${size}`}>
        {title && (
          <div className="modal-header">
            <h2>{title}</h2>
            {closeButton && (
              <button className="modal-close-btn" onClick={onClose}>
                ✕
              </button>
            )}
          </div>
        )}

        <div className="modal-body">{children}</div>

        {actions.length > 0 && (
          <div className="modal-footer">
            {actions.map((action, idx) => (
              <button
                key={idx}
                className={`btn ${action.className || 'btn-primary'}`}
                onClick={action.onClick}
                disabled={action.disabled}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Modal;
