import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { getLinkedStudents } from "../../api/examHead.api";
import { useAuth } from "../../context/AuthContext";
import StudentsOverlay from "../../components/StudentsOverlay";

const ExamHeadDashboard = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStudentsOverlay, setShowStudentsOverlay] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await getLinkedStudents();
      setStudents(res.data || []);
    } catch (err) {
      console.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm p-6">
        {/* HEADER */}
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          Exam Head Dashboard
        </h1>

        <p className="text-sm text-gray-500 mb-6">
          Welcome, {user?.name}
        </p>

        {loading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* LINKED STUDENTS CARD (CLICKABLE) */}
            <div
              className="bg-sky-50 rounded-lg p-5 cursor-pointer hover:shadow-md transition"
              onClick={() => setShowStudentsOverlay(true)}
            >
              <h2 className="text-lg font-medium text-gray-700 mb-2">
                Linked Students
              </h2>
              <p className="text-3xl font-semibold text-sky-600">
                {students.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Click to view list
              </p>
            </div>

            {/* ROLE CARD */}
            <div className="bg-sky-50 rounded-lg p-5">
              <h2 className="text-lg font-medium text-gray-700 mb-2">
                Role
              </h2>
              <p className="text-sm text-gray-600 capitalize">
                Exam Head
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Manage grades & verify activities
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ================= STUDENTS OVERLAY ================= */}
      <StudentsOverlay
        isOpen={showStudentsOverlay}
        onClose={() => setShowStudentsOverlay(false)}
        students={students}
        title="Linked Students"
      />
    </DashboardLayout>
  );
};

export default ExamHeadDashboard;
