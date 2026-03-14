import React from "react";
import { Routes, Route } from "react-router-dom";
import ManagerLayout from "../layouts/ManagerLayout";

import Dashboard from "../pages/manager/Dashboard";
import Events from "./manager/EventsHistory";
import CreateEvent from "../pages/manager/CreateEvent";
import Problems from "./manager/ProblemsHistory";
import Analytics from "../pages/manager/Analytics";
import Settings from "../pages/manager/Settings";

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