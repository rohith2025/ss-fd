import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Home from "./pages/Home";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";


import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import StudentDashboard from "./pages/student/StudentDashboard";
import StudentAttendance from "./pages/student/StudentAttendance";
import StudentExams from "./pages/student/StudentExams";
import StudentFees from "./pages/student/StudentFees";
import StudentLeaves from "./pages/student/StudentLeaves";
import StudentActivities from "./pages/student/StudentActivities";
import StudentThesis from "./pages/student/StudentThesis";
import StudentTimetable from "./pages/student/StudentTimetable";

import ParentDashboard from "./pages/parent/ParentDashboard";
import ParentChildAttendance from "./pages/parent/ParentChildAttendance";

import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherAttendance from "./pages/teacher/TeacherAttendance";
import TeacherStudentThesis from "./pages/teacher/TeacherStudentThesis";
import TeacherTimetable from "./pages/teacher/TeacherTimetable";
import HodLeaveDashboard from "./pages/teacher/HodLeaveDashboard";
import HodStudentProfiles from "./pages/teacher/HodStudentProfiles";
import HodTimetable from "./pages/teacher/HodTimetable";


import ExamHeadDashboard from "./pages/examHead/ExamHeadDashboard";
import ExamHeadCreateExam from "./pages/examHead/ExamHeadCreateExam";
import ExamHeadManageGrades from "./pages/examHead/ExamHeadManageGrades";
import ExamHeadStudentProfiles from "./pages/examHead/ExamHeadStudentProfiles";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminUserLinking from "./pages/admin/AdminUserLinking";
import AdminTransactions from "./pages/admin/AdminTransactions";
import AdminFeesApproval from "./pages/admin/AdminFeesApproval";

import Holidays from "./pages/common/Holidays";
import Notices from "./pages/common/Notices";
import Notifications from "./pages/common/Notifications";
import Unauthorized from "./pages/Unauthorized";

const App = () => {
  return (
    <>
    <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />

    <Routes>
      {/* ========= PUBLIC ========= */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ========= STUDENT ========= */}
      <Route path="/student/dashboard" element={
        <ProtectedRoute allowedRoles={["student"]}>
          <StudentDashboard />
        </ProtectedRoute>
      } />
      <Route path="/student/attendance" element={
        <ProtectedRoute allowedRoles={["student"]}>
          <StudentAttendance />
        </ProtectedRoute>
      } />
      <Route path="/student/exams" element={
        <ProtectedRoute allowedRoles={["student"]}>
          <StudentExams />
        </ProtectedRoute>
      } />
      <Route path="/student/fees" element={
        <ProtectedRoute allowedRoles={["student"]}>
          <StudentFees />
        </ProtectedRoute>
      } />
      <Route path="/student/leaves" element={
        <ProtectedRoute allowedRoles={["student"]}>
          <StudentLeaves />
        </ProtectedRoute>
      } />
      <Route path="/student/activities" element={
        <ProtectedRoute allowedRoles={["student"]}>
          <StudentActivities />
        </ProtectedRoute>
      } />
      <Route path="/student/thesis" element={
        <ProtectedRoute allowedRoles={["student"]}>
          <StudentThesis />
        </ProtectedRoute>
      } />
      <Route path="/student/timetable" element={
        <ProtectedRoute allowedRoles={["student"]}>
          <StudentTimetable />
        </ProtectedRoute>
      } />

      {/* ========= PARENT ========= */}
      <Route path="/parent/dashboard" element={
        <ProtectedRoute allowedRoles={["parent"]}>
          <ParentDashboard />
        </ProtectedRoute>
      } />
      <Route path="/parent/attendance" element={
        <ProtectedRoute allowedRoles={["parent"]}>
          <ParentChildAttendance />
        </ProtectedRoute>
      } />

      {/* ========= TEACHER / HOD / LAB / EXAM HEAD ========= */}
      <Route path="/teacher/dashboard" element={
        <ProtectedRoute allowedRoles={["teacher","hod","exam_head","lab_assistant"]}>
          <TeacherDashboard />
        </ProtectedRoute>
      } />
      <Route path="/teacher/attendance" element={
        <ProtectedRoute allowedRoles={["teacher","hod"]}>
          <TeacherAttendance />
        </ProtectedRoute>
      } />
      <Route path="/teacher/thesis" element={
        <ProtectedRoute allowedRoles={["teacher"]}>
          <TeacherStudentThesis />
        </ProtectedRoute>
      } />
      <Route path="/teacher/timetable" element={
        <ProtectedRoute allowedRoles={["teacher", "lab_assistant"]}>
          <TeacherTimetable />
        </ProtectedRoute>
      } />

      {/* ========= HOD ========= */}
      <Route path="/hod/leaves" element={
        <ProtectedRoute allowedRoles={["hod"]}>
          <HodLeaveDashboard />
        </ProtectedRoute>
      } />
      <Route
      path="/hod/students"
      element={
        <ProtectedRoute allowedRoles={["hod"]}>
          <HodStudentProfiles />
        </ProtectedRoute>
      }/>
      <Route path="/hod/timetable" element={
        <ProtectedRoute allowedRoles={["hod"]}>
          <HodTimetable />
        </ProtectedRoute>
      } />


      {/* ========= EXAM HEAD ========= */}
      <Route path="/exam-head/dashboard" element={
        <ProtectedRoute allowedRoles={["exam_head"]}>
          <ExamHeadDashboard />
        </ProtectedRoute>
      } />
      <Route path="/exam-head/exams" element={
        <ProtectedRoute allowedRoles={["exam_head"]}>
          <ExamHeadCreateExam />
        </ProtectedRoute>
      } />
      <Route path="/exam-head/grades" element={
        <ProtectedRoute allowedRoles={["exam_head"]}>
          <ExamHeadManageGrades />
        </ProtectedRoute>
      } />
      <Route path="/exam-head/students" element={
        <ProtectedRoute allowedRoles={["exam_head"]}>
          <ExamHeadStudentProfiles />
        </ProtectedRoute>
      } />

      {/* ========= ADMIN ========= */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminUsers />
        </ProtectedRoute>
      } />
      <Route path="/admin/linking" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminUserLinking />
        </ProtectedRoute>
      } />
      <Route path="/admin/transactions" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminTransactions />
        </ProtectedRoute>
      } />
      <Route path="/admin/fees" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminFeesApproval />
        </ProtectedRoute>
      } />

      {/* ========= COMMON ========= */}
      <Route path="/holidays" element={
        <ProtectedRoute allowedRoles={["admin","student","parent","teacher","hod","exam_head","lab_assistant"]}>
          <Holidays />
        </ProtectedRoute>
      } />
      <Route path="/notices" element={
        <ProtectedRoute allowedRoles={["admin","student","parent","teacher","hod","exam_head","lab_assistant"]}>
          <Notices />
        </ProtectedRoute>
      } />
      <Route path="/notifications" element={
        <ProtectedRoute allowedRoles={["admin","student","parent","teacher","hod","exam_head","lab_assistant"]}>
          <Notifications />
        </ProtectedRoute>
      } />

      {/* ========= UNAUTHORIZED ========= */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* ========= FALLBACK ========= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
};

export default App;
