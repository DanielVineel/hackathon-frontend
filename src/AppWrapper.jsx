/**
 * AppWrapper Component
 * Wraps the entire app and shows FullPageLoader globally
 * Connects LoadingContext to FullPageLoader display
 */

import React, { useContext } from 'react';
import { LoadingContext } from './context/LoadingContext';
import FullPageLoader from './components/common/FullPageLoader';

const AppWrapper = ({ children }) => {
  const loadingContext = useContext(LoadingContext);

  return (
    <>
      {/* Main app content */}
      {children}

      {/* Global loader overlay */}
      {loadingContext && (
        <FullPageLoader
          isVisible={loadingContext.isVisible}
          message={loadingContext.message}
          subMessage={loadingContext.subMessage}
          showDots={loadingContext.showDots}
        />
      )}
    </>
  );
};

export default AppWrapper;
