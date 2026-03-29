import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/api';
import PublicLayout from '../../layouts/PublicLayout';
import '../../styles/PublicHome.css';

export default function PublicHome() {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedEvents();
  }, []);

  const fetchFeaturedEvents = async () => {
    try {
      setLoading(true);
      const res = await API.get('/events?limit=3');
      setFeaturedEvents(res.data.events || []);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="public-home">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero__content">
            <h1 className="hero__title">Welcome to Hackathon Platform</h1>
            <p className="hero__subtitle">
              Learn, compete, and grow with our community. Participate in contests, solve problems,
              and earn badges and certificates.
            </p>
            <div className="hero__actions">
              <button
                className="btn btn-primary"
                onClick={() => navigate('/auth/student/signup')}
              >
                Get Started as Student
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigate('/events')}
              >
                Browse Events
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features">
          <h2>Why Join Our Platform?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-card__icon">🎯</div>
              <h3>Compete & Learn</h3>
              <p>Participate in coding contests and improve your skills</p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">🏆</div>
              <h3>Earn Achievements</h3>
              <p>Get points, badges, and certificates for your accomplishments</p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">📊</div>
              <h3>Track Progress</h3>
              <p>Monitor your activity, streaks, and achievements</p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">👥</div>
              <h3>Community</h3>
              <p>Connect with developers and participate in events</p>
            </div>
          </div>
        </section>

        {/* Featured Events */}
        <section className="featured-events">
          <h2>Featured Events</h2>
          {loading ? (
            <p>Loading events...</p>
          ) : featuredEvents.length > 0 ? (
            <div className="events-grid">
              {featuredEvents.map((event) => (
                <div key={event._id} className="event-card-featured">
                  <h3>{event.title}</h3>
                  <p className="event-date">
                    {new Date(event.startDate).toDateString()}
                  </p>
                  <p className="event-description">{event.description}</p>
                  <button
                    className="btn btn-outline"
                    onClick={() => navigate('/events')}
                  >
                    View Event
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No events available. Check back soon!</p>
          )}
        </section>

        {/* Call to Action */}
        <section className="cta">
          <h2>Ready to Start Your Journey?</h2>
          <p>Join thousands of developers improving their skills</p>
          <div className="cta-buttons">
            <button
              className="btn btn-primary"
              onClick={() => navigate('/auth/student/signup')}
            >
              Sign Up as Student
            </button>
            <button
              className="btn btn-outline"
              onClick={() => navigate('/auth/manager/signup')}
            >
              Sign Up as Manager
            </button>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
