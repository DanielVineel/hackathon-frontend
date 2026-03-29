import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";
import Modal from "../../components/common/Modal";
import "./EventDetailsPage.css";

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  // Data states
  const [event, setEvent] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState(null);

  // Payment states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: ""
  });

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch event details
      const eventRes = await API.get(`/events/${eventId}`);
      setEvent(eventRes.data || eventRes.data.event);

      // Check registration status
      try {
        const regRes = await API.get(`/student/myEvents`);
        const myRegistration = regRes.data?.registrations?.find(
          reg => reg.eventId?._id === eventId || reg.eventId === eventId
        );
        
        if (myRegistration) {
          setRegistration(myRegistration);
          setRegistrationStatus(myRegistration.registrationStatus);
        }
      } catch (err) {
        console.log("Not registered yet");
      }
    } catch (err) {
      console.error("Error fetching event details:", err);
      setError(err.response?.data?.message || "Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  const getEventStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > now) return "Upcoming";
    if (start <= now && end >= now) return "Ongoing";
    return "Completed";
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      const res = await API.post(`/student/event/register/${eventId}`);
      setRegistration(res.data.registration);
      setRegistrationStatus(res.data.registration.registrationStatus);
      alert("Successfully registered for the event!");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.name) {
      alert("Please fill in all payment details");
      return;
    }

    try {
      setPaymentLoading(true);
      
      // Process payment through backend
      const res = await API.post(`/payment/process`, {
        eventId,
        amount: event.fee,
        paymentMethod: "card",
        cardDetails: {
          number: paymentData.cardNumber,
          expiry: paymentData.expiryDate,
          cvv: paymentData.cvv,
          name: paymentData.name
        }
      });

      if (res.data?.success) {
        // Update registration status after payment
        await fetchEventDetails();
        setShowPaymentModal(false);
        alert("Payment successful! Event registered.");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Payment failed");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleStartEvent = async () => {
    try {
      setLoading(true);
      const res = await API.post(`/student/event/start/${eventId}`);
      
      if (res.data?.attemptId) {
        navigate(`/student/event/${eventId}/attempt`, {
          state: {
            attemptId: res.data.attemptId,
            startTime: res.data.startTime,
            endTime: res.data.endTime,
            remainingTime: res.data.remainingTime
          }
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to start event");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !event) {
    return (
      <div className="event-details-page loading">
        <div className="loader"></div>
        <p>Loading event details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="event-details-page error">
        <div className="error-message">
          <h2>⚠️ Error</h2>
          <p>{error}</p>
          <button className="btn-back" onClick={() => navigate("/student/events")}>
            ← Back to Events
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-details-page">
        <div className="error-message">
          <h2>Event not found</h2>
          <button className="btn-back" onClick={() => navigate("/student/events")}>
            ← Back to Events
          </button>
        </div>
      </div>
    );
  }

  const status = getEventStatus(event.startDate, event.endDate);
  const isOngoing = status === "Ongoing";
  const isRegistered = registration && registrationStatus === "registered";
  const isPaid = registration?.paymentStatus === "paid" || event.fee === 0;

  return (
    <div className="event-details-page">
      {/* Header */}
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate("/student/events")}>
          ← Back to Events
        </button>
      </div>

      {/* Event Card */}
      <div className="event-details-card">
        {/* Basic Info */}
        <div className="event-header">
          <div>
            <h1 className="event-title">{event.name || event.title}</h1>
            <span className={`status-badge ${status.toLowerCase()}`}>
              {status}
            </span>
          </div>
        </div>

        <p className="event-description">{event.description}</p>

        {/* Details Grid */}
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">📅 Start Date</span>
            <span className="detail-value">
              {new Date(event.startDate).toLocaleString()}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">⏱️ End Date</span>
            <span className="detail-value">
              {new Date(event.endDate).toLocaleString()}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">📍 Venue</span>
            <span className="detail-value">{event.venue || "Online"}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">⏳ Duration</span>
            <span className="detail-value">
              {event.totalDurationMinutes ? `${event.totalDurationMinutes} minutes` : "N/A"}
            </span>
          </div>

          {event.fee > 0 && (
            <div className="detail-item">
              <span className="detail-label">💰 Registration Fee</span>
              <span className="detail-value">₹{event.fee}</span>
            </div>
          )}

          {event.prizeMoney > 0 && (
            <div className="detail-item">
              <span className="detail-label">🏆 Prize Pool</span>
              <span className="detail-value">₹{event.prizeMoney}</span>
            </div>
          )}

          <div className="detail-item">
            <span className="detail-label">👥 Max Participants</span>
            <span className="detail-value">{event.maxParticipants || "Unlimited"}</span>
          </div>

          {event.organizedBy && (
            <div className="detail-item">
              <span className="detail-label">🎯 Organized By</span>
              <span className="detail-value">{event.organizedBy.name}</span>
            </div>
          )}
        </div>

        {/* Registration Section */}
        <div className="registration-section">
          <h2>Registration</h2>

          {!registration ? (
            <div className="registration-info">
              <p>You haven't registered for this event yet.</p>
              {status !== "Completed" && (
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleRegister}
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register for Event"}
                </button>
              )}
              {status === "Completed" && (
                <p className="status-text">This event has ended.</p>
              )}
            </div>
          ) : (
            <div className="registration-info registered">
              <div className="status-item">
                <span className="label">Registration Status:</span>
                <span className={`badge ${registrationStatus}`}>
                  {registrationStatus?.toUpperCase()}
                </span>
              </div>

              {event.fee > 0 && (
                <div className="status-item">
                  <span className="label">Payment Status:</span>
                  <span className={`badge ${registration.paymentStatus}`}>
                    {registration.paymentStatus?.toUpperCase()}
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="action-buttons">
                {event.fee > 0 && registration.paymentStatus !== "paid" && (
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowPaymentModal(true)}
                    disabled={loading}
                  >
                    Complete Payment
                  </button>
                )}

                {isOngoing && isPaid && (
                  <button
                    className="btn btn-success btn-lg"
                    onClick={handleStartEvent}
                    disabled={loading}
                  >
                    {loading ? "Starting..." : "🚀 Start Event"}
                  </button>
                )}

                {!isOngoing && isPaid && (
                  <div className="status-text">
                    {status === "Upcoming"
                      ? "Event will start soon..."
                      : "This event has ended."}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <Modal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          title="Complete Payment"
        >
          <div className="modal-content payment-form">
            <div className="payment-info">
              <p>Event: <strong>{event.name}</strong></p>
              <p>Amount: <strong>₹{event.fee}</strong></p>
            </div>

            <div className="form-group">
              <label>Cardholder Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={paymentData.name}
                onChange={(e) => setPaymentData({ ...paymentData, name: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={paymentData.cardNumber}
                onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                className="form-input"
                maxLength="19"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={paymentData.expiryDate}
                  onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
                  className="form-input"
                  maxLength="5"
                />
              </div>

              <div className="form-group">
                <label>CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  value={paymentData.cvv}
                  onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                  className="form-input"
                  maxLength="4"
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowPaymentModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handlePayment}
                disabled={paymentLoading}
              >
                {paymentLoading ? "Processing..." : `Pay ₹${event.fee}`}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EventDetailsPage;
