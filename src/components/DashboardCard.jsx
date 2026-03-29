import React from 'react';
// import '../../styles/DashboardCard.css';

/**
 * Generic Card Component - Base wrapper for all card types
 */
export const Card = ({ children, className = '', onClick, style }) => {
  return (
    <div className={`card ${className}`} onClick={onClick} style={style}>
      {children}
    </div>
  );
};

/**
 * Stat Card Component - Shows key statistics
 * @param {string} icon - Emoji or icon
 * @param {string} title - Card title
 * @param {string|number} value - Main value to display
 * @param {string} subtitle - Optional subtitle/description
 * @param {string} color - Color variant (primary, success, warning, danger, info)
 */
export const StatCard = ({
  icon,
  title,
  value,
  subtitle,
  color = 'primary',
  onClick,
  style
}) => {
  return (
    <div
      className={`stat-card stat-card--${color}`}
      onClick={onClick}
      style={style}
    >
      {icon && <div className="stat-card__icon">{icon}</div>}
      <div className="stat-card__content">
        <p className="stat-card__title">{title}</p>
        <p className="stat-card__value">{value}</p>
        {subtitle && <p className="stat-card__subtitle">{subtitle}</p>}
      </div>
    </div>
  );
};

/**
 * Progress Card Component - Shows progress bars
 * @param {string} title - Card title
 * @param {number} progress - Progress percentage (0-100)
 * @param {string} color - Color variant
 * @param {string} label - Optional label to show
 * @param {string} unit - Unit of measurement
 */
export const ProgressCard = ({
  title,
  progress = 0,
  color = 'primary',
  label,
  unit = '%',
  icon = '📊'
}) => {
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`progress-card progress-card--${color}`}>
      <div className="progress-card__header">
        {icon && <span className="progress-card__icon">{icon}</span>}
        <h4 className="progress-card__title">{title}</h4>
      </div>
      <div className="progress-card__bar-wrapper">
        <div className="progress-bar">
          <div
            className={`progress-bar__fill progress-bar__fill--${color}`}
            style={{ width: `${normalizedProgress}%` }}
          ></div>
        </div>
        {label && <span className="progress-card__label">{label}{unit}</span>}
      </div>
    </div>
  );
};



/**
 * Badge Component - Shows badge/status
 * @param {string} status - Status type (success, warning, danger, info, default)
 * @param {string|number} children - Badge content
 * @param {string} icon - Optional icon
 * @param {string} size - Badge size (sm, md, lg)
 */
export const Badge = ({ status = 'default', children, icon, size = 'md' }) => {
  const statusMap = {
    success: { bg: '#10B981', text: '#fff' },
    warning: { bg: '#F59E0B', text: '#fff' },
    danger: { bg: '#EF4444', text: '#fff' },
    info: { bg: '#3B82F6', text: '#fff' },
    default: { bg: '#6B7280', text: '#fff' }
  };
 
  const colors = statusMap[status] || statusMap.default;
 
  return (
    <span
      className={`badge badge--${status} badge--${size}`}
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {icon && <span className="badge__icon">{icon}</span>}
      {children}
    </span>
  );
};
 
/**
 * Badge Card Component - Shows badge/status (alias for Badge)
 * @deprecated Use Badge instead
 */
export const BadgeCard = Badge;



/**
 * Chart Card Component - Container for charts/lists
 * @param {string} title - Card title
 * @param {string} subtitle - Optional subtitle
 * @param {ReactNode} children - Content
 */
export const ChartCard = ({ title, subtitle, children, action }) => {
  return (
    <Card className="chart-card">
      <div className="chart-card__header">
        <div>
          <h3 className="chart-card__title">{title}</h3>
          {subtitle && <p className="chart-card__subtitle">{subtitle}</p>}
        </div>
        {action && <div className="chart-card__action">{action}</div>}
      </div>
      <div className="chart-card__content">
        {children}
      </div>
    </Card>
  );
};

/**
 * Info Card Component - Information display
 * @param {string} icon - Icon/emoji
 * @param {string} title - Title
 * @param {string} description - Description
 * @param {string} color - Color variant
 */
export const InfoCard = ({ icon, title, description, color = 'info' }) => {
  return (
    <Card className={`info-card info-card--${color}`}>
      {icon && <div className="info-card__icon">{icon}</div>}
      <div className="info-card__content">
        <h4 className="info-card__title">{title}</h4>
        <p className="info-card__description">{description}</p>
      </div>
    </Card>
  );
};

/**
 * Action Card Component - Card with action button
 * @param {string} title - Card title
 * @param {string} description - Description
 * @param {string} buttonText - Button text
 * @param {function} onAction - Button click handler
 * @param {string} icon - Icon/emoji
 */
