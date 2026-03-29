/**
 * Custom Hook: useModal
 * Provides modal dialog state management
 */

import { useState, useCallback } from 'react';

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const open = useCallback((data = null) => {
    setIsOpen(true);
    setModalData(data);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setModalData(null);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return {
    isOpen,
    modalData,
    open,
    close,
    toggle
  };
};

export default useModal;
