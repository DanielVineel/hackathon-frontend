/**
 * LOADING SYSTEM USAGE GUIDE
 * 
 * This file demonstrates how to use the new modern loading system
 * with full-page loader, inline spinner, and theme support
 */

/**
 * ================================
 * 1. GLOBAL FULL-PAGE LOADER
 * ================================
 * 
 * Use this for app-wide operations like loading user data,
 * performing critical operations, page transitions, etc.
 */

import { useGlobalLoader } from '../hooks/useLoading';

export function UserDashboard() {
  const { showLoader, hideLoader, updateMessage } = useGlobalLoader();

  const loadUserData = async () => {
    // Show loader with initial message
    showLoader('Fetching user data...', 'This may take a few seconds');

    try {
      const response = await fetch('/api/user');
      
      // Update message while loading
      updateMessage('Processing data...');
      
      const data = await response.json();
      return data;
    } finally {
      // Always hide loader when done
      hideLoader();
    }
  };

  return (
    <button onClick={loadUserData}>
      Load User Data
    </button>
  );
}

/**
 * ================================
 * 2. LOCAL COMPONENT LOADER
 * ================================
 * 
 * Use this for component-specific loading states
 * Doesn't show full-page overlay, just manages local state
 */

import { useLoading } from '../hooks/useLoading';
import LoadingSpinner from '../components/common/LoadingSpinner';

export function PaymentForm() {
  const { isLoading, startLoading, stopLoading } = useLoading();

  const handleSubmit = async (formData) => {
    startLoading('Processing payment...');

    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      return await response.json();
    } finally {
      stopLoading();
    }
  };

  return (
    <form>
      {isLoading && (
        <LoadingSpinner 
          size="md"
          text="Processing..."
          variant="subtle"
        />
      )}
      <button onClick={handleSubmit}>Pay</button>
    </form>
  );
}

/**
 * ================================
 * 3. INLINE LOADING SPINNER
 * ================================
 * 
 * Display a spinner within components
 */

import LoadingSpinner from '../components/common/LoadingSpinner';

export function DataTable() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await fetch('/api/data').then(r => r.json());
        setData(result);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading data..." />;
  }

  return (
    <table>
      {/* Table content */}
    </table>
  );
}

/**
 * ================================
 * 4. SPINNER VARIANTS & SIZES
 * ================================
 */

export function SpinnerExamples() {
  return (
    <div>
      {/* Size Variants */}
      <LoadingSpinner size="sm" text="Small" />
      <LoadingSpinner size="md" text="Medium (Default)" />
      <LoadingSpinner size="lg" text="Large" />

      {/* Style Variants */}
      <LoadingSpinner variant="default" text="Default Style" />
      <LoadingSpinner variant="subtle" text="Subtle Style" />
      <LoadingSpinner variant="inline" text="Inline Style" />

      {/* Centered in container */}
      <div style={{ position: 'relative', height: '200px' }}>
        <LoadingSpinner centered text="Centered Spinner" />
      </div>

      {/* Full height container */}
      <LoadingSpinner fullHeight text="Full Height" />

      {/* Without text */}
      <LoadingSpinner size="md" />
    </div>
  );
}

/**
 * ================================
 * 5. GLOBAL LOADER WITH API CALLS
 * ================================
 * 
 * Common pattern for API operations
 */

import { useGlobalLoader } from '../hooks/useLoading';

