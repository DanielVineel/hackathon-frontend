/**
 * TimerComponent
 * Displays a countdown timer with visual feedback and warnings
 * Props:
 * - timeLeft: remaining time in seconds
 * - formatTime: formatted time object
 * - isRunning: boolean
 * - onPause: callback when pausing
 * - onResume: callback when resuming
 * - showWarning: show warnings at certain thresholds
 */

import React from 'react';
import './TimerComponent.css';

const TimerComponent = ({
  timeLeft,
  formatTime,
  isRunning,
  onPause,
  onResume,
  showWarning = true,
  showControls = false
}) => {
  const isWarning = timeLeft <= 300; // 5 minutes
  const isCritical = timeLeft <= 60; // 1 minute

  return (
    <div className={`timer-component ${isCritical ? 'timer-critical' : isWarning ? 'timer-warning' : ''}`}>
      <div className="timer-display">
        <div className="timer-icon">⏱️</div>
        <div className="timer-time">{formatTime.formatted}</div>
      </div>

      {showWarning && isWarning && (
        <div className={`timer-alert ${isCritical ? 'alert-critical' : 'alert-warning'}`}>
          {isCritical ? '⚠️ Time Critical!' : '⏰ Time Running Out!'}
        </div>
      )}

      {showControls && (
        <div className="timer-controls">
          {isRunning ? (
            <button className="btn btn-sm btn-secondary" onClick={onPause}>
              ⏸ Pause
            </button>
          ) : (
            <button className="btn btn-sm btn-primary" onClick={onResume}>
              ▶ Resume
            </button>
          )}
        </div>
      )}

      <div className="timer-progress">
        <div className="progress-bar" style={{
          width: `${100 - (timeLeft / formatTime.total) * 100}%`,
          backgroundColor: isCritical ? '#ff1744' : isWarning ? '#ffab40' : '#00e676'
        }} />
      </div>
    </div>
  );
};

export default TimerComponent;
