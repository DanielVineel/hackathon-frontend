import React, { useEffect, useState } from "react";
import API from "../../api/api";

const Settings = () => {
  const [user, setUser] = useState({ name: "", phone: "", dp: "", email: "" });

  useEffect(() => {
    API.get("/student/profile")
      .then(res => setUser(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleSave = () => {
    API.put("/student/profile", user)
      .then(res => alert("Profile updated"))
      .catch(err => console.log(err));
  };

  return (
    <div>
      <h2>Settings</h2>
      <div className="mb-2">
        <label>Name:</label>
        <input className="form-control" value={user.name} onChange={e => setUser({...user, name:e.target.value})}/>
      </div>
      <div className="mb-2">
        <label>Phone:</label>
        <input className="form-control" value={user.phone} onChange={e => setUser({...user, phone:e.target.value})}/>
      </div>
      <div className="mb-2">
        <label>Email (cannot change):</label>
        <input className="form-control" value={user.email} disabled/>
      </div>
      <div className="mb-2">
        <label>Profile Picture URL:</label>
        <input className="form-control" value={user.dp} onChange={e => setUser({...user, dp:e.target.value})}/>
      </div>
      <button className="btn btn-success mt-2" onClick={handleSave}>Save</button>
    </div>
  );
};

export default Settings;