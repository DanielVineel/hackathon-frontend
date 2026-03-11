// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { getRole, isAuthenticated } from "./utils/auth";

// ====== Student Pages ======
import StudentDashboard from "./pages/student/Dashboard";
import Events from "./pages/student/Events";
import EventDetails from "./pages/student/EventDetails";
import Problems from "./pages/student/Problems";
import Certificates from "./pages/student/Certificates";
import EventHistory from "./pages/student/EventHistory";
import ProblemHistory from "./pages/student/ProblemHistory";
import PaymentHistory from "./pages/student/PaymentHistory";
import StudentSettings from "./pages/student/Settings";

// ====== Manager Pages ======
import ManagerDashboard from "./pages/manager/Dashboard";
import ManagerEvents from "./pages/manager/Events";
import CreateEvent from "./pages/manager/CreateEvent";
import ManagerProblems from "./pages/manager/Problems";
import ManagerAnalytics from "./pages/manager/Analytics";
import ManagerSettings from "./pages/manager/Settings";

// ====== Superadmin Pages ======
import SuperAdminDashboard from "./pages/superadmin/Dashboard";
import Managers from "./pages/superadmin/Managers";
import SuperAdminEvents from "./pages/superadmin/Events";
import SuperAdminProblems from "./pages/superadmin/Problems";
import SuperAdminAnalytics from "./pages/superadmin/Analytics";



import ProtectedRoute from "./components/common/ProtectedRoute";

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
        <Route path="/student/dashboard" element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        }/>
        <Route path="/student/events" element={
          <ProtectedRoute role="student">
            <Events />
          </ProtectedRoute>
        }/>
        <Route path="/student/events/:id" element={
          <ProtectedRoute role="student">
            <EventDetails />
          </ProtectedRoute>
        }/>
        <Route path="/student/problems" element={
          <ProtectedRoute role="student">
            <Problems />
          </ProtectedRoute>
        }/>
        <Route path="/student/certificates" element={
          <ProtectedRoute role="student">
            <Certificates />
          </ProtectedRoute>
        }/>
        <Route path="/student/event-history" element={
          <ProtectedRoute role="student">
            <EventHistory />
          </ProtectedRoute>
        }/>
        <Route path="/student/problem-history" element={
          <ProtectedRoute role="student">
            <ProblemHistory />
          </ProtectedRoute>
        }/>
        <Route path="/student/payment-history" element={
          <ProtectedRoute role="student">
            <PaymentHistory />
          </ProtectedRoute>
        }/>
        <Route path="/student/settings" element={
          <ProtectedRoute role="student">
            <StudentSettings />
          </ProtectedRoute>
        }/>

        {/* ===== Manager Routes ===== */}
        <Route path="/manager/dashboard" element={
          <ProtectedRoute role="manager">
            <ManagerDashboard />
          </ProtectedRoute>
        }/>
        <Route path="/manager/events" element={
          <ProtectedRoute role="manager">
            <ManagerEvents />
          </ProtectedRoute>
        }/>
        <Route path="/manager/events/create" element={
          <ProtectedRoute role="manager">
            <CreateEvent />
          </ProtectedRoute>
        }/>
        <Route path="/manager/problems" element={
          <ProtectedRoute role="manager">
            <ManagerProblems />
          </ProtectedRoute>
        }/>
        <Route path="/manager/analytics" element={
          <ProtectedRoute role="manager">
            <ManagerAnalytics />
          </ProtectedRoute>
        }/>
        <Route path="/manager/settings" element={
          <ProtectedRoute role="manager">
            <ManagerSettings />
          </ProtectedRoute>
        }/>

        {/* ===== Superadmin Routes ===== */}
        <Route path="/superadmin/dashboard" element={
          <ProtectedRoute role="superadmin">
            <SuperAdminDashboard />
          </ProtectedRoute>
        }/>
        <Route path="/superadmin/managers" element={
          <ProtectedRoute role="superadmin">
            <Managers />
          </ProtectedRoute>
        }/>
        <Route path="/superadmin/events" element={
          <ProtectedRoute role="superadmin">
            <SuperAdminEvents />
          </ProtectedRoute>
        }/>
        <Route path="/superadmin/problems" element={
          <ProtectedRoute role="superadmin">
            <SuperAdminProblems />
          </ProtectedRoute>
        }/>
        <Route path="/superadmin/analytics" element={
          <ProtectedRoute role="superadmin">
            <SuperAdminAnalytics />
          </ProtectedRoute>
        }/>

        {/* ===== Default Route ===== */}
        <Route path="*" element={<Home />}/>
      </Routes>
    </Router>
  );
}

export default App;