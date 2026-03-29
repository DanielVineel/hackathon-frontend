import React, { useState, useEffect } from "react";
import API from "../../api/api";
import { getCurrentAuth, saveAuth } from "../../utils/blutoAuth.js";

const StudentProfile = () => {
  const { user } = getCurrentAuth();
  const [profile, setProfile] = useState(user);
  const [editing, setEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const res = await API.put("/student/profile", profile);
      alert("Profile updated successfully!");
      saveAuth(res.data?.data, getCurrentAuth()?.tokens);
      setEditing(false);
    } catch (err) {
      alert("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    try {
      setLoading(true);
      await API.post("/student/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      alert("Password changed successfully!");
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Error changing password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-profile">
      <h1>My Profile</h1>

      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {profile?.firstName?.charAt(0)}
          </div>
          <div className="profile-info">
            <h2>{profile?.firstName} {profile?.lastName}</h2>
            <p>{profile?.email}</p>
          </div>
          <button
            className="btn-edit"
            onClick={() => setEditing(!editing)}
          >
            {editing ? "Cancel" : "✏️ Edit"}
          </button>
        </div>

        {editing ? (
          <div className="profile-form">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={profile?.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={profile?.lastName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={profile?.email}
                disabled
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={profile?.phone || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>School/College</label>
              <input
                type="text"
                name="schoolCollege"
                value={profile?.schoolCollege || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Grade/Year</label>
              <input
                type="text"
                name="gradeYear"
                value={profile?.gradeYear || ""}
                onChange={handleInputChange}
              />
            </div>
            <button
              className="btn-submit"
              onClick={handleUpdateProfile}
              disabled={loading}
            >
              Save Changes
            </button>
          </div>
        ) : (
          <div className="profile-details">
            <p><strong>Email:</strong> {profile?.email}</p>
            <p><strong>Phone:</strong> {profile?.phone || "N/A"}</p>
            <p><strong>School/College:</strong> {profile?.schoolCollege || "N/A"}</p>
            <p><strong>Grade/Year:</strong> {profile?.gradeYear || "N/A"}</p>
            <p><strong>Member Since:</strong> {new Date(profile?.createdAt).toLocaleDateString()}</p>
          </div>
        )}
      </div>

      <div className="security-section">
        <h3>Security</h3>
        <button className="btn-change-password" onClick={() => setShowPasswordModal(true)}>
          🔐 Change Password
        </button>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Change Password</h2>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="modal-actions">
              <button className="btn-submit" onClick={handleChangePassword} disabled={loading}>
                Change Password
              </button>
              <button className="btn-cancel" onClick={() => setShowPasswordModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;
