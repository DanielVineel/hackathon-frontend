/**
 * LoadingSpinner Component
 * Reusable inline loading indicator with modern design
 * Supports multiple sizes and theme switching
 */

import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  size = 'md', 
  text = '',
  variant = 'default',
  centered = false,
  fullHeight = false
}) => {
  const classes = [
    'loading-spinner',
    `loading-${size}`,
    `loading-${variant}`,
    centered && 'loading-centered',
    fullHeight && 'loading-full-height'
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <div className="spinner-container">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-dot"></div>
      </div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
