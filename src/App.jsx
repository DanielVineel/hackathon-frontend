// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { getRole, isAuthenticated } from "./utils/auth";

// ====== Student Pages ======
import StudentRoutes from "./pages/StudentMain";

// ====== Manager Pages ======
import ManagerRoutes from "./pages/ManagerMain";

// ====== Superadmin Pages ======
import SuperAdminRoutes from "./pages/SuperAdminMain";

import StudentLogin from "./pages/auth/student/Login";
import StudentSignup from "./pages/auth/student/Signup";
import ManagerLogin from "./pages/auth/manager/Login";
import ManagerSignup from "./pages/auth/manager/Signup";
import SuperAdminLogin from "./pages/auth/superadmin/Login";
import SuperAdminSignup from "./pages/auth/superadmin/Signup";

import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/auth/student/login" element={<StudentLogin />} />
        <Route path="/auth/student/signup" element={<StudentSignup />} />

        <Route path="/auth/manager/login" element={<ManagerLogin />} />
        <Route path="/auth/manager/signup" element={<ManagerSignup />} />

        <Route path="/auth/superadmin/login" element={<SuperAdminLogin />} />
        <Route path="/auth/superadmin/signup" element={<SuperAdminSignup />} />

        {/* ===== Student Routes ===== */}
        <Route path="/student/*" element={<StudentRoutes />} />
        
        {/* manager routes */}
        <Route path="/manager/*" element={<ManagerRoutes />} />
       

        {/* ===== Superadmin Routes ===== */}
        <Route path="/superadmin/*" element={<SuperAdminRoutes />} />
        

        {/* ===== Default Route ===== */}
        <Route path="*" element={<Home />}/>
      </Routes>
    </Router>
  );
}

export default App;