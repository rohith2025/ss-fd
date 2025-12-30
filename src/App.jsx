import { Routes, Route, Navigate } from "react-router-dom";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Dashboards
import StudentDashboard from "./pages/student/StudentDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import ParentDashboard from "./pages/parent/ParentDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

// HOD Leave Page
import HodLeaveDashboard from "./pages/teacher/HodLeaveDashboard";

// Route guard
import ProtectedRoute from "./routes/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      {/* Teacher / HOD / Exam Head / Lab Assistant */}
      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute
            allowedRoles={["teacher", "hod", "exam_head", "lab_assistant"]}
          >
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />

      {/* HOD – Leave Approval */}
      <Route
        path="/hod/leaves"
        element={
          <ProtectedRoute allowedRoles={["hod"]}>
            <HodLeaveDashboard />
          </ProtectedRoute>
        }
      />

      {/* Parent */}
      <Route
        path="/parent/dashboard"
        element={
          <ProtectedRoute allowedRoles={["parent"]}>
            <ParentDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Fallbacks */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/unauthorized"
        element={<h1 className="p-8 text-red-600">Unauthorized</h1>}
      />
    </Routes>
  );
};

export default App;
