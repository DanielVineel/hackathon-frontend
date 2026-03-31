import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { saveAuth, USER_TYPES } from "../../../utils/auth";
import API from "../../../api/api";
import { useGlobalLoader } from "../../../hooks/useLoading";
import "../styles/Auth.css";

const StudentSignup = () => {
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useGlobalLoader();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    status: "student",
    latestOrganization: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const validateStep1 = () => {
    if (!formData.firstName?.trim()) {
      setError("First name is required");
      return false;
    }
    if (!formData.lastName?.trim()) {
      setError("Last name is required");
      return false;
    }
    if (!formData.dateOfBirth) {
      setError("Date of birth is required");
      return false;
    }
    if (!formData.latestOrganization?.trim()) {
      setError("Organization is required");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.email?.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.phone?.trim()) {
      setError("Phone number is required");
      return false;
    }
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      setError("Please enter a valid phone number");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (!/[A-Z]/.test(formData.password)) {
      setError("Password must contain at least one uppercase letter");
      return false;
    }
    if (!/[0-9]/.test(formData.password)) {
      setError("Password must contain at least one number");
      return false;
    }
    if (!formData.confirmPassword) {
      setError("Please confirm your password");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) return;

    setLoading(true);
    setError("");
    showLoader("Creating account...");

    try {
      const signupData = { ...formData };
      delete signupData.confirmPassword;

      const res = await API.post("/auth/signup/student", signupData);
      
      if (res.data?.success) {
        const { accessToken, refreshToken, user } = res.data;

        // Verify user role
        if (user.role !== USER_TYPES.STUDENT) {
          setError("Account creation failed: Invalid role assigned");
          return;
        }

        // Auto-login after signup
        saveAuth(USER_TYPES.STUDENT, {
          token: accessToken,
          refreshToken: refreshToken || "",
          user
        });

        navigate("/student/dashboard");
      } else {
        setError(res.data?.message || "Signup failed");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Signup failed. Please try again.";
      setError(errorMessage);
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card auth-card-wide">
        {/* Header */}
        <div className="auth-header">
          <h2>Create Student Account</h2>
          <p className="subtitle">Join our coding community and start solving challenges</p>
          <div className="step-indicator">
            <div className={`step ${step >= 1 ? "active" : ""}`}>1. Personal Info</div>
            <div className={`step ${step >= 2 ? "active" : ""}`}>2. Account Details</div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span>⚠️ {error}</span>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={step === 1 ? (e) => { e.preventDefault(); handleNextStep(); } : handleSignup} className="auth-form">
          
          {/* STEP 1: Personal Information */}
          {step === 1 && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <div className="input-wrapper">
                    <span className="input-icon">👤</span>
                    <input
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={loading}
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <div className="input-wrapper">
                    <span className="input-icon">👤</span>
                    <input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={loading}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="dateOfBirth">Date of Birth</label>
                  <div className="input-wrapper">
                    <span className="input-icon">📅</span>
                    <input
                      id="dateOfBirth"
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      disabled={loading}
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="status">Current Status</label>
                  <div className="input-wrapper">
                    <span className="input-icon">💼</span>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      disabled={loading}
                      className="form-input"
                    >
                      <option value="student">Student</option>
                      <option value="employed">Employed</option>
                      <option value="unemployed">Unemployed</option>
                      <option value="freelancer">Freelancer</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="latestOrganization">Organization/School</label>
                <div className="input-wrapper">
                  <span className="input-icon">🏢</span>
                  <input
                    id="latestOrganization"
                    name="latestOrganization"
                    placeholder="Your current organization or school"
                    value={formData.latestOrganization}
                    onChange={handleChange}
                    disabled={loading}
                    className="form-input"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="submit-btn"
              >
                Next Step →
              </button>
            </>
          )}

          {/* STEP 2: Account Details */}
          {step === 2 && (
            <>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">✉️</span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <div className="input-wrapper">
                  <span className="input-icon">📱</span>
                  <input
                    id="phone"
                    name="phone"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 8 characters"
                    value={formData.password}
                    onChange={handleChange}
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
                  </small>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
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

              <div className="form-actions">
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="submit-btn btn-secondary"
                >
                  ← Back
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="submit-btn"
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span> Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </>
          )}
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/auth/student/login">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentSignup;
