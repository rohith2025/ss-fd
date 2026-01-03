import { useEffect, useState } from "react";
import { getStudentDashboard } from "../../api/student.api";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/DashboardLayout";

const StudentDashboard = () => {
  const { role } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filteredAttendance, setFilteredAttendance] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getStudentDashboard();
        setData(res.data);

        setFilteredAttendance(res.data?.attendance || []);
      } catch (error) {
        console.error("Failed to load dashboard", error);
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

  const calculatePercentage = () => {
    if (!filteredAttendance || filteredAttendance.length === 0) return "0.0";

    const presentCount = filteredAttendance.filter(
      (item) => item.status === "present"
    ).length;

    return ((presentCount / filteredAttendance.length) * 100).toFixed(1);
  };

  const { student, attendance, grades } = data || {};

  return (
    <DashboardLayout>
      <div className="bg-white shadow-sm px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Student Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Welcome, {student?.name}
        </p>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-lg font-medium text-gray-700 mb-2">
            Profile
          </h2>
          <p className="text-sm text-gray-600">
            Branch: {student?.branch}
          </p>
          <p className="text-sm text-gray-600">
            Year: {student?.year}
          </p>
          <p className="text-sm text-gray-600">
            Section: {student?.section}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-lg font-medium text-gray-700 mb-2">
            Attendance
          </h2>
          <p className="text-3xl font-semibold text-sky-600">
            {calculatePercentage()}%
          </p>
          <p className="text-sm text-gray-500">
            Total Records: {filteredAttendance.length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-lg font-medium text-gray-700 mb-2">
            Grades
          </h2>
          {grades ? (
            <>
              <p className="text-sm text-gray-600">
                SGPA: <span className="font-medium">{grades.sgpa}</span>
              </p>
              <p className="text-sm text-gray-600">
                CGPA: <span className="font-medium">{grades.cgpa}</span>
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-500">
              Grades not published yet
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
