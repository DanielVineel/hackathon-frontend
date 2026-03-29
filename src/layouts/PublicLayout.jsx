import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './PublicLayout.css';

export default function PublicLayout({ children }) {
  const location = useLocation();

  return (
    <div className="public-layout">
      {/* Public Navbar */}
      <nav className="public-navbar">
        <div className="public-navbar__container">
          <Link to="/" className="public-navbar__logo">
            💻 Hackathon Platform
          </Link>

          <div className="public-navbar__menu">
            <Link
              to="/"
              className={`public-navbar__link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link
              to="/events"
              className={`public-navbar__link ${location.pathname === '/events' ? 'active' : ''}`}
            >
              Events
            </Link>
            <Link
              to="/about"
              className={`public-navbar__link ${location.pathname === '/about' ? 'active' : ''}`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`public-navbar__link ${location.pathname === '/contact' ? 'active' : ''}`}
            >
              Contact
            </Link>
          </div>

          <div className="public-navbar__actions">
            <Link to="/auth/student/login" className="btn btn-outline btn-small">
              Login
            </Link>
            <Link to="/auth/student/signup" className="btn btn-primary btn-small">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="public-layout__main">
        {children}
      </main>

      {/* Footer */}
      <footer className="public-footer">
        <div className="public-footer__container">
          <div className="footer-section">
            <h4>Hackathon Platform</h4>
            <p>Empower developers worldwide through competitive programming and community engagement.</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/events">Browse Events</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/auth/student/login">Student Login</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><a href="#help">Help & Support</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#blog">Blog</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Connect</h4>
            <ul>
              <li><a href="#twitter">Twitter</a></li>
              <li><a href="#linkedin">LinkedIn</a></li>
              <li><a href="#github">GitHub</a></li>
              <li><a href="#discord">Discord</a></li>
            </ul>
          </div>
        </div>

        <div className="public-footer__bottom">
          <p>&copy; 2024 Hackathon Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
