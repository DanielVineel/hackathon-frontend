/**
 * FullPageLoader Component
 * Displays full-screen loading with animations
 * Supports theme switching and responsive design
 */

import React from 'react';
import './FullPageLoader.css';

const FullPageLoader = ({ 
  isVisible = true, 
  message = 'Loading...',
  subMessage = '',
  showDots = true 
}) => {
  if (!isVisible) return null;

  return (
    <div className="full-page-loader">
      <div className="loader-content">
        {/* Animated background gradient */}
        <div className="loader-bg-gradient"></div>

        {/* Main loader container */}
        <div className="loader-container">
          {/* Animated spinner */}
          <div className="loader-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-dot"></div>
          </div>

          {/* Loading text with animated dots */}
          <div className="loader-text-section">
            <h2 className="loader-text">
              {message}
              {showDots && <span className="animated-dots">.</span>}
            </h2>
            
            {subMessage && (
              <p className="loader-subtext">{subMessage}</p>
            )}
          </div>

          {/* Progress bar */}
          <div className="loader-progress-bar">
            <div className="loader-progress-fill"></div>
          </div>
        </div>

        {/* Floating particles */}
        <div className="loader-particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
      </div>
    </div>
  );
};

export default FullPageLoader;
