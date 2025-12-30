import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";

const ParentChildAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      // 🔑 Get linked studentId stored after parent login
      const studentId = localStorage.getItem("studentId");

      if (!studentId) {
        console.error("Student ID not found for parent");
        setLoading(false);
        return;
      }

      // ✅ Correct backend route usage
      const res = await api.get(`/parent/attendance/${studentId}`);
      setAttendance(res.data || []);
    } catch (err) {
      console.error("Failed to fetch child attendance", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          Child Attendance
        </h1>

        {loading ? (
          <p className="text-gray-500 text-sm">
            Loading attendance...
          </p>
        ) : attendance.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No attendance records found
          </p>
        ) : (
          <div className="space-y-3">
            {attendance.map((record) => (
              <div
                key={record._id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="text-gray-700 font-medium">
                    {record.subject}
                  </p>
                  <p className="text-sm text-gray-500">
                    {record.day} • {record.time}
                  </p>
                </div>

                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${
                    record.status === "present"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {record.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ParentChildAttendance;
