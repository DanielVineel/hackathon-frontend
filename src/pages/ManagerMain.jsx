import React from "react";
import { Routes, Route } from "react-router-dom";
import ManagerLayout from "../layouts/ManagerLayout";

import Dashboard from "../pages/manager/Dashboard";
import Events from "./manager/EventsHistory";
import CreateEvent from "./manager/CreateEvent";
import Problems from "./manager/ProblemsHistory";
import Analytics from "./manager/Analytics";
import Submissions from "./manager/Submissions";
import Certificates from "./manager/Certificates";
import Settings from "./manager/Settings";

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
          path="create-event"
          element={
            <ProtectedRoute role="manager">
              <CreateEvent />
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

      </Route>
    </Routes>
  );
};

export default ManagerRoutes;