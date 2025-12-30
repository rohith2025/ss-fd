import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { role } = useAuth();

  const commonLinkClass =
    "block px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-sky-100";

  return (
    <div className="w-60 bg-white shadow-sm min-h-screen p-4">
      <nav className="space-y-2">

        {/* STUDENT */}
        {role === "student" && (
          <>
            <NavLink to="/student/dashboard" className={commonLinkClass}>
              Dashboard
            </NavLink>
          </>
        )}

        {/* TEACHER / HOD / EXAM HEAD / LAB ASSISTANT */}
        {["teacher", "hod", "exam_head", "lab_assistant"].includes(role) && (
          <>
            <NavLink to="/teacher/dashboard" className={commonLinkClass}>
              Dashboard
            </NavLink>

            {role === "hod" && (
              <NavLink to="/hod/leaves" className={commonLinkClass}>
                Leave Approvals
              </NavLink>
            )}
          </>
        )}

        {/* PARENT */}
        {role === "parent" && (
          <>
            <NavLink to="/parent/dashboard" className={commonLinkClass}>
              Dashboard
            </NavLink>
          </>
        )}

        {/* ADMIN */}
        {role === "admin" && (
          <>
            <NavLink to="/admin/dashboard" className={commonLinkClass}>
              Dashboard
            </NavLink>
          </>
        )}

      </nav>
    </div>
  );
};

export default Sidebar;
