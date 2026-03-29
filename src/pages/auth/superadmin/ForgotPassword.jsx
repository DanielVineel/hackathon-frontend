import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../../api/api";
import "../styles/Auth.css";

const SuperAdminForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);

  // Countdown timer for OTP resend
  React.useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!email?.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await API.post("/auth/forgot-password/superadmin", { email });
      
      if (res.data?.success) {
        setOtpSent(true);
        setStep(2);
        setSuccess("OTP sent to your email address");
        setTimer(60);
      } else {
        setError(res.data?.message || "Failed to send OTP");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to send OTP. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await API.post("/auth/forgot-password/superadmin", { email });
      
      if (res.data?.success) {
        setSuccess("OTP resent successfully");
        setTimer(60);
      } else {
        setError(res.data?.message || "Failed to resend OTP");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to resend OTP";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp?.trim()) {
      setError("Please enter the OTP");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await API.post("/auth/verify-otp/superadmin", { email, otp });
      
      if (res.data?.success) {
        setStep(3);
        setSuccess("Email verified successfully");
      } else {
        setError(res.data?.message || "Invalid OTP");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "OTP verification failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (!newPassword) {
      setError("Please enter a new password");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setError("Password must contain at least one uppercase letter");
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      setError("Password must contain at least one number");
      return;
    }

    if (!/[!@#$%^&*]/.test(newPassword)) {
      setError("Password must contain at least one special character (!@#$%^&*)");
      return;
    }

    if (!confirmPassword) {
      setError("Please confirm your password");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await API.post("/auth/reset-password/superadmin", {
        email,
        otp,
        newPassword
      });
      
      if (res.data?.success) {
        setSuccess("Password reset successfully! Redirecting to login...");
        setTimeout(() => navigate("/auth/superadmin/login"), 2000);
      } else {
        setError(res.data?.message || "Failed to reset password");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Password reset failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="role-badge superadmin-badge">👑 Super Admin</div>
          <h2>Admin Account Recovery</h2>
          <p className="subtitle">Secure password reset procedure</p>
          <div className="step-indicator">
            <div className={`step ${step >= 1 ? "active" : ""}`}>1. Email</div>
            <div className={`step ${step >= 2 ? "active" : ""}`}>2. Verify</div>
            <div className={`step ${step >= 3 ? "active" : ""}`}>3. Reset</div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span>⚠️ {error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="success-message">
            <span>✓ {success}</span>
          </div>
        )}

        {/* STEP 1: Email Entry */}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Administrator Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">✉️</span>
                <input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  disabled={loading}
                  className="form-input"
                />
              </div>
              <small className="helper-text">
                Enter the email address associated with your administrator account
              </small>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="submit-btn"
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Sending OTP...
                </>
              ) : (
                "Send OTP"
              )}
            </button>
          </form>
        )}

        {/* STEP 2: OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="otp">One-Time Password (OTP)</label>
              <p className="helper-text">
                Enter the 6-digit code sent to <strong>{email}</strong>
              </p>
              <div className="input-wrapper">
                <span className="input-icon">🔐</span>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  placeholder="000000"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setOtp(val);
                    if (error) setError("");
                  }}
                  disabled={loading}
                  className="form-input otp-input"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="submit-btn"
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </button>

            <div className="otp-actions">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={timer > 0 || loading}
                className="btn-resend"
              >
                {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtp("");
                  setOtpSent(false);
                }}
                className="btn-change-email"
              >
                Use different email
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: New Password */}
        {step === 3 && (
          <form onSubmit={handlePasswordReset} className="auth-form">
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (error) setError("");
                  }}
                  disabled={loading}
                  className="form-input"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              <div className="password-requirements">
                <small>
                  ✓ At least 8 characters
                  <br />
                  ✓ One uppercase letter
                  <br />
                  ✓ One number
                  <br />
                  ✓ One special character (!@#$%^&*)
                </small>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError("");
                  }}
                  disabled={loading}
                  className="form-input"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex="-1"
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="submit-btn"
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Resetting Password...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="auth-footer">
          <p>
            <Link to="/auth/superadmin/login">
              Back to Login
            </Link>
          </p>
          <p className="warning-text">
            ⚠️ This action is being monitored for security purposes
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminForgotPassword;
