import React, { useEffect, useState } from "react";
// import {
//   getProfile,
//   updateProfile,
//   updatePassword,
//   getPlatformSettings,
//   updatePlatformSettings,
//  } from "../../services/api";

const Settings = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [platform, setPlatform] = useState({
    platformName: "",
    supportEmail: "",
    defaultFee: "",
  });

  const [loading, setLoading] = useState(false);

  // Fetch data
  useEffect(() => {
    fetchProfile();
    fetchPlatformSettings();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPlatformSettings = async () => {
    try {
      const res = await getPlatformSettings();
      setPlatform(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle change
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePlatformChange = (e) => {
    setPlatform({ ...platform, [e.target.name]: e.target.value });
  };

  // Save profile
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profile);
      alert("Profile updated");
    } catch (err) {
      console.error(err);
    }
  };

  // Change password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePassword(passwordData);
      setPasswordData({ oldPassword: "", newPassword: "" });
      alert("Password updated");
    } catch (err) {
      console.error(err);
    }
  };

  // Save platform settings
  const handlePlatformSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePlatformSettings(platform);
      alert("Platform settings updated");
    } catch (err) {
      console.error(err);
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