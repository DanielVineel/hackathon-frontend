// src/App.jsx

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// ====== Public Pages ======
import PublicHome from "./pages/public/Home";
import PublicEvents from "./pages/public/Events";
import PublicAbout from "./pages/public/About";
import PublicContact from "./pages/public/Contact";
import PrivacyPolicy from "./pages/public/PrivacyPolicy";
import TermsConditions from "./pages/public/TermsConditions";

// ====== Student Pages ======
import StudentRoutes from "./pages/StudentMain";

// ====== Manager Pages ======
import ManagerRoutes from "./pages/ManagerMain";

// ====== Superadmin Pages ======
import SuperAdminRoutes from "./pages/SuperAdminMain";

// ====== Auth Pages ======
import StudentLogin from "./pages/auth/student/Login";
import StudentSignup from "./pages/auth/student/Signup";
import ManagerLogin from "./pages/auth/manager/Login";
import ManagerSignup from "./pages/auth/manager/Signup";
import SuperAdminLogin from "./pages/auth/superadmin/Login";
import SuperAdminSignup from "./pages/auth/superadmin/Signup";

function App() {
  return (
    <Router>
      <Routes>
        {/* ===== PUBLIC ROUTES (No Auth Required) ===== */}
        <Route path="/" element={<PublicHome />} />
        <Route path="/home" element={<PublicHome />} />
        <Route path="/events" element={<PublicEvents />} />
        <Route path="/about" element={<PublicAbout />} />
        <Route path="/contact" element={<PublicContact />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsConditions />} />

        {/* ===== AUTHENTICATION ROUTES ===== */}
        <Route path="/auth/student/login" element={<StudentLogin />} />
        <Route path="/auth/student/signup" element={<StudentSignup />} />

        <Route path="/auth/manager/login" element={<ManagerLogin />} />
        <Route path="/auth/manager/signup" element={<ManagerSignup />} />

        <Route path="/auth/superadmin/login" element={<SuperAdminLogin />} />
        <Route path="/auth/superadmin/signup" element={<SuperAdminSignup />} />

        {/* ===== AUTHENTICATED ROUTES ===== */}
        {/* Student Routes */}
        <Route path="/student/*" element={<StudentRoutes />} />
        
        {/* Manager Routes */}
        <Route path="/manager/*" element={<ManagerRoutes />} />

        {/* Superadmin Routes */}
        <Route path="/superadmin/*" element={<SuperAdminRoutes />} />

        {/* ===== Catch-all Route ===== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;