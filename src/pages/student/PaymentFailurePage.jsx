import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";
import "../styles/student/PaymentFailure.css";

/**
 * Payment Failure Page
 * Shown when payment fails
 */
const PaymentFailurePage = () => {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);

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
        setError(state.error || "Payment could not be processed");
      }
    } catch (err) {
      console.error("Error fetching transaction:", err);
      setError("Unable to fetch transaction details");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async () => {
    try {
      setRetrying(true);
      
      // Redirect to payment page to retry
      if (transaction?.eventId) {
        navigate(`/payment/${transaction.eventId}`, {
          state: {
            retryTransactionId: transaction._id,
            amount: transaction.amount,
            eventId: transaction.eventId
          }
        });
      }
    } catch (err) {
      alert("Could not initiate retry payment");
    } finally {
      setRetrying(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="payment-failure-page">
      <div className="failure-container">
        {/* Failure Icon */}
        <div className="failure-icon">✗</div>

        {/* Failure Message */}
        <h1 className="failure-title">Payment Failed</h1>
        <p className="failure-subtitle">
          We couldn't process your payment. Please try again.
        </p>

        {/* Error Details */}
        <div className="error-details">
          <div className="error-message">
            <strong>Error:</strong> {error || "Payment processing failed"}
          </div>

          {transaction && (
            <div className="transaction-summary">
              <h3>Transaction Summary</h3>
              <div className="summary-row">
                <span>Transaction ID:</span>
                <span className="mono">{transaction.internalTxnId}</span>
              </div>
              <div className="summary-row">
                <span>Amount:</span>
                <span className="amount">₹{transaction.amount}</span>
              </div>
              <div className="summary-row">
                <span>Date:</span>
                <span>{new Date(transaction.createdAt).toLocaleString("en-IN")}</span>
              </div>
              <div className="summary-row">
                <span>Status:</span>
                <span className="status-badge failed">{transaction.status}</span>
              </div>
              {transaction.failureReason && (
                <div className="summary-row">
                  <span>Reason:</span>
                  <span className="reason">{transaction.failureReason}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Common Issues */}
        <div className="common-issues">
          <h3>Common Reasons for Payment Failure:</h3>
          <ul>
            <li>💳 Incorrect card details</li>
            <li>⏱️ Payment gateway timeout</li>
            <li>🚫 Insufficient funds</li>
            <li>🔒 Blocked by your bank</li>
            <li>🌐 Network connectivity issue</li>
            <li>📅 Card expired or invalid</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            className="btn-primary"
            onClick={handleRetry}
            disabled={retrying}
          >
            {retrying ? "Processing..." : "🔄 Try Again"}
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigate("/student/events")}
          >
            📋 Browse Events
          </button>
          <button
            className="btn-outline"
            onClick={() => navigate("/student/dashboard")}
          >
            🏠 Go to Dashboard
          </button>
        </div>

        {/* Alternative Payment Methods */}
        <div className="alternatives">
          <h3>Alternative Options:</h3>
          <p>Try paying with a different payment method:</p>
          <div className="payment-methods">
            <button className="method-card" disabled>
              💳 Credit/Debit Card
            </button>
            <button className="method-card" disabled>
              📱 UPI
            </button>
            <button className="method-card" disabled>
              🏦 Net Banking
            </button>
          </div>
        </div>
      </div>

      {/* Support Section */}
      <div className="support-section">
        <h3>Still having issues?</h3>
        <p>
          Contact our support team: <a href="mailto:support@example.com">support@example.com</a>
        </p>
        <p>
          Or <a href="/support">view our help documentation</a>
        </p>
      </div>
    </div>
  );
};

export default PaymentFailurePage;
