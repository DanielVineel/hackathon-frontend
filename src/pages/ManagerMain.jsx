import React from "react";
import { Routes, Route } from "react-router-dom";
import ManagerLayout from "../layouts/ManagerLayout";

import Dashboard from "../pages/manager/Dashboard";
import Events from "./manager/Events";
import Problems from "./manager/Problems";
import Analytics from "./manager/Analytics";
import Submissions from "./manager/Submissions";
import Certificates from "./manager/Certificates";
import Settings from "./manager/Settings";
import Leaderboard from "./manager/Leaderboard";
import Registrations from "./manager/Registrations";

import ProtectedRoute from "../components/common/ProtectedRoute";

const ManagerRoutes = () => {
  return (
    <Routes>
      <Route element={<ManagerLayout />}>

        <Route
          path="dashboard"
          element={
            <ProtectedRoute role="manager">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="events"
          element={
            <ProtectedRoute role="manager">
              <Events />
            </ProtectedRoute>
          }
        />

        <Route
          path="problems"
          element={
            <ProtectedRoute role="manager">
              <Problems />
            </ProtectedRoute>
          }
        />

        <Route
          path="analytics"
          element={
            <ProtectedRoute role="manager">
              <Analytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="submissions"
          element={
            <ProtectedRoute role="manager">
              <Submissions />
            </ProtectedRoute>
          }
        />

        <Route
          path="certificates"
          element={
            <ProtectedRoute role="manager">
              <Certificates />
            </ProtectedRoute>
          }
        />

        <Route
          path="settings"
          element={
            <ProtectedRoute role="manager">
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="leaderboard/:eventId"
          element={
            <ProtectedRoute role="manager">
              <Leaderboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="registrations/:eventId"
          element={
            <ProtectedRoute role="manager">
              <Registrations />
            </ProtectedRoute>
          }
        />

      </Route>
    </Routes>
  );
};

export default ManagerRoutes;