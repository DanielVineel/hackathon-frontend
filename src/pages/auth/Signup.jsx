// src/pages/auth/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    API.post("/auth/signup", { name, email, password })
      .then(() => { alert("Account created"); navigate("/login"); })
      .catch(err=>alert(err.response?.data?.message || "Signup failed"));
  };

  return (
    <div className="container mt-5">
      <h2>Signup</h2>
      <input className="form-control mb-2" placeholder="Name" value={name} onChange={e=>setName(e.target.value)}/>
      <input className="form-control mb-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
      <input type="password" className="form-control mb-2" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/>
      <button className="btn btn-success" onClick={handleSignup}>Create Account</button>
    </div>
  );
};

export default Signup;