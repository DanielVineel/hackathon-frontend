// src/pages/student/StudentRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../../components/common/ProtectedRoute";
import Dashboard from "./Dashboard";
import Events from "./Events";
import EventDetails from "./EventDetails";
import Problems from "./Problems";
import Certificates from "./Certificates";
import EventHistory from "./EventHistory";
import ProblemHistory from "./ProblemHistory";
import Settings from "./Settings";
import PaymentHistory from "./PaymentHistory";
import NotFound from "../NotFound";

const StudentRoutes = () => {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Events />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/:id"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <EventDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/problems"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Problems />
          </ProtectedRoute>
        }
      />
      <Route
        path="/certificates"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Certificates />
          </ProtectedRoute>
        }
      />
      <Route
        path="/event-history"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <EventHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/problem-history"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <ProblemHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment-history"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <PaymentHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default StudentRoutes;