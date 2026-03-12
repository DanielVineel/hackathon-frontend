import React from "react";
import { Routes, Route } from "react-router-dom";
import SuperAdminLayout from "../layouts/SuperAdminLayout";

import Dashboard from "../pages/superadmin/Dashboard";
import Managers from "../pages/superadmin/Managers";
import Events from "../pages/superadmin/Events";
import Problems from "../pages/superadmin/Problems";
import Analytics from "../pages/superadmin/Analytics";

import ProtectedRoute from "../components/common/ProtectedRoute";

const SuperAdminRoutes = () => {
  return (
    <Routes>
      <Route element={<SuperAdminLayout />}>

        <Route
          path="dashboard"
          element={
            <ProtectedRoute role="superadmin">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="managers"
          element={
            <ProtectedRoute role="superadmin">
              <Managers />
            </ProtectedRoute>
          }
        />

        <Route
          path="events"
          element={
            <ProtectedRoute role="superadmin">
              <Events />
            </ProtectedRoute>
          }
        />

        <Route
          path="problems"
          element={
            <ProtectedRoute role="superadmin">
              <Problems />
            </ProtectedRoute>
          }
        />

        <Route
          path="analytics"
          element={
            <ProtectedRoute role="superadmin">
              <Analytics />
            </ProtectedRoute>
          }
        />

      </Route>
    </Routes>
  );
};

export default SuperAdminRoutes;