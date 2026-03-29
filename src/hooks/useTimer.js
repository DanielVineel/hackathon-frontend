/**
 * Custom Hook: useTimer
 * Provides countdown timer functionality for problems and events
 * Features: pause, resume, reset, auto-callback on timeout
 */

import { useState, useEffect, useCallback } from 'react';

export const useTimer = (initialSeconds, onTimeUp = null) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [totalTime] = useState(initialSeconds);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) {
      if (timeLeft <= 0 && onTimeUp) {
        onTimeUp();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          if (onTimeUp) onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, onTimeUp]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resume = useCallback(() => {
    if (timeLeft > 0) {
      setIsRunning(true);
    }
  }, [timeLeft]);

  const reset = useCallback(() => {
    setTimeLeft(initialSeconds);
    setIsRunning(true);
  }, [initialSeconds]);

  const extendTime = useCallback((additionalSeconds) => {
    setTimeLeft(prev => prev + additionalSeconds);
  }, []);

  const formatTime = useCallback(() => {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    return {
      formatted: `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
      hours,
      minutes,
      seconds,
      total: timeLeft
    };
  }, [timeLeft]);

  const getProgress = useCallback(() => {
    return ((totalTime - timeLeft) / totalTime) * 100;
  }, [timeLeft, totalTime]);

  const isTimeRunningOut = timeLeft <= 300; // 5 minutes warning
  const isCritical = timeLeft <= 60; // 1 minute critical

  return {
    timeLeft,
    formatTime: formatTime(),
    isRunning,
    pause,
    resume,
    reset,
    extendTime,
    getProgress: getProgress(),
    isTimeRunningOut,
    isCritical,
    totalTime
  };
};

export default useTimer;
