import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import API from "../../api/api";
import "../../styles/StudentEventDetails.css";

/**
 * StudentEventDetails Component
 * Shows event details with registration, payment, and start event functionality
 */
const StudentEventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  // Data States
  const [event, setEvent] = useState(null);
  const [problems, setProblems] = useState([]);
  const [registration, setRegistration] = useState(null);

  // UI States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
      checkRegistration();
    }
  }, [eventId]);

  /**
   * Fetch event details
   */
  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await API.get(`/events/${eventId}`);
      const eventData = res.data?.event || res.data;
      
      setEvent(eventData);

      // Fetch problems for this event
      if (eventData._id) {
        fetchEventProblems(eventData._id);
      }
    } catch (err) {
      console.error("Error fetching event details:", err);
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to load event";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch problems for the event
   */
  const fetchEventProblems = async (eventId) => {
    try {
      const res = await API.get(`/event/${eventId}/problems`);
      const problemsData = res.data?.problems || res.data?.data || [];
      setProblems(Array.isArray(problemsData) ? problemsData : []);
    } catch (err) {
      console.error("Error fetching problems:", err);
      setProblems([]);
    }
  };

  /**
   * Check if user is already registered
   */
  const checkRegistration = async () => {
    try {
      const res = await API.get(`/registration/${eventId}`);
      const regData = res.data?.registration || res.data;
      setRegistration(regData);
    } catch (err) {
      // User is not registered
      setRegistration(null);
    }
  };

  /**
   * Determine event status
   */
  const getEventStatus = () => {
    if (!event) return "Loading";
    const now = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);

    if (start > now) return "Upcoming";
    if (start <= now && end >= now) return "Ongoing";
    return "Completed";
  };

  /**
   * Handle registration for event
   */
  const handleRegister = async () => {
    try {
      setRegistering(true);
      const res = await API.post(`/registration/${eventId}`);
      const regData = res.data?.registration || res.data;
      setRegistration(regData);

      // Check if payment is required
      if (event?.fee && event.fee > 0) {
        // Payment required
        setShowPaymentForm(true);
        alert("Please proceed with payment to complete registration");
      } else {
        // Free event, registration complete
        alert("Registration successful!");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Registration failed";
      alert(errorMsg);
      await checkRegistration();
    } finally {
      setRegistering(false);
    }
  };

  /**
   * Handle payment initiation
   */
  const handlePayment = async () => {
    try {
      setProcessingPayment(true);
      
      // Create payment record
      const paymentRes = await API.post("/payments", {
        amount: event.fee,
        purpose: "event_registration",
        description: `Registration fee for event: ${event.name}`,
        payableId: registration._id
      });

      const paymentData = paymentRes.data;

      // Open PayU form
      if (paymentData.txnid) {
        // Store transaction data for verification
        localStorage.setItem("pendingPayment", JSON.stringify({
          txnid: paymentData.txnid,
          eventId: eventId,
          registrationId: registration._id
        }));

        // Log payment details
        console.log("Payment initiated:", paymentData);
        alert("Redirecting to payment gateway...");
        
        // In production, integrate actual PayU payment gateway
        // For now, show confirmation
        setShowPaymentForm(false);
        alert("Payment processing would be handled via PayU gateway");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Payment initiation failed";
      alert(errorMsg);
    } finally {
      setProcessingPayment(false);
    }
  };

  /**
   * Handle start event
   */
  const handleStartEvent = async () => {
    try {
      setLoading(true);
      
      const res = await API.post(`/registration/${eventId}/start`);
      const attempt = res.data;

      // Store attempt details
      localStorage.setItem("currentEventAttempt", JSON.stringify({
        attemptId: attempt.attemptId,
        eventId: eventId,
        startTime: attempt.startTime,
        endTime: attempt.endTime,
        remainingTime: attempt.remainingTime
      }));

      // Navigate to problems page for the event
      navigate(`/student/event/${eventId}/problems`, {
        state: { attemptId: attempt.attemptId }
      });
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to start event";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const status = getEventStatus();
  const isRegistered = registration && registration.registrationStatus === "registered";
  const isPaid = registration && registration.paymentStatus === "paid";
  const requiresPayment = event && event.fee && event.fee > 0;

  // Loading State
  if (loading && !event) {
    return (
      <div className="event-details loading">
        <div className="loader"></div>
        <p>Loading event details...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="event-details error">
        <div className="error-container">
          <h2>Error Loading Event</h2>
          <p>{error}</p>
          <button onClick={() => navigate("/student/events")} className="btn-back">
            ← Back to Events
          </button>
        </div>
      </div>
    );
  }

  // No Event State
  if (!event) {
    return (
      <div className="event-details not-found">
        <div className="not-found-container">
          <h2>Event Not Found</h2>
          <p>The event you're looking for doesn't exist.</p>
          <button onClick={() => navigate("/student/events")} className="btn-back">
            ← Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="event-details">
      {/* Header */}
      <div className="header">
        <button onClick={() => navigate("/student/events")} className="btn-back">
          ← Back to Events
        </button>
      </div>

      {/* Main Content */}
      <div className="details-container">
        {/* Event Info Section */}
        <div className="event-info-section">
          <div className="section-header">
            <h1>{event.name || event.title}</h1>
            <span className={`status-badge ${status.toLowerCase()}`}>
              {status}
            </span>
          </div>

          <p className="event-description">{event.description}</p>

          {/* Event Meta Information */}
          <div className="event-meta">
            <div className="meta-row">
              <span className="meta-label">📅 Start Date:</span>
              <span className="meta-value">
                {new Date(event.startDate).toLocaleString()}
              </span>
            </div>
            <div className="meta-row">
              <span className="meta-label">⏱️ End Date:</span>
              <span className="meta-value">
                {new Date(event.endDate).toLocaleString()}
              </span>
            </div>
            {event.venue && (
              <div className="meta-row">
                <span className="meta-label">📍 Venue:</span>
                <span className="meta-value">{event.venue}</span>
              </div>
            )}
            {requiresPayment && (
              <div className="meta-row fee">
                <span className="meta-label">💰 Registration Fee:</span>
                <span className="meta-value">₹{event.fee}</span>
              </div>
            )}
            {event.prizeMoney && (
              <div className="meta-row prize">
                <span className="meta-label">🏆 Prize Money:</span>
                <span className="meta-value">₹{event.prizeMoney}</span>
              </div>
            )}
          </div>

          {/* Registration Status */}
          <div className="registration-status">
            <h3>Registration Status</h3>
            {isRegistered ? (
              <div className="status-box registered">
                <div className="status-icon">✓</div>
                <div className="status-text">
                  <p className="status-title">Registered Successfully</p>
                  <p className="status-detail">You are registered for this event</p>
                  {requiresPayment && !isPaid && (
                    <p className="status-warning">⚠️ Payment pending</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="status-box not-registered">
                <div className="status-icon">ℹ️</div>
                <div className="status-text">
                  <p className="status-title">Not Registered</p>
                  <p className="status-detail">
                    {status === "Completed"
                      ? "This event has ended"
                      : "Register to participate in this event"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            {status === "Upcoming" && !isRegistered && (
              <button
                className="btn btn-primary btn-lg"
                onClick={handleRegister}
                disabled={registering}
              >
                {registering ? "Registering..." : "Register for Event"}
              </button>
            )}

            {isRegistered && status === "Upcoming" && requiresPayment && !isPaid && (
              <button
                className="btn btn-warning btn-lg"
                onClick={() => setShowPaymentForm(true)}
                disabled={processingPayment}
              >
                {processingPayment ? "Processing..." : "Complete Payment"}
              </button>
            )}

            {isRegistered && status === "Ongoing" && (!requiresPayment || isPaid) && (
              <button
                className="btn btn-success btn-lg"
                onClick={() => setShowConfirm(true)}
                disabled={loading}
              >
                {loading ? "Starting..." : "Start Event"}
              </button>
            )}

            {status === "Completed" && (
              <button className="btn btn-secondary btn-lg" disabled>
                Event Completed
              </button>
            )}
          </div>
        </div>

        {/* Problems Section */}
        {problems.length > 0 && (
          <div className="problems-section">
            <h2>Problems in This Event ({problems.length})</h2>
            <div className="problems-list">
              {problems.map((problem) => (
                <div key={problem._id} className="problem-item">
                  <div className="problem-header">
                    <h4>{problem.title || problem.name}</h4>
                    <span className={`difficulty-badge difficulty-${problem.level || problem.difficulty}`}>
                      {(problem.level || problem.difficulty || "Medium").toUpperCase()}
                    </span>
                  </div>
                  <p className="problem-description">
                    {problem.description?.substring(0, 100)}
                    {problem.description?.length > 100 ? "..." : ""}
                  </p>
                  <div className="problem-meta">
                    {problem.score && (
                      <span className="score">⭐ {problem.score} points</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Start Event Confirmation Modal */}
      {showConfirm && (
        <ConfirmDialog
          isOpen={showConfirm}
          title="Start Event"
          message="Are you ready to start this event? Once you start, the timer will begin."
          onConfirm={handleStartEvent}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {/* Payment Modal */}
      {showPaymentForm && (
        <Modal
          isOpen={showPaymentForm}
          onClose={() => setShowPaymentForm(false)}
          title="Complete Payment"
        >
          <div className="modal-content payment-form">
            <div className="payment-info">
              <p className="info-label">Event:</p>
              <p className="info-value">{event.name}</p>

              <p className="info-label">Amount to Pay:</p>
              <p className="info-value amount">₹{event.fee}</p>
            </div>

            <div className="payment-methods">
              <p className="methods-label">Select Payment Method:</p>
              <button
                className="payment-method-btn"
                onClick={handlePayment}
                disabled={processingPayment}
              >
                💳 Pay via PayU
              </button>
              <button
                className="payment-method-btn"
                onClick={() => {
                  alert("UPI payment coming soon");
                }}
              >
                📱 Pay via UPI (Coming Soon)
              </button>
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowPaymentForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StudentEventDetails;
