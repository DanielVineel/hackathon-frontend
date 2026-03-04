// src/pages/auth/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import { login } from "../../utils/auth";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    API.post("/auth/login", { email, password })
      .then(res => {
        login(res.data.accessToken, res.data.role);
        if(res.data.role==="student") navigate("/student/dashboard");
        else if(res.data.role==="manager") navigate("/manager/dashboard");
        else navigate("/superadmin/dashboard");
      })
      .catch(err => alert(err.response?.data?.message || "Login failed"));
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <input className="form-control mb-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
      <input type="password" className="form-control mb-2" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/>
      <button className="btn btn-primary" onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;