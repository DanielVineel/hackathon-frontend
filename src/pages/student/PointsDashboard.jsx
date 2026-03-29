import React, { useState, useEffect } from 'react';
import API from '../../api/api';
import { Card, StatCard, ChartCard, ProgressCard, BadgeCard } from '../../components/DashboardCard';
import '../../styles/PointsDashboard.css';

export default function PointsDashboard() {
  const [points, setPoints] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPointsData();
  }, []);

  const fetchPointsData = async () => {
    try {
      setLoading(true);
      const [pointsRes, leaderboardRes, rankRes] = await Promise.all([
        API.get('/points/summary'),
        API.get('/points/leaderboard?limit=10'),
        API.get('/points/rank')
      ]);

      setPoints(pointsRes.data);
      setLeaderboard(leaderboardRes.data.leaderboard);
      setUserRank(rankRes.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch points data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="points-dashboard loading">Loading...</div>;
  if (error) return <div className="points-dashboard error">{error}</div>;

  const levelColors = {
    Bronze: '#CD7F32',
    Silver: '#C0C0C0',
    Gold: '#FFD700',
    Platinum: '#E5E4E2',
    Diamond: '#B9F2FF'
  };

  return (
    <div className="points-dashboard">
      <div className="points-dashboard__header">
        <h1>Points & Achievements</h1>
        <p className="text-secondary">Track your progress and climb the leaderboard</p>
      </div>

      {/* Main Stats */}
      <div className="cards-grid cards-grid--3">
        <StatCard
          icon="⭐"
          title="Total Points"
          value={points?.totalPoints || 0}
          color="primary"
        />
        <StatCard
          icon="🎖️"
          title="Current Level"
          value={points?.currentLevel || 'Bronze'}
          color="warning"
        />
        <StatCard
          icon="📊"
          title="Your Rank"
          value={`#${userRank?.rank || '-'}`}
          subtitle={`Top ${userRank?.percentile || 0}%`}
          color="success"
        />
      </div>

      {/* Level Progress */}
      <Card className="level-progress">
        <div className="level-progress__header">
          <h3>Level Progress</h3>
          <BadgeCard status={points?.currentLevel === 'Diamond' ? 'success' : 'info'}>
            {points?.currentLevel}
          </BadgeCard>
        </div>
        <p className="level-progress__milestone">
          {points?.levelProgress || 0}% to next level
        </p>
        <ProgressCard
          title="Progress"
          progress={points?.levelProgress || 0}
          color="primary"
          label={`${Math.round(points?.levelProgress || 0)}%`}
        />
      </Card>

      {/* Points Breakdown */}
      <div className="cards-grid cards-grid--2">
        <ChartCard title="Points Breakdown">
          <div className="breakdown-list">
            <div className="breakdown-item">
              <div className="breakdown-item__label">
                <span className="breakdown-item__icon">🔧</span>
                Problems Solved
              </div>
              <span className="breakdown-item__value">
                {points?.breakdown?.problemsSolved || 0}
              </span>
            </div>
            <div className="breakdown-item">
              <div className="breakdown-item__label">
                <span className="breakdown-item__icon">🎯</span>
                Event Participation
              </div>
              <span className="breakdown-item__value">
                {points?.breakdown?.eventParticipation || 0}
              </span>
            </div>
            <div className="breakdown-item">
              <div className="breakdown-item__label">
                <span className="breakdown-item__icon">🏆</span>
                Certificates Earned
              </div>
              <span className="breakdown-item__value">
                {points?.breakdown?.certificatesEarned || 0}
              </span>
            </div>
            <div className="breakdown-item">
              <div className="breakdown-item__label">
                <span className="breakdown-item__icon">📈</span>
                Leaderboard Bonus
              </div>
              <span className="breakdown-item__value">
                {points?.breakdown?.leaderboardRanking || 0}
              </span>
            </div>
            <div className="breakdown-item">
              <div className="breakdown-item__label">
                <span className="breakdown-item__icon">⚡</span>
                Bonus Points
              </div>
              <span className="breakdown-item__value">
                {points?.breakdown?.bonusPoints || 0}
              </span>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Top 10 Leaderboard">
          <div className="leaderboard-list">
            {leaderboard.map((entry, idx) => (
              <div key={entry.rank} className="leaderboard-item">
                <div className="leaderboard-item__rank">
                  {entry.rank <= 3 ? (
                    <span className={`medal medal--${entry.rank}`}>
                      {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                    </span>
                  ) : (
                    <span className="rank-number">#{entry.rank}</span>
                  )}
                </div>
                <div className="leaderboard-item__info">
                  <p className="leaderboard-item__name">
                    {entry.user?.firstName} {entry.user?.lastName}
                  </p>
                  <p className="leaderboard-item__level">
                    {entry.level}
                  </p>
                </div>
                <span className="leaderboard-item__points">
                  {entry.totalPoints}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Level Thresholds Info */}
      <Card className="level-info">
        <h3>Level Thresholds</h3>
        <div className="level-thresholds">
          {[
            { level: 'Bronze', min: 0, max: 500 },
            { level: 'Silver', min: 500, max: 1500 },
            { level: 'Gold', min: 1500, max: 3500 },
            { level: 'Platinum', min: 3500, max: 7000 },
            { level: 'Diamond', min: 7000, max: '∞' }
          ].map((threshold) => (
            <div
              key={threshold.level}
              className={`threshold ${
                threshold.level === points?.currentLevel ? 'threshold--active' : ''
              }`}
            >
              <div className="threshold__level">{threshold.level}</div>
              <div className="threshold__range">
                {threshold.min} - {threshold.max}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