export const ActionCard = ({
  title,
  description,
  buttonText = 'Action',
  onAction,
  icon,
  variant = 'primary'
}) => {
  return (
    <Card className={`action-card action-card--${variant}`}>
      {icon && <div className="action-card__icon">{icon}</div>}
      <h4 className="action-card__title">{title}</h4>
      {description && <p className="action-card__description">{description}</p>}
      <button
        className={`btn btn-${variant}`}
        onClick={onAction}
      >
        {buttonText}
      </button>
    </Card>
  );
};

/**
 * List Item Card Component - For lists of items
 * @param {string} title - Item title
 * @param {string} subtitle - Item subtitle
 * @param {string} icon - Icon
 * @param {ReactNode} action - Action element
 * @param {boolean} active - Is item active
 */
export const ListItemCard = ({
  title,
  subtitle,
  icon,
  action,
  active = false,
  onClick
}) => {
  return (
    <div
      className={`list-item list-item${active ? ' list-item--active' : ''}`}
      onClick={onClick}
    >
      {icon && <div className="list-item__icon">{icon}</div>}
      <div className="list-item__content">
        <h5 className="list-item__title">{title}</h5>
        {subtitle && <p className="list-item__subtitle">{subtitle}</p>}
      </div>
      {action && <div className="list-item__action">{action}</div>}
    </div>
  );
};

/**
 * Counter Card Component - Shows countable data
 * @param {string} label - Label
 * @param {number} count - Count number
 * @param {string} icon - Icon
 * @param {string} color - Color variant
 * @param {string} unit - Unit of measurement
 */
export const CounterCard = ({
  label,
  count = 0,
  icon,
  color = 'primary',
  unit = '',
  trend // 'up', 'down', or null
}) => {
  return (
    <Card className={`counter-card counter-card--${color}`}>
      {icon && <div className="counter-card__icon">{icon}</div>}
      <div className="counter-card__content">
        <p className="counter-card__label">{label}</p>
        <div className="counter-card__value-wrapper">
          <span className="counter-card__value">{count}</span>
          {unit && <span className="counter-card__unit">{unit}</span>}
          {trend && (
            <span className={`counter-card__trend counter-card__trend--${trend}`}>
              {trend === 'up' ? '↑' : '↓'}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

/**
 * Grid Layout Component - For organizing cards
 * @param {number} columns - Number of columns (2, 3, 4)
 * @param {ReactNode} children - Cards
 */
export const CardGrid = ({ columns = 3, children, gap = 20 }) => {
  return (
    <div
      className={`cards-grid cards-grid--${columns}`}
      style={{ gap: `${gap}px` }}
    >
      {children}
    </div>
  );
};

/**
 * Loading Card Component - Shows loading state
 */
export const LoadingCard = ({ message = 'Loading...' }) => {
  return (
    <Card className="loading-card">
      <div className="spinner"></div>
      <p>{message}</p>
    </Card>
  );
};

/**
 * Empty State Card Component - Shows when no data
 * @param {string} icon - Icon/emoji
 * @param {string} title - Title
 * @param {string} description - Description
 * @param {string} actionText - Action button text
 * @param {function} onAction - Action callback
 */
export const EmptyStateCard = ({
  icon = '📭',
  title = 'No Data',
  description = 'No data available',
  actionText,
  onAction
}) => {
  return (
    <Card className="empty-state-card">
      <div className="empty-state-card__icon">{icon}</div>
      <h3 className="empty-state-card__title">{title}</h3>
      <p className="empty-state-card__description">{description}</p>
      {actionText && onAction && (
        <button className="btn btn-primary" onClick={onAction}>
          {actionText}
        </button>
      )}
    </Card>
  );
};

/**
 * Error Card Component - Shows error state
 * @param {string} title - Error title
 * @param {string} message - Error message
 * @param {function} onRetry - Retry callback
 */
export const ErrorCard = ({
  title = 'Error',
  message = 'Something went wrong',
  onRetry
}) => {
  return (
    <Card className="error-card">
      <div className="error-card__icon">⚠️</div>
      <h3 className="error-card__title">{title}</h3>
      <p className="error-card__message">{message}</p>
      {onRetry && (
        <button className="btn btn-danger" onClick={onRetry}>
          Try Again
        </button>
      )}
    </Card>
  );
};

export default {
  Card,
  StatCard,
  ProgressCard,
  BadgeCard,
  ChartCard,
  InfoCard,
  ActionCard,
  ListItemCard,
  CounterCard,
  CardGrid,
  LoadingCard,
  EmptyStateCard,
  ErrorCard
};