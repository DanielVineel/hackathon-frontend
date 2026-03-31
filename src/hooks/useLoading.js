/**
 * useLoading Custom Hook
 * Manages local and global loading states
 * Provides easy interface for showing/hiding loaders
 */

import { useState, useCallback, useContext } from 'react';
import { LoadingContext } from '../context/LoadingContext';

/**
 * Local loading state hook
 * Use this for component-level loading states
 */
export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);

  const startLoading = useCallback((message = '', subMessage = '') => {
    setIsLoading({
      active: true,
      message,
      subMessage
    });
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  return {
    isLoading: isLoading.active || false,
    message: isLoading.message || '',
    subMessage: isLoading.subMessage || '',
    startLoading,
    stopLoading,
    setIsLoading
  };
};

/**
 * Global loading hook
 * Use this to access and control full-page loader from anywhere
 */
export const useGlobalLoader = () => {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error('useGlobalLoader must be used within LoadingProvider');
  }

  return context;
};

/**
 * Combined loader hook
 * Automatically switches between local and global based on context availability
 */
export const useLoader = (initialState = false) => {
  const localLoader = useLoading(initialState);

  try {
    const globalLoader = useGlobalLoader();
    return {
      ...localLoader,
      global: globalLoader
    };
  } catch {
    // Context not available, return local loader only
    return {
      ...localLoader,
      global: null
    };
  }
};

export default useLoading;
