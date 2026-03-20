import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import StudentLayout from "../layouts/StudentLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";

// ===== Student Pages =====
import StudentDashboard from "./student/Dashboard";
import Events from "./common/Events";
import EventDetails from "./common/EventDetails";
import Problems from "./common/Problems";
import Certificates from "./student/Certificates";
import EventHistory from "./student/EventHistory";
import ProblemHistory from "./student/ProblemHistory";
import PaymentHistory from "./student/PaymentHistory";
import StudentSettings from "./student/Settings";
const StudentRoutes = () => {
  return (
    <Routes>

      <Route
        element={
          <ProtectedRoute role="student">
            <StudentLayout />
          </ProtectedRoute>
        }
      >

        {/* Default redirect */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* ===== Student Routes ===== */}
        <Route path="dashboard" element={<StudentDashboard />} />

        <Route path="events" element={<Events />} />

        <Route path="events/:id" element={<EventDetails />} />

        <Route path="problems" element={<Problems />} />

        <Route path="certificates" element={<Certificates />} />

        <Route path="event-history" element={<EventHistory />} />

        <Route path="problem-history" element={<ProblemHistory />} />

        <Route path="payment-history" element={<PaymentHistory />} />

        <Route path="settings" element={<StudentSettings />} />

      </Route>

    </Routes>
  );
};

export default StudentRoutes;