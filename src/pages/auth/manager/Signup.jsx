import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { saveAuth, USER_TYPES } from "../../../utils/auth";
import API from "../../../api/api";
import "../styles/Auth.css";

const ManagerSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    latestOrganization: "",
    password: "",
    confirmPassword: "",
    department: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.name?.trim()) {
      setError("Full name is required");
      return false;
    }
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
    if (!formData.latestOrganization?.trim()) {
      setError("Organization is required");
      return false;
    }
    if (!formData.department?.trim()) {
      setError("Department is required");
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

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const signupData = { ...formData };
      delete signupData.confirmPassword;

      const res = await API.post("/auth/signup/manager", signupData);
      
      if (res.data?.success) {
        const { accessToken, refreshToken, user } = res.data;

        // Verify user role
        if (user.role !== USER_TYPES.MANAGER) {
          setError("Account creation failed: Invalid role assigned");
          return;
        }

        // Auto-login after signup
        saveAuth(USER_TYPES.MANAGER, {
          token: accessToken,
          refreshToken: refreshToken || "",
          user
        });

        navigate("/manager/dashboard");
      } else {
        setError(res.data?.message || "Signup failed");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Signup failed";
      setError(errorMessage);
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card auth-card-wide">
        {/* Header */}
        <div className="auth-header">
          <div className="role-badge manager-badge">👔 Manager</div>
          <h2>Manager Access Request</h2>
          <p className="subtitle">Complete your profile to request manager access</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span>⚠️ {error}</span>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                  className="form-input"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="department">Department</label>
              <div className="input-wrapper">
                <span className="input-icon">🏛️</span>
                <input
                  id="department"
                  name="department"
                  placeholder="Your department"
                  value={formData.department}
                  onChange={handleChange}
                  disabled={loading}
                  className="form-input"
                />
              </div>
            </div>
          </div>

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

          <div className="form-row">
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
              <label htmlFor="latestOrganization">Organization</label>
              <div className="input-wrapper">
                <span className="input-icon">🏢</span>
                <input
                  id="latestOrganization"
                  name="latestOrganization"
                  placeholder="Your organization"
                  value={formData.latestOrganization}
                  onChange={handleChange}
                  disabled={loading}
                  className="form-input"
                />
              </div>
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

          <button 
            type="submit" 
            disabled={loading}
            className="submit-btn"
          >
            {loading ? (
              <>
                <span className="spinner"></span> Processing...
              </>
            ) : (
              "Request Manager Access"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/auth/manager/login">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManagerSignup;
