/**
 * LoadingContext
 * Global loading state context for app-wide loader management
 * Allows showing full-page loader from any component
 */

import React, { createContext, useState, useCallback } from 'react';

export const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState({
    isVisible: false,
    message: 'Loading...',
    subMessage: '',
    showDots: true
  });

  // Show full-page loader
  const showLoader = useCallback((message = 'Loading...', subMessage = '', showDots = true) => {
    setLoading({
      isVisible: true,
      message,
      subMessage,
      showDots
    });
  }, []);

  // Hide full-page loader
  const hideLoader = useCallback(() => {
    setLoading(prev => ({
      ...prev,
      isVisible: false
    }));
  }, []);

  // Update message while loader is visible
  const updateMessage = useCallback((message) => {
    setLoading(prev => ({
      ...prev,
      message
    }));
  }, []);

  // Update sub-message while loader is visible
  const updateSubMessage = useCallback((subMessage) => {
    setLoading(prev => ({
      ...prev,
      subMessage
    }));
  }, []);

  // Toggle loader visibility
  const toggleLoader = useCallback((message) => {
    setLoading(prev => ({
      ...prev,
      isVisible: !prev.isVisible,
      message: message || prev.message
    }));
  }, []);

  // Reset to default state
  const reset = useCallback(() => {
    setLoading({
      isVisible: false,
      message: 'Loading...',
      subMessage: '',
      showDots: true
    });
  }, []);

  const value = {
    ...loading,
    showLoader,
    hideLoader,
    updateMessage,
    updateSubMessage,
    toggleLoader,
    reset
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingContext;
