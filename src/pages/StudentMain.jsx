import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import StudentLayout from "../layouts/StudentLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";

// ===== Student Pages =====
import StudentDashboard from "./student/Dashboard";
import StudentEvents from "./student/Events";
import EventDetailsPage from "./student/EventDetailsPage";
import EventAttemptPage from "./student/EventAttemptPage";
import EventProblemSolver from "./student/EventProblemSolver";
import ProblemSolverPage from "./student/ProblemSolverPage";
import StudentProblems from "./student/Problems";
import StudentCertificates from "./student/Certificates";
import EventHistory from "./student/EventHistory";
import ProblemHistory from "./student/ProblemHistory";
import PaymentHistory from "./student/PaymentHistory";
import Settings from "./student/Settings";
import PointsDashboard from "./student/PointsDashboard";
import ActivityIntensityDashboard from "./student/ActivityIntensity";
import PracticeCodeSandbox from "./student/PracticeCodeSandbox";
import GlobalLeaderboard from "./student/GlobalLeaderboard";
import EventLeaderboard from "./student/EventLeaderboard";
import StudentProfile from "./student/Profile";
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

        <Route path="points" element={<PointsDashboard />} />

        <Route path="activity-intensity" element={<ActivityIntensityDashboard />} />

        {/* ===== Events Routes ===== */}
        <Route path="events" element={<StudentEvents />} />

        <Route path="event/:eventId" element={<EventDetailsPage />} />

        <Route path="event/:eventId/attempt" element={<EventAttemptPage />} />

        <Route path="event/:eventId/solve" element={<EventProblemSolver />} />

        {/* ===== Problems Routes ===== */}
        <Route path="problem/:problemId" element={<ProblemSolverPage />} />

        <Route path="problems" element={<StudentProblems />} />

        {/* ===== Other Routes ===== */}
        <Route path="certificates" element={<StudentCertificates />} />

        <Route path="event-history" element={<EventHistory />} />

        <Route path="problem-history" element={<ProblemHistory />} />

        <Route path="payment-history" element={<PaymentHistory />} />

        <Route path="settings" element={<Settings />} />


        <Route path="practice-sandbox" element={<PracticeCodeSandbox />} />

        <Route path="global-leaderboard" element={<GlobalLeaderboard />} />

        <Route path="event-leaderboard/:eventId" element={<EventLeaderboard />} />

        <Route path="profile" element={<StudentProfile />} />

      </Route>

    </Routes>
  );
};

export default StudentRoutes;