import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../../components/common/ProtectedRoute";
import Dashboard from "./Dashboard";
import Events from "./Events";
import CreateEvent from "./CreateEvent";
import Problems from "./Problems";
import Analytics from "./Analytics";
import Settings from "./Settings";
import NotFound from "../NotFound";

const ManagerRoutes = () => {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events"
        element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <Events />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-event"
        element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <CreateEvent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/problems"
        element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <Problems />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <Analytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default ManagerRoutes;