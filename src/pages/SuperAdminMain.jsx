import React from "react";
import { Routes, Route } from "react-router-dom";
import SuperAdminLayout from "../layouts/SuperAdminLayout";

import Dashboard from "./superadmin/Dashboard";
import Problems from "./superadmin/Problems";
import Events from "./superadmin/Events";
import EventRegistrations from "./superadmin/EventRegistrations";
import Submissions from "./superadmin/Submissions";
import Certificates from "./superadmin/Certificates";
import Payments from "./superadmin/Payments";
import Users from "./superadmin/Users";
import Settings from "./superadmin/Settings";
import Reports from "./superadmin/Reports";
import Improvements from "./superadmin/Improvements";
import Contacts from "./superadmin/Contacts";


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
          path="problems"
          element={
            <ProtectedRoute role="superadmin">
              <Problems />
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
          path="events-registrations"
          element={
            <ProtectedRoute role="superadmin">
              <EventRegistrations />
            </ProtectedRoute>
          }
        />

        <Route
          path="submissions"
          element={
            <ProtectedRoute role="superadmin">
              <Submissions />
            </ProtectedRoute>
          }
        />

        <Route
          path="certificates"
          element={
            <ProtectedRoute role="superadmin">
              <Certificates />
            </ProtectedRoute>
          }
        />

        <Route
          path="payments"
          element={
            <ProtectedRoute role="superadmin">
              <Payments />
            </ProtectedRoute>
          }
        />

        <Route
          path="users"
          element={
            <ProtectedRoute role="superadmin">
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="settings"
          element={
            <ProtectedRoute role="superadmin">
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="reports"
          element={
            <ProtectedRoute role="superadmin">
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route
          path="improvements"
          element={
            <ProtectedRoute role="superadmin">
              <Improvements />
            </ProtectedRoute>
          }
        />

        <Route
          path="contacts"
          element={
            <ProtectedRoute role="superadmin">
              <Contacts />
            </ProtectedRoute>
          }
        />

       

      </Route>
    </Routes>
  );
};

export default SuperAdminRoutes;