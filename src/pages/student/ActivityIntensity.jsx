import React, { useState, useEffect } from 'react';
import API from '../../api/api';
import { Card, StatCard, ChartCard, ProgressCard, BadgeCard } from '../../components/DashboardCard';
import '../../styles/ActivityIntensityDashboard.css';

export default function ActivityIntensityDashboard() {
  const [intensity, setIntensity] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActivityData();
  }, []);

  const fetchActivityData = async () => {
    try {
      setLoading(true);
      const [intensityRes, analysisRes] = await Promise.all([
        API.get('/activity-intensity/current'),
        API.get('/activity-intensity/analysis?days=7')
      ]);

      setIntensity(intensityRes.data);
      setAnalysis(analysisRes.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch activity data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="activity-dashboard loading">Loading...</div>;
  if (error) return <div className="activity-dashboard error">{error}</div>;

  const getIntensityColor = (level) => {
    switch (level) {
      case 'low':
        return 'warning';
      case 'medium':
        return 'info';
      case 'high':
        return 'primary';
      case 'very_high':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <div className="activity-dashboard">
      <div className="activity-dashboard__header">
        <h1>Activity Intensity & Login Insights</h1>
        <p className="text-secondary">Track your platform engagement and patterns</p>
      </div>

      {/* Main Metrics */}
      <div className="cards-grid cards-grid--3">
        <StatCard
          icon="⚡"
          title="Current Intensity"
          value={intensity?.currentIntensity || 'Low'}
          color={getIntensityColor(intensity?.currentIntensity)}
          trend={Math.random() * 100 - 50}
        />
        <StatCard
          icon="📈"
          title="Intensity Score"
          value={`${intensity?.intensityScore || 0}/100`}
          subtitle="Daily average"
          color="primary"
        />
        <StatCard
          icon="🔥"
          title="Current Streak"
          value={`${intensity?.streak?.current || 0} days`}
          subtitle={`Best: ${intensity?.streak?.longest || 0} days`}
          color="success"
        />
      </div>

      {/* Consistency & Trend */}
      <div className="cards-grid cards-grid--2">
        <Card className="metric-card">
          <h3 className="metric-card__title">Consistency Score</h3>
          <div className="consistency-display">
            <div className="consistency-score">
              {intensity?.streak?.consistency || 0}%
            </div>
            <p className="consistency-label">
              {intensity?.streak?.consistency >= 80
                ? 'Excellent consistency'
                : intensity?.streak?.consistency >= 60
                ? 'Good consistency'
                : intensity?.streak?.consistency >= 40
                ? 'Fair consistency'
                : 'Build your streak'}
            </p>
          </div>
        </Card>

        <Card className="metric-card">
          <h3 className="metric-card__title">Activity Trend</h3>
          <div className="trend-display">
            <div className={`trend-indicator trend-indicator--${analysis?.trend || 'stable'}`}>
              {analysis?.trend === 'increasing'
                ? '📈 Rising'
                : analysis?.trend === 'decreasing'
                ? '📉 Declining'
                : '→ Stable'}
            </div>
            <p className="trend-description">
              {analysis?.trend === 'increasing'
                ? 'You\'re becoming more active'
                : analysis?.trend === 'decreasing'
                ? 'Activity has decreased recently'
                : 'Your activity is consistent'}
            </p>
          </div>
        </Card>
      </div>

      {/* Login Stats */}
      <ChartCard
        title="Login Statistics"
        subtitle="Last 7 days activity"
      >
        <div className="login-stats">
          <div className="stat-grid">
            <div className="stat-item">
              <span className="stat-item__label">Total Logins</span>
              <span className="stat-item__value">
                {analysis?.loginStats?.totalLogins || 0}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-item__label">Avg Session</span>
              <span className="stat-item__value">
                {analysis?.loginStats?.averageSessionTime || 0} min
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-item__label">Longest Session</span>
              <span className="stat-item__value">
                {analysis?.loginStats?.longestSession || 0} min
              </span>
            </div>
          </div>
        </div>
      </ChartCard>

      {/* Activity Patterns */}
      <div className="cards-grid cards-grid--2">
        <ChartCard title="Most Active Days">
          <div className="pattern-list">
            {analysis?.patterns?.mostActiveDays && analysis.patterns.mostActiveDays.length > 0 ? (
              <ul className="days-list">
                {analysis.patterns.mostActiveDays.map((day, idx) => (
                  <li key={idx} className="days-list__item">
                    <span className="days-list__day">{day}</span>
                    <span className="days-list__badge">Peak Activity</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-secondary">No pattern data available yet</p>
            )}
          </div>
        </ChartCard>

        <ChartCard title="Peak Login Hours">
          <div className="pattern-list">
            {analysis?.patterns?.peakHours && analysis.patterns.peakHours.length > 0 ? (
              <ul className="hours-list">
                {analysis.patterns.peakHours.map((hour, idx) => (
                  <li key={idx} className="hours-list__item">
                    <span className="hours-list__time">{hour}</span>
                    <span className="hours-list__badge">Active</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-secondary">No time pattern data available yet</p>
            )}
          </div>
        </ChartCard>
      </div>

      {/* Frequency & Recommendations */}
      <div className="cards-grid cards-grid--2">
        <Card className="frequency-card">
          <h3 className="frequency-card__title">Login Frequency</h3>
          <div className="frequency-badge">
            <BadgeCard status={
              analysis?.patterns?.loginFrequency === 'very_frequent'
                ? 'success'
                : analysis?.patterns?.loginFrequency === 'frequent'
                ? 'info'
                : analysis?.patterns?.loginFrequency === 'regular'
                ? 'info'
                : 'warning'
            }>
              {analysis?.patterns?.loginFrequency || 'occasional'}
            </BadgeCard>
          </div>
          <div className="frequency-descriptions">
            <p>
              {analysis?.patterns?.loginFrequency === 'very_frequent'
                ? 'You\'re logging in multiple times daily. Great engagement!'
                : analysis?.patterns?.loginFrequency === 'frequent'
                ? 'You maintain good daily involvement.'
                : analysis?.patterns?.loginFrequency === 'regular'
                ? 'You participate regularly.'
                : 'Try logging in more frequently to improve your streak!'}
            </p>
          </div>
        </Card>

        <Card className="recommendations-card">
          <h3 className="recommendations-card__title">Recommendations</h3>
          <ul className="recommendations-list">
            {analysis?.patterns?.averageSessionDuration < 30 && (
              <li className="recommendations-list__item">
                <span className="icon">💡</span>
                <span>Try longer sessions for better focus</span>
              </li>
            )}
            {intensity?.streak?.consistency < 60 && (
              <li className="recommendations-list__item">
                <span className="icon">🎯</span>
                <span>Work on daily login consistency</span>
              </li>
            )}
            {intensity?.currentIntensity === 'low' && (
              <li className="recommendations-list__item">
                <span className="icon">⚡</span>
                <span>Increase your platform engagement</span>
              </li>
            )}
            {!analysis?.patterns?.peakHours || analysis.patterns.peakHours.length === 0 && (
              <li className="recommendations-list__item">
                <span className="icon">📊</span>
                <span>Build activity data through regular logins</span>
              </li>
            )}
          </ul>
        </Card>
      </div>

      {/* Daily Breakdown */}
      <Card className="daily-breakdown">
        <h3 className="daily-breakdown__title">Last 7 Days Breakdown</h3>
        <div className="daily-grid">
          {analysis?.daily && Array.isArray(analysis.daily) && analysis.daily.length > 0 ? (
            analysis.daily.slice(-7).reverse().map((day, idx) => (
              <div key={idx} className="daily-item">
                <p className="daily-item__date">
                  {new Date(day.date).toLocaleDateString('en-US', {
                    weekday: 'short'
                  })}
                </p>
                <div className={`daily-item__intensity daily-item__intensity--${day.intensity}`}>
                  {day.intensity}
                </div>
                <p className="daily-item__stat">
                  {day.loginCount} logins
                </p>
                <p className="daily-item__stat">
                  {day.totalSessionTime} min
                </p>
              </div>
            ))
          ) : (
            <p className="text-secondary">No daily data available</p>
          )}
        </div>
      </Card>
    </div>
  );
}
