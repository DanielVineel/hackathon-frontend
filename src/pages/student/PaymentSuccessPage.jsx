import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";
import "../styles/student/PaymentSuccess.css";

/**
 * Payment Success Page
 * Shown after successful payment
 */
const PaymentSuccessPage = () => {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    if (transactionId) {
      fetchTransactionDetails();
    }
  }, [transactionId]);

  const fetchTransactionDetails = async () => {
    try {
      setLoading(true);
      
      // Get transaction details from location state or API
      const state = window.history.state;
      if (state?.transaction) {
        setTransaction(state.transaction);
        setEvent(state.event);
      }
    } catch (err) {
      console.error("Error fetching transaction:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Processing...</div>;
  }

  return (
    <div className="payment-success-page">
      <div className="success-container">
        {/* Success Icon */}
        <div className="success-icon">✓</div>

        {/* Success Message */}
        <h1 className="success-title">Payment Successful!</h1>
        <p className="success-subtitle">
          Your registration fee has been processed successfully.
        </p>

        {/* Transaction Details */}
        {transaction && (
          <div className="transaction-details">
            <div className="detail-row">
              <span className="detail-label">Transaction ID:</span>
              <span className="detail-value">{transaction.internalTxnId}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Amount Paid:</span>
              <span className="detail-value highlight">₹{transaction.amount}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Payment Method:</span>
              <span className="detail-value">{transaction.paymentMethod || "Card"}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Date & Time:</span>
              <span className="detail-value">
                {new Date(transaction.createdAt).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className="detail-value status-badge success">
                {transaction.status}
              </span>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="next-steps">
          <h3>What's Next?</h3>
          <ul>
            <li>✓ Your registration is confirmed</li>
            <li>📧 Confirmation email has been sent</li>
            <li>📋 You can view event details anytime</li>
            <li>🏆 Participate & earn points!</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            className="btn-primary"
            onClick={() => navigate("/student/events")}
          >
            📋 View All Events
          </button>
          <button
            className="btn-secondary"
            onClick={() => {
              if (transaction?.eventId) {
                navigate(`/student/event/${transaction.eventId}`);
              }
            }}
          >
            🔍 View Event Details
          </button>
          <button
            className="btn-outline"
            onClick={() => navigate("/student/dashboard")}
          >
            🏠 Go to Dashboard
          </button>
        </div>

        {/* Receipt */}
        <div className="receipt-section">
          <button className="btn-receipt">🖨️ Download Receipt</button>
          <button className="btn-receipt">📧 Email Receipt</button>
        </div>
      </div>

      {/* Support Info */}
      <div className="support-info">
        <p>
          Need help? <a href="/support">Contact Support</a> or email us at{" "}
          <a href="mailto:support@example.com">support@example.com</a>
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
