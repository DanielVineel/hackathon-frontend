import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";
import { getToken, getUserData } from "../../utils/auth";
import "../styles/EventDetails.css";

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const user = getUserData();
  const token = getToken();

  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [registrationData, setRegistrationData] = useState({});

  useEffect(() => {
    fetchEventDetails();
  }, [eventId, token]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/events/${eventId}`);
      setEvent(res.data.data || res.data);

      // Check if student is registered (if student role)
      if (user && user.role === "student" && token) {
        try {
          const regRes = await API.get(`/student/myEvents`);
          const registered = regRes.data.data?.some(e => e._id === eventId);
          setIsRegistered(registered);
        } catch (err) {
          console.log("Could not fetch registration status");
        }
      }
    } catch (err) {
      setError("Failed to load event details");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    if (!user || user.role !== "student") {
      navigate("/auth/student/login");
      return;
    }
    setShowRegistrationModal(true);
  };

  const handleConfirmRegistration = async () => {
    try {
      if (event.fee && event.fee > 0) {
        // Show payment modal
        setShowRegistrationModal(false);
        setShowPaymentModal(true);
      } else {
        // Direct registration for free events
        await registerForEvent();
      }
    } catch (err) {
      setError("Registration failed");
    }
  };

  const handleProcessPayment = async (paymentDetails) => {
    try {
      // Process payment via PayU
      const paymentRes = await API.post(`/payments/initiate`, {
        eventId: event._id,
        amount: event.fee,
        orderId: `EVT_${event._id}_${Date.now()}`,
        ...paymentDetails
      });

      if (paymentRes.data.data?.redirectUrl) {
        window.location.href = paymentRes.data.data.redirectUrl;
      } else {
        await registerForEvent();
        setShowPaymentModal(false);
        setShowRegistrationModal(false);
        setIsRegistered(true);
      }
    } catch (err) {
      setError("Payment processing failed");
      console.log(err);
    }
  };

  const registerForEvent = async () => {
    try {
      await API.post(`/student/event/register/${event._id}`);
      setIsRegistered(true);
      setShowRegistrationModal(false);
      setShowPaymentModal(false);
    } catch (err) {
      setError("Failed to register for event");
      console.log(err);
    }
  };

  const handleStartEvent = () => {
    if (isRegistered) {
      navigate(`/student/event/${event._id}/participate`);
    }
  };

  const handleViewLeaderboard = () => {
    navigate(`/student/event-leaderboard/${event._id}`);
  };

  if (loading) return <div className="event-details-container"><p>Loading event details...</p></div>;
  if (error || !event) return <div className="event-details-container"><p className="error">{error || "Event not found"}</p></div>;

  return (
    <div className="event-details-container">
      <div className="event-header">
        <h1>{event.title}</h1>
        <span className={`status-badge status-${event.status}`}>{event.status.toUpperCase()}</span>
      </div>

      <div className="event-content">
        <div className="event-info">
          <section className="info-section">
            <h3>Description</h3>
            <p>{event.description}</p>
          </section>

          <section className="info-section">
            <h3>Event Details</h3>
            <div className="details-grid">
              <div className="detail">
                <label>Start Date:</label>
                <p>{new Date(event.startDate).toLocaleString()}</p>
              </div>
              <div className="detail">
                <label>End Date:</label>
                <p>{new Date(event.endDate).toLocaleString()}</p>
              </div>
              <div className="detail">
                <label>Venue:</label>
                <p>{event.venue || "Online"}</p>
              </div>
              <div className="detail">
                <label>Fee:</label>
                <p>{event.fee ? `₹${event.fee}` : "Free"}</p>
              </div>
              {event.prizeMoney && (
                <div className="detail">
                  <label>Prize Money:</label>
                  <p>₹{event.prizeMoney}</p>
                </div>
              )}
              <div className="detail">
                <label>Max Participants:</label>
                <p>{event.maxParticipants || "Unlimited"}</p>
              </div>
            </div>
          </section>

          {event.problems && event.problems.length > 0 && (
            <section className="info-section">
              <h3>Problems in this Event</h3>
              <div className="problems-list">
                {event.problems.map(problem => (
                  <div key={problem._id} className="problem-item">
                    <h4>{problem.title}</h4>
                    <p>{problem.description?.substring(0, 100)}...</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="event-actions">
          {event.status === "canceled" && (
            <div className="canceled-notice">
              <p>⚠️ This event has been cancelled</p>
            </div>
          )}

          {event.status === "upcoming" && (
            <>
              {!isRegistered ? (
                <button className="btn-primary" onClick={handleRegisterClick}>
                  Register Now
                </button>
              ) : (
                <div className="registered-badge">
                  ✓ You are registered for this event
                </div>
              )}
            </>
          )}

          {event.status === "ongoing" && isRegistered && (
            <button className="btn-primary btn-large" onClick={handleStartEvent}>
              Start Event
            </button>
          )}

          {event.status === "ongoing" && !isRegistered && (
            <button className="btn-secondary" onClick={handleRegisterClick}>
              Register & Join
            </button>
          )}

          {event.status === "completed" && (
            <button className="btn-secondary" onClick={handleViewLeaderboard}>
              View Leaderboard
            </button>
          )}
        </div>
      </div>

      {/* Registration Modal */}
      {showRegistrationModal && (
        <div className="modal-overlay" onClick={() => setShowRegistrationModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Register for Event</h2>
            <p className="event-title">{event.title}</p>
            {event.fee > 0 && (
              <p className="fee-info">Event Fee: <strong>₹{event.fee}</strong></p>
            )}
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowRegistrationModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleConfirmRegistration}>
                {event.fee > 0 ? "Proceed to Payment" : "Confirm Registration"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Payment Details</h2>
            <div className="payment-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" placeholder="Your full name" onChange={(e) => setRegistrationData({...registrationData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" value={user?.email} disabled />
              </div>
              <div className="form-group">
                <label>Phone *</label>
                <input type="tel" placeholder="10-digit phone number" onChange={(e) => setRegistrationData({...registrationData, phone: e.target.value})} />
              </div>
              <div className="payment-summary">
                <p>Total Amount: <strong>₹{event.fee}</strong></p>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowPaymentModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={() => handleProcessPayment(registrationData)}>Pay Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;