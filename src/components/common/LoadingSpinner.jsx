/**
 * LoadingSpinner Component
 * Reusable loading indicator
 */

import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  return (
    <div className={`loading-spinner loading-${size}`}>
      <div className="spinner" />
      {text && <p>{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
