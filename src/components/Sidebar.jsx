import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { role, logout } = useAuth();

  if (!role) return null;

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-md text-sm ${
      isActive
        ? "bg-sky-100 text-sky-700"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <aside
      className="
        fixed top-16 left-0
        w-64 h-[calc(100vh-4rem)]
        bg-white shadow-sm
        p-4
        overflow-y-auto
        z-30
      "
    >
      {role === "student" && (
        <>
          <NavLink to="/student/dashboard" className={linkClass}>Dashboard</NavLink>
          <NavLink to="/student/attendance" className={linkClass}>Attendance</NavLink>
          <NavLink to="/student/exams" className={linkClass}>Exams</NavLink>
          <NavLink to="/student/fees" className={linkClass}>Fees</NavLink>
          <NavLink to="/student/leaves" className={linkClass}>Leaves</NavLink>
          <NavLink to="/student/thesis" className={linkClass}>Thesis</NavLink>
          <NavLink to="/student/timetable" className={linkClass}>Timetable</NavLink>
        </>
      )}

      {role === "parent" && (
        <>
          <NavLink to="/parent/dashboard" className={linkClass}>Dashboard</NavLink>
          {/* <NavLink to="/parent/attendance" className={linkClass}>Child Attendance</NavLink> */}
          <NavLink to="/parent/academics" className={linkClass}>Child Academics</NavLink>
        </>
      )}

      {role === "teacher" && (
        <>
          <NavLink to="/teacher/dashboard" className={linkClass}>Dashboard</NavLink>
          <NavLink to="/teacher/attendance" className={linkClass}>Attendance</NavLink>
          <NavLink to="/teacher/thesis" className={linkClass}>Student Thesis</NavLink>
          <NavLink to="/teacher/timetable" className={linkClass}>Timetable</NavLink>
        </>
      )}

      {role === "hod" && (
        <>
          <NavLink to="/teacher/dashboard" className={linkClass}>Dashboard</NavLink>
          <NavLink to="/hod/leaves" className={linkClass}>Leave Approvals</NavLink>
          <NavLink to="/hod/students" className={linkClass}>Student Profiles</NavLink>
          <NavLink to="/hod/timetable" className={linkClass}>Timetable</NavLink>
        </>
      )}

      {role === "exam_head" && (
        <>
          <NavLink to="/exam-head/dashboard" className={linkClass}>Dashboard</NavLink>
          <NavLink to="/exam-head/grades" className={linkClass}>Manage Grades</NavLink>
          <NavLink to="/exam-head/students" className={linkClass}>Student Profiles</NavLink>
          <NavLink to="/exam-head/exams" className={linkClass}>Create Exam</NavLink>
        </>
      )}

      {role === "admin" && (
        <>
          <NavLink to="/admin/dashboard" className={linkClass}>Dashboard</NavLink>
          <NavLink to="/admin/users" className={linkClass}>Users</NavLink>
          <NavLink to="/admin/linking" className={linkClass}>User Linking</NavLink>
          <NavLink to="/admin/fees" className={linkClass}>Fees Approval</NavLink>
        </>
      )}

      <div className="mt-6 border-t pt-4">
        <NavLink to="/holidays" className={linkClass}>Holidays</NavLink>
        <NavLink to="/notices" className={linkClass}>Notices</NavLink>
        <NavLink to="/notifications" className={linkClass}>Notifications</NavLink>
      </div>

      <button
        onClick={logout}
        className="mt-6 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
