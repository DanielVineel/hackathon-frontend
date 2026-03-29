import React, { useState } from 'react';
import API from '../../api/api';
import '../../styles/PublicContact.css';
import PublicLayout from '../../layouts/PublicLayout';

export default function PublicContact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      // Submit to backend contact endpoint
      const response = await API.post('/contact', {
        ...formData,
        category: 'general'
      });
      setStatus({
        type: 'success',
        message: response.data.message || 'Thank you! We received your message. We will get back to you soon.'
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.message || 'Failed to send message. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="public-contact">
        {/* Hero Section */}
        <div className="contact-hero">
          <h1>Get In Touch</h1>
          <p>Have questions? We'd love to hear from you. Send us a message!</p>
        </div>

        <div className="contact-container">
          <div className="contact-content">
            {/* Contact Form */}
            <div className="contact-form-section">
              <h2>Send us a Message</h2>
              <form onSubmit={handleSubmit} className="contact-form">
                {status && (
                  <div className={`status-message status-${status.type}`}>
                    {status.message}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What is this about?"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Your message here..."
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-large"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="contact-info-section">
              <h2>Contact Information</h2>

              <div className="contact-info">
                <div className="info-item">
                  <div className="info-icon">📧</div>
                  <div>
                    <h3>Email</h3>
                    <p>support@hackathon.com</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">📞</div>
                  <div>
                    <h3>Phone</h3>
                    <p>+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">📍</div>
                  <div>
                    <h3>Address</h3>
                    <p>Tech Hub, Innovation District<br />San Francisco, CA 94105</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">⏰</div>
                  <div>
                    <h3>Business Hours</h3>
                    <p>Monday - Friday: 9:00 AM - 6:00 PM PST</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="social-links">
                <h3>Follow Us</h3>
                <div className="social-icons">
                  <a href="#" className="social-icon" title="Twitter" aria-label="Twitter">
                    <span>𝕏</span>
                  </a>
                  <a href="#" className="social-icon" title="LinkedIn" aria-label="LinkedIn">
                    <span>in</span>
                  </a>
                  <a href="#" className="social-icon" title="GitHub" aria-label="GitHub">
                    <span>⚙️</span>
                  </a>
                  <a href="#" className="social-icon" title="Discord" aria-label="Discord">
                    <span>💬</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="contact-faq">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-list">
              <details className="faq-item">
                <summary>How do I create an account?</summary>
                <p>
                  Click on "Sign Up" in the navigation menu, choose your role (Student, Manager, 
                  or SuperAdmin), and follow the registration process. Verify your email to get started!
                </p>
              </details>

              <details className="faq-item">
                <summary>Can I switch between roles?</summary>
                <p>
                  Your role is set during registration. If you need to switch roles, please contact 
                  our support team at support@hackathon.com with your request.
                </p>
              </details>

              <details className="faq-item">
                <summary>How are points calculated?</summary>
                <p>
                  Points are awarded based on problem difficulty, code efficiency, and completion time. 
                  More challenging problems award more points. Check our Points system page for detailed information.
                </p>
              </details>

              <details className="faq-item">
                <summary>How can I participate in events?</summary>
                <p>
                  Browse the Events section, click on an event you're interested in, and register. 
                  You'll receive updates and reminders as the event date approaches.
                </p>
              </details>

              <details className="faq-item">
                <summary>Is there a mobile app?</summary>
                <p>
                  Currently, we're web-based and fully responsive on mobile devices. Native mobile 
                  apps are in our roadmap for future releases.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
