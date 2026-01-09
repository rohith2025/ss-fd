import { useEffect, useState } from "react";
import { getTeacherDashboard } from "../../api/teacher.api";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/DashboardLayout";
import StudentsOverlay from "../../components/StudentsOverlay";

const TeacherDashboard = () => {
  const { role } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showStudentsOverlay, setShowStudentsOverlay] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getTeacherDashboard();
        setData(res.data);
      } catch (err) {
        console.error("Failed to load teacher dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-50">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  const teacher = data?.teacher;
  const students = data?.students || [];

  return (
    <DashboardLayout>
      <div className="bg-white shadow-sm px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Teacher Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Welcome, {teacher?.name} ({role})
        </p>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-lg font-medium text-gray-700 mb-2">
            Profile
          </h2>
          <p className="text-sm text-gray-600">
            Name: {teacher?.name}
          </p>
          {teacher?.subjects && (
            <p className="text-sm text-gray-600">
              Subjects: {teacher.subjects.join(", ")}
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-lg font-medium text-gray-700 mb-4">
            Linked Students
          </h2>

          <div
            onClick={() => setShowStudentsOverlay(true)}
            className="p-6 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md hover:bg-gray-50 text-center"
          >
            <div className="text-5xl font-bold text-sky-600 mb-2">
              {students.length}
            </div>
            <div className="text-sm text-gray-500">
              Click to view student list
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-lg font-medium text-gray-700 mb-2">
            Role Access
          </h2>
          <p className="text-sm text-gray-600">
            Current Role: <span className="font-medium">{role}</span>
          </p>

          {role === "hod" && (
            <p className="mt-2 text-sm text-sky-600">
              You can manage timetable & approve leaves
            </p>
          )}

          {role === "exam_head" && (
            <p className="mt-2 text-sm text-sky-600">
              You can create & manage exams
            </p>
          )}

          {role === "lab_assistant" && (
            <p className="mt-2 text-sm text-gray-500">
              Limited access (labs & assistance)
            </p>
          )}
        </div>
      </div>

      <StudentsOverlay
        isOpen={showStudentsOverlay}
        onClose={() => setShowStudentsOverlay(false)}
        students={students}
        title="Linked Students"
      />
    </DashboardLayout>
  );
};

export default TeacherDashboard;
