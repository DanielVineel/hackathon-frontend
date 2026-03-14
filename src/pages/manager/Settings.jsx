import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { getToken } from "../../utils/auth";

const Settings = () => {
  const [user, setUser] = useState({ name: "", phone: "", email: "", dp: "" });
  const token = getToken();

  useEffect(() => {
    API.get("/manager/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setUser(res.data))
      .catch((err) => console.log(err));
  }, [token]);

  const handleSave = () => {
    API.put("/manager/profile", user, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => alert("Profile updated"))
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <h2>Settings</h2>
      <input
        className="form-control mb-1"
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
      />
      <input
        className="form-control mb-1"
        value={user.phone}
        onChange={(e) => setUser({ ...user, phone: e.target.value })}
      />
      <input className="form-control mb-1" value={user.email} disabled />
      <input
        className="form-control mb-1"
        value={user.dp}
        onChange={(e) => setUser({ ...user, dp: e.target.value })}
      />
      <button className="btn btn-success mt-2" onClick={handleSave}>
        Save
      </button>
    </div>
  );
};

export default Settings;