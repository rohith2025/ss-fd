import { useEffect, useState } from "react";
import { getTeacherDashboard } from "../../api/teacher.api";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/DashboardLayout";


const TeacherDashboard = () => {
  const { role } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getTeacherDashboard();
        setData(res.data);
      } catch (err) {
        console.error("Failed to load teacher dashboard");
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

  const { teacher, students } = data || {};

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
          <h2 className="text-lg font-medium text-gray-700 mb-2">
            Linked Students
          </h2>
          <p className="text-3xl font-semibold text-sky-600">
            {students?.length || 0}
          </p>
          <p className="text-sm text-gray-500">
            Students under you
          </p>
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

      <div className="px-6 pb-6">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-lg font-medium text-gray-700 mb-4">
            Student's List
          </h2>

          {students?.length === 0 ? (
            <p className="text-sm text-gray-500">
              No students linked yet
            </p>
          ) : (
            <div className="space-y-3">
              {students.map((s, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <p className="text-sm text-gray-700">
                    {s.studentName}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