export function EventRegistration() {
  const { showLoader, hideLoader } = useGlobalLoader();

  const registerForEvent = async (eventId) => {
    showLoader(
      'Registering for event...',
      'Please wait while we process your registration'
    );

    try {
      const response = await fetch('/api/events/register', {
        method: 'POST',
        body: JSON.stringify({ eventId })
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      return await response.json();
    } catch (error) {
      console.error(error);
      // Show error message (consider using a toast/notification system)
    } finally {
      hideLoader();
    }
  };

  return (
    <button onClick={() => registerForEvent(1)}>
      Register
    </button>
  );
}

/**
 * ================================
 * 6. FORM WITH LOCAL LOADING
 * ================================
 */

import { useLoading } from '../hooks/useLoading';
import { useFormValidation } from '../hooks';

export function SubmitAssignment() {
  const { isLoading, startLoading, stopLoading } = useLoading();
  const { values, errors, handleChange, handleSubmit } = useFormValidation({
    initialValues: { code: '', language: 'javascript' },
    onSubmit: async (values) => {
      startLoading();
      try {
        const response = await fetch('/api/submit', {
          method: 'POST',
          body: JSON.stringify(values)
        });
        return await response.json();
      } finally {
        stopLoading();
      }
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        name="code"
        value={values.code}
        onChange={handleChange}
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}

/**
 * ================================
 * 7. DARK & LIGHT THEME SUPPORT
 * ================================
 * 
 * All loading components automatically support theme switching
 * No additional setup needed!
 * 
 * Usage:
 * - Light theme: html.theme-light applied by default
 * - Dark theme: html.theme-dark applied when user toggles theme
 */

import { useTheme } from '../context/ThemeContext';

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
    </button>
  );
}

/**
 * ================================
 * 8. RESPONSIVE DESIGN
 * ================================
 * 
 * All loading components are fully responsive:
 * - Mobile (0-640px): Compact sizes
 * - Tablet (641px-1024px): Medium sizes
 * - Desktop (1025px+): Full sizes
 * 
 * CSS variables automatically adjust based on viewport
 */

/**
 * ================================
 * 9. ACCESSIBILITY
 * ================================
 * 
 * All components include:
 * - Proper ARIA labels where applicable
 * - Support for prefers-reduced-motion
 * - High contrast support
 * - Keyboard navigation support
 * - Focus indicators
 */

/**
 * ================================
 * 10. CSS VARIABLES AVAILABLE
 * ================================
 * 
 * Primary colors:
 * --primary, --primary-light, --primary-dark
 * --secondary, --secondary-light, --secondary-dark
 * 
 * Status colors:
 * --success, --warning, --danger, --info
 * 
 * Background:
 * --bg-primary, --bg-secondary, --bg-tertiary, --bg-card
 * 
 * Text:
 * --text-primary, --text-secondary, --text-tertiary, --text-muted
 * 
 * Spacing:
 * --spacing-xs (4px), --spacing-sm (8px), --spacing-md (12px),
 * --spacing-lg (16px), --spacing-xl (24px), --spacing-2xl (32px)
 * 
 * Border radius:
 * --radius-xs (2px), --radius-sm (4px), --radius-md (8px),
 * --radius-lg (12px), --radius-xl (16px), --radius-full
 * 
 * Shadows:
 * --shadow-xs, --shadow-sm, --shadow-md, --shadow-lg, --shadow-xl
 * 
 * Transitions:
 * --transition (0.3s), --transition-fast (0.15s), --transition-slow (0.5s)
 * 
 * Z-Index:
 * --z-dropdown, --z-sticky, --z-fixed, --z-modal, --z-tooltip
 * 
 * Font:
 * --font-family-sans, --font-family-mono
 * --font-size-xs to --font-size-4xl
 * --font-weight-light to --font-weight-bold
 */

/**
 * ================================
 * 11. BEST PRACTICES
 * ================================
 * 
 * 1. Always use try-finally to ensure hideLoader() is called
 * 2. Use global loader for critical operations
 * 3. Use local loader for component-specific operations
 * 4. Provide meaningful messages to users
 * 5. Keep loader messages concise and action-oriented
 * 6. Test with reduced motion preferences
 * 7. Ensure loading states are properly cleaned up
 * 8. Use loading spinners to prevent multiple submissions
 * 9. Consider using optimistic updates for better UX
 * 10. Always handle errors gracefully
 */

export const LOADING_SYSTEM_READY = true;
