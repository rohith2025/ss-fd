import { useEffect, useState } from "react";
import { getStudentDashboard } from "../../api/student.api";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/DashboardLayout";
import CgpaOverlay from "../../components/CgpaOverlay";
import AttendanceOverlay from "../../components/AttendanceOverlay";

const StudentDashboard = () => {
  const { role } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [showCgpaOverlay, setShowCgpaOverlay] = useState(false);
  const [showAttendanceOverlay, setShowAttendanceOverlay] = useState(false);

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
    if (!filteredAttendance.length) return "0.0";
    const present = filteredAttendance.filter(a => a.status === "present").length;
    return ((present / filteredAttendance.length) * 100).toFixed(1);
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

      <div className="p-6 flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-lg font-medium text-gray-700 mb-2">
            Profile
          </h2>
          <p className="text-sm text-gray-600">Branch: {student?.branch}</p>
          <p className="text-sm text-gray-600">Year: {student?.year}</p>
          <p className="text-sm text-gray-600">Section: {student?.section}</p>
        </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm p-5">
        <h2 className="text-lg font-medium text-gray-700 mb-4">
          Attendance
        </h2>

        <div
          onClick={() => setShowAttendanceOverlay(true)}
          className="p-6 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md hover:bg-gray-50 text-center"
        >
          <div className="text-sm text-gray-500 mb-2">
            Overall Attendance
          </div>

          <div className="text-5xl font-bold text-sky-600 mb-2">
            {calculatePercentage()}%
          </div>

          <div className="text-xs text-gray-400">
            Total Records: {filteredAttendance.length}
          </div>

          <div className="text-xs text-gray-400 mt-1">
            Click to view details
          </div>
        </div>
      </div>


        <div className="flex-1 bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-lg font-medium text-gray-700 mb-4">
            Academic Performance
          </h2>

          {grades ? (
            <div
              onClick={() => setShowCgpaOverlay(true)}
              className="p-6 rounded-lg cursor-pointer transition hover:shadow-md hover:bg-gray-50 text-center"
            >
              <div className="text-sm text-gray-500 mb-2">
                Current CGPA
              </div>
              <div className="text-5xl font-bold text-sky-600 mb-2">
                {grades.cgpa || "N/A"}
              </div>
              <div className="text-xs text-gray-400">
                Click to view semester details
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center">
              Grades not published yet
            </p>
          )}
        </div>
      </div>

      <CgpaOverlay
        isOpen={showCgpaOverlay}
        onClose={() => setShowCgpaOverlay(false)}
        grades={grades}
      />

      <AttendanceOverlay
        isOpen={showAttendanceOverlay}
        onClose={() => setShowAttendanceOverlay(false)}
        attendance={attendance}
      />
    </DashboardLayout>
  );
};

export default StudentDashboard;
