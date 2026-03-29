import React from 'react';
import '../../styles/PublicAbout.css';
import PublicLayout from '../../layouts/PublicLayout';

export default function PublicAbout() {
  const testimonials = [
    {
      name: 'Alex Morgan',
      role: 'Student Developer',
      text: 'This platform completely transformed how I approach coding challenges. The points system keeps me motivated!',
      avatar: '👨‍💻'
    },
    {
      name: 'Sarah Chen',
      role: 'Event Manager',
      text: 'Managing events has never been easier. The registration tracking and participation insights are invaluable.',
      avatar: '👩‍💼'
    },
    {
      name: 'James Wilson',
      role: 'Competitive Programmer',
      text: 'Love the leaderboard feature. The competition pushes me to code better every day.',
      avatar: '🏆'
    }
  ];

  const features = [
    {
      icon: '🎯',
      title: 'Comprehensive Evaluation',
      description: 'Our automated code execution system evaluates your solutions instantly with detailed feedback.'
    },
    {
      icon: '📊',
      title: 'Progress Tracking',
      description: 'Monitor your improvement with detailed analytics, activity intensity tracking, and personalized insights.'
    },
    {
      icon: '🏅',
      title: 'Gamification',
      description: 'Earn points, achieve badges, climb the leaderboard, and compete with peers in an engaging way.'
    },
    {
      icon: '👥',
      title: 'Community Events',
      description: 'Participate in exclusive hackathons, workshops, and coding challenges organized by experts.'
    },
    {
      icon: '📅',
      title: 'Smart Calendar',
      description: 'Never miss an important event with our integrated calendar and notification system.'
    },
    {
      icon: '📜',
      title: 'Certificates',
      description: 'Earn and share official certificates for completed courses and won competitions.'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Students' },
    { number: '500+', label: 'Coding Problems' },
    { number: '100+', label: 'Events Hosted' },
    { number: '95%', label: 'Success Rate' }
  ];

  return (
    <PublicLayout>
      <div className="public-about">
        {/* Hero Section */}
        <div className="about-hero">
          <h1>Empowering Developers Worldwide</h1>
          <p>
            A comprehensive platform for competitive programming, skill development,
            and community engagement
          </p>
        </div>

        {/* Mission Section */}
        <section className="about-section about-mission">
          <div className="about-container">
            <h2>Our Mission</h2>
            <p className="mission-text">
              We believe in democratizing access to quality coding education and creating
              a space where developers can challenge themselves, learn from peers, and grow
              their skills. Our platform combines automated evaluation, intelligent tracking,
              and community engagement to create the ultimate competitive programming experience.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="about-stats">
          <div className="about-container">
            <div className="stats-grid">
              {stats.map((stat, idx) => (
                <div key={idx} className="stat-item">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="about-features">
          <div className="about-container">
            <h2>Why Choose Our Platform?</h2>
            <div className="features-grid">
              {features.map((feature, idx) => (
                <div key={idx} className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="about-testimonials">
          <div className="about-container">
            <h2>What Our Community Says</h2>
            <div className="testimonials-grid">
              {testimonials.map((testimonial, idx) => (
                <div key={idx} className="testimonial-card">
                  <div className="testimonial-header">
                    <span className="testimonial-avatar">{testimonial.avatar}</span>
                    <div>
                      <div className="testimonial-name">{testimonial.name}</div>
                      <div className="testimonial-role">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="testimonial-text">"{testimonial.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="about-cta">
          <div className="about-container about-cta-content">
            <h2>Ready to Start Your Coding Journey?</h2>
            <p>Join thousands of developers who are improving their skills every day.</p>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
