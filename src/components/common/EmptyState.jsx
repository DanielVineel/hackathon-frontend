/**
 * EmptyState Component
 * Display when no data is available
 */

import React from 'react';
import './EmptyState.css';

const EmptyState = ({
  icon = '📭',
  title = 'No Data',
  description = 'There is nothing to display',
  action = null
}) => {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action && (
        <button className="btn btn-primary" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
