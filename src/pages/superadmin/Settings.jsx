import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useTheme } from "../../context/ThemeContext";
import "../../styles/theme.css";

const Settings = () => {
  const { theme } = useTheme();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [securityData, setSecurityData] = useState({
    twoFactorEnabled: false,
    loginNotifications: true,
    sessionTimeout: 30,
  });

  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch profile data
  useEffect(() => {
    fetchProfile();
    fetchSecuritySettings();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await API.get("/auth/profile");
      setProfile(res.data?.data || res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchSecuritySettings = async () => {
    try {
      const res = await API.get("/auth/security-settings");
      setSecurityData(res.data?.data || {});
    } catch (err) {
      console.error("Error fetching security settings:", err);
    }
  };

  // Handle input changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
    setError(null);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    setError(null);
  };

  const handleSecurityChange = (e) => {
    const { name, type, checked, value } = e.target;
    setSecurityData({
      ...securityData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Save profile
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const res = await API.put("/auth/profile", profile);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaveLoading(false);
    }
  };

  // Change password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setSaveLoading(true);
    try {
      await API.post("/auth/change-password", {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      setSuccess("Password changed successfully!");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setError(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setSaveLoading(false);
    }
  };

  // Save security settings
  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      await API.put("/auth/security-settings", securityData);
      setSuccess("Security settings updated successfully!");
      setError(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update security settings");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Settings</h2>

      {/* Profile */}
      <div className="card p-3 mt-3">
        <h5>Profile Settings</h5>
        <form onSubmit={handleProfileSubmit}>
          <input
            type="text"
            name="name"
            className="form-control mb-2"
            value={profile.name}
            onChange={handleProfileChange}
            placeholder="Name"
          />

          <input
            type="email"
            name="email"
            className="form-control mb-2"
            value={profile.email}
            disabled
          />

          <button className="btn btn-primary">Update Profile</button>
        </form>
      </div>

      {/* Password */}
      <div className="card p-3 mt-3">
        <h5>Change Password</h5>
        <form onSubmit={handlePasswordSubmit}>
          <input
            type="password"
            name="oldPassword"
            className="form-control mb-2"
            value={passwordData.oldPassword}
            onChange={handlePasswordChange}
            placeholder="Old Password"
          />

          <input
            type="password"
            name="newPassword"
            className="form-control mb-2"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            placeholder="New Password"
          />

          <button className="btn btn-warning">Change Password</button>
        </form>
      </div>

      {/* Platform Settings */}
      <div className="card p-3 mt-3">
        <h5>Platform Settings</h5>
        <form onSubmit={handlePlatformSubmit}>
          <input
            type="text"
            name="platformName"
            className="form-control mb-2"
            value={platform.platformName}
            onChange={handlePlatformChange}
            placeholder="Platform Name"
          />

          <input
            type="email"
            name="supportEmail"
            className="form-control mb-2"
            value={platform.supportEmail}
            onChange={handlePlatformChange}
            placeholder="Support Email"
          />

          <input
            type="number"
            name="defaultFee"
            className="form-control mb-2"
            value={platform.defaultFee}
            onChange={handlePlatformChange}
            placeholder="Default Event Fee"
          />

          <button className="btn btn-success">
            Save Platform Settings
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;