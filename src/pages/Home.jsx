// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
location.href = location.origin + "/home";
const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Master Your Coding Skills</h1>
          <p className="hero-subtitle">
            Compete in challenging coding events, learn from experts, and climb the leaderboards
          </p>
          <div className="hero-buttons">
            <Link to="/signup" className="btn btn-primary">
              Get Started Free
            </Link>
            <Link to="/about" className="btn btn-secondary">
              Learn More
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-card card-1">💻</div>
          <div className="floating-card card-2">🏆</div>
          <div className="floating-card card-3">🚀</div>
          <svg className="hero-bg" viewBox="0 0 1000 600">
            <circle cx="200" cy="150" r="120" fill="rgba(59, 130, 246, 0.1)" />
            <circle cx="800" cy="400" r="100" fill="rgba(139, 92, 246, 0.1)" />
            <circle cx="100" cy="500" r="80" fill="rgba(59, 130, 246, 0.05)" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Real-World Challenges</h3>
            <p>Solve problems used in real interviews and industry applications.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Detailed Analytics</h3>
            <p>Track your progress with detailed performance metrics and insights.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>Compete & Win</h3>
            <p>Participate in competitions and win exciting prizes and certificates.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Community</h3>
            <p>Join thousands of developers and learn from the best.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Instant Feedback</h3>
            <p>Get immediate feedback on your submissions with detailed explanations.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎓</div>
            <h3>Learn from Experts</h3>
            <p>Access tutorials and resources created by industry experts.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Sign Up</h3>
            <p>Create your free account in seconds</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Choose Event</h3>
            <p>Select from multiple coding challenges</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Solve Problems</h3>
            <p>Write and test your code solutions</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Win Rewards</h3>
            <p>Earn badges, certificates & prizes</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stat-item">
          <h3>10K+</h3>
          <p>Active Users</p>
        </div>
        <div className="stat-item">
          <h3>500+</h3>
          <p>Coding Problems</p>
        </div>
        <div className="stat-item">
          <h3>100+</h3>
          <p>Live Events</p>
        </div>
        <div className="stat-item">
          <h3>$1M+</h3>
          <p>Prizes Distributed</p>
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-section" id="about">
        <div className="about-container">
          <div className="about-content">
            <h2>About Us</h2>
            <p className="about-intro">
              We're a platform dedicated to helping developers master their craft through competitive coding and continuous learning.
            </p>
            
            <div className="about-details">
              <div className="detail-box">
                <h3>Our Mission</h3>
                <p>
                  To empower every developer worldwide by providing accessible, high-quality coding challenges and events that foster growth, innovation, and community.
                </p>
              </div>
              
              <div className="detail-box">
                <h3>Our Vision</h3>
                <p>
                  To be the leading platform where developers of all skill levels can compete, learn, and connect with peers from around the globe.
                </p>
              </div>

              <div className="detail-box">
                <h3>Our Values</h3>
                <ul className="values-list">
                  <li>✓ Excellence in every challenge we create</li>
                  <li>✓ Integrity and fairness in all competitions</li>
                  <li>✓ Community-driven growth and support</li>
                  <li>✓ Accessibility for developers worldwide</li>
                </ul>
              </div>

              <div className="detail-box">
                <h3>Why We Started</h3>
                <p>
                  We noticed that many talented developers lacked opportunities to showcase their skills and compete at scale. We created this platform to bridge that gap and make competitive coding accessible to everyone.
                </p>
              </div>
            </div>

            <div className="team-section">
              <h3>Our Team</h3>
              <p>
                Founded by a team of experienced software engineers and educators from leading tech companies, we combine industry expertise with a passion for education.
              </p>
            </div>
          </div>

          <div className="about-image">
            <div className="image-placeholder">
              <svg viewBox="0 0 400 400" className="about-illustration">
                <circle cx="200" cy="200" r="150" fill="#dbeafe" opacity="0.3" />
                <circle cx="200" cy="200" r="100" fill="#3b82f6" opacity="0.2" />
                <rect x="150" y="150" width="100" height="100" fill="#667eea" rx="10" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Start Your Journey?</h2>
        <p>Join thousands of developers competing and learning on our platform</p>
        <Link to="/signup" className="btn btn-primary large">
          Sign Up Now
        </Link>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h4>Is the platform free?</h4>
            <p>Yes! Our platform is completely free. You can participate in all events and challenges without any cost.</p>
          </div>
          <div className="faq-item">
            <h4>What languages are supported?</h4>
            <p>We support Python, Java, C++, JavaScript, Go, Rust, and more. Check our documentation for the complete list.</p>
          </div>
          <div className="faq-item">
            <h4>Can I organize an event?</h4>
            <p>Yes! Managers can create and organize their own events. Sign up as a manager to get started.</p>
          </div>
          <div className="faq-item">
            <h4>How are winners determined?</h4>
            <p>Winners are determined by correctness, execution time, and memory usage. Check our ranking algorithm documentation.</p>
          </div>
          <div className="faq-item">
            <h4>Do I get certificates?</h4>
            <p>Yes! Participants get digital certificates for participating and winning in events.</p>
          </div>
          <div className="faq-item">
            <h4>Is there a leaderboard?</h4>
            <p>Yes! We have global and event-specific leaderboards that update in real-time.</p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="footer-cta">
        <h2>Join the Community</h2>
        <p>Be part of the coding revolution</p>
        <div className="social-links">
          <a href="#" className="social-icon">Twitter</a>
          <a href="#" className="social-icon">GitHub</a>
          <a href="#" className="social-icon">Discord</a>
          <a href="#" className="social-icon">LinkedIn</a>
        </div>
      </section>
    </div>
  );
};

export default Home;
