import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { getLinkedStudents } from "../../api/examHead.api";
import { useAuth } from "../../context/AuthContext";

const ExamHeadDashboard = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

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
            <div className="bg-sky-50 rounded-lg p-5">
              <h2 className="text-lg font-medium text-gray-700 mb-2">
                Linked Students
              </h2>
              <p className="text-3xl font-semibold text-sky-600">
                {students.length}
              </p>
            </div>

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

        {students.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-700 mb-4">
              Linked Students
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm">
                <thead className="bg-sky-50">
                  <tr>
                    <th className="border px-3 py-2 text-left">Name</th>
                    <th className="border px-3 py-2 text-left">Email</th>
                    <th className="border px-3 py-2 text-left">Branch</th>
                    <th className="border px-3 py-2 text-left">Year</th>
                    <th className="border px-3 py-2 text-left">Section</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="border px-3 py-2">{student.name}</td>
                      <td className="border px-3 py-2">{student.email}</td>
                      <td className="border px-3 py-2">{student.branch || "—"}</td>
                      <td className="border px-3 py-2">{student.year || "—"}</td>
                      <td className="border px-3 py-2">{student.section || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ExamHeadDashboard;

