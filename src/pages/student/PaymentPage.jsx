import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import API from "../../api/api";
import "./PaymentPage.css";

/**
 * Standalone Payment Page Component
 * Allows students to complete payment for event registration
 * 
 * Route: /student/payment/:eventId
 * Location State: { eventId, amount, eventName, returnTo }
 */
const PaymentPage = () => {
  const { eventId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Get payment details from location state
  const locationState = location.state || {};
  const { amount, eventName, returnTo = "/student/events" } = locationState;

  // Form states
  const [paymentData, setPaymentData] = useState({
    cardHolderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    email: ""
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState(null);

  // Validation states
  const [validationErrors, setValidationErrors] = useState({});

  /**
   * Validate card number (basic Luhn algorithm)
   */
  const validateCardNumber = (num) => {
    const digits = num.replace(/\D/g, "");
    if (digits.length < 13 || digits.length > 19) return false;
    
    let sum = 0;
    let isEven = false;
    
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i], 10);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  };

  /**
   * Validate card expiry date (MM/YY)
   */
  const validateExpiryDate = (date) => {
    const pattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!pattern.test(date)) return false;
    
    const [month, year] = date.split("/");
    const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
    return expiryDate > new Date();
  };

  /**
   * Validate CVV
   */
  const validateCVV = (cvv) => {
    return /^\d{3,4}$/.test(cvv);
  };

  /**
   * Validate email
   */
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  /**
   * Validate form
   */
  const validateForm = () => {
    const errors = {};

    if (!paymentData.cardHolderName.trim()) {
      errors.cardHolderName = "Cardholder name is required";
    }

    if (!validateCardNumber(paymentData.cardNumber)) {
      errors.cardNumber = "Invalid card number";
    }

    if (!validateExpiryDate(paymentData.expiryDate)) {
      errors.expiryDate = "Invalid expiry date (use MM/YY)";
    }

    if (!validateCVV(paymentData.cvv)) {
      errors.cvv = "Invalid CVV (3-4 digits)";
    }

    if (!validateEmail(paymentData.email)) {
      errors.email = "Invalid email address";
    }

    if (!termsAccepted) {
      errors.terms = "You must accept the terms and conditions";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Format card number input (add spaces every 4 digits)
   */
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s/g, "");
    value = value.replace(/(\d{4})/g, "$1 ").trim();
    setPaymentData({ ...paymentData, cardNumber: value });
  };

  /**
   * Format expiry date input (MM/YY)
   */
  const handleExpiryDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    setPaymentData({ ...paymentData, expiryDate: value });
  };

  /**
   * Handle payment submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Process payment through backend
      const response = await API.post(`/payment/process`, {
        eventId,
        amount: amount || 0,
        paymentMethod: "card",
        cardDetails: {
          holderName: paymentData.cardHolderName,
          cardNumber: paymentData.cardNumber.replace(/\s/g, ""),
          expiryDate: paymentData.expiryDate,
          cvv: paymentData.cvv
        },
        email: paymentData.email
      });

      if (response.data?.success) {
        setSuccess(true);
        setTransactionId(response.data?.transactionId || response.data?.paymentId);

        // Redirect after 2 seconds
        setTimeout(() => {
          navigate(returnTo, { 
            state: { 
              paymentSuccess: true, 
              transactionId: response.data?.transactionId 
            } 
          });
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Payment processing failed. Please try again.");
      console.error("Payment error:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle cancel payment
   */
  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel the payment and return to events?")) {
      navigate(returnTo);
    }
  };

  // Success state
  if (success) {
    return (
      <div className="payment-page success-state">
        <div className="success-container">
          <div className="success-icon">✓</div>
          <h1>Payment Successful!</h1>
          <p className="success-message">
            Your registration for <strong>{eventName}</strong> is confirmed.
          </p>
          {transactionId && (
            <p className="transaction-id">
              Transaction ID: <strong>{transactionId}</strong>
            </p>
          )}
          <div className="success-details">
            <div className="detail-item">
              <span className="label">Event:</span>
              <span className="value">{eventName}</span>
            </div>
            <div className="detail-item">
              <span className="label">Amount Paid:</span>
              <span className="value">₹{amount}</span>
            </div>
            <div className="detail-item">
              <span className="label">Date:</span>
              <span className="value">{new Date().toLocaleString()}</span>
            </div>
          </div>
          <p className="redirect-message">Redirecting you momentarily...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        {/* Header */}
        <div className="payment-header">
          <button className="btn-back" onClick={handleCancel}>
            ← Back to Events
          </button>
          <h1>Complete Payment</h1>
        </div>

        {/* Main Content */}
        <div className="payment-content">
          {/* Order Summary */}
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-item">
              <span className="label">Event</span>
              <span className="value">{eventName || "Event Registration"}</span>
            </div>
            <div className="summary-item">
              <span className="label">Amount</span>
              <span className="value amount">₹{amount || 0}</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-item total">
              <span className="label">Total</span>
              <span className="value">₹{amount || 0}</span>
            </div>
          </div>

          {/* Payment Form */}
          <form className="payment-form" onSubmit={handleSubmit}>
            <h2>Payment Details</h2>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Cardholder Name */}
            <div className="form-group">
              <label htmlFor="cardHolderName">Cardholder Name *</label>
              <input
                id="cardHolderName"
                type="text"
                placeholder="John Doe"
                value={paymentData.cardHolderName}
                onChange={(e) => setPaymentData({ ...paymentData, cardHolderName: e.target.value })}
                className={`form-input ${validationErrors.cardHolderName ? "error" : ""}`}
                disabled={loading}
              />
              {validationErrors.cardHolderName && (
                <span className="error-text">{validationErrors.cardHolderName}</span>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={paymentData.email}
                onChange={(e) => setPaymentData({ ...paymentData, email: e.target.value })}
                className={`form-input ${validationErrors.email ? "error" : ""}`}
                disabled={loading}
              />
              {validationErrors.email && (
                <span className="error-text">{validationErrors.email}</span>
              )}
            </div>

            {/* Card Number */}
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number *</label>
              <input
                id="cardNumber"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={paymentData.cardNumber}
                onChange={handleCardNumberChange}
                className={`form-input ${validationErrors.cardNumber ? "error" : ""}`}
                maxLength="19"
                disabled={loading}
              />
              {validationErrors.cardNumber && (
                <span className="error-text">{validationErrors.cardNumber}</span>
              )}
            </div>

            {/* Expiry and CVV */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="expiryDate">Expiry Date *</label>
                <input
                  id="expiryDate"
                  type="text"
                  placeholder="MM/YY"
                  value={paymentData.expiryDate}
                  onChange={handleExpiryDateChange}
                  className={`form-input ${validationErrors.expiryDate ? "error" : ""}`}
                  maxLength="5"
                  disabled={loading}
                />
                {validationErrors.expiryDate && (
                  <span className="error-text">{validationErrors.expiryDate}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="cvv">CVV *</label>
                <input
                  id="cvv"
                  type="text"
                  placeholder="123"
                  value={paymentData.cvv}
                  onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                  className={`form-input ${validationErrors.cvv ? "error" : ""}`}
                  maxLength="4"
                  disabled={loading}
                />
                {validationErrors.cvv && (
                  <span className="error-text">{validationErrors.cvv}</span>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="form-group checkbox">
              <input
                id="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                disabled={loading}
              />
              <label htmlFor="terms">
                I agree to the terms and conditions and privacy policy *
              </label>
              {validationErrors.terms && (
                <span className="error-text">{validationErrors.terms}</span>
              )}
            </div>

            {/* Security Notice */}
            <div className="security-notice">
              <span className="lock-icon">🔒</span>
              <p>Your payment information is encrypted and secure. We do not store card details.</p>
            </div>

            {/* Action Buttons */}
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading || !termsAccepted}
              >
                {loading ? "Processing..." : `Pay ₹${amount || 0}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
