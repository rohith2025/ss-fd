import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import { toast } from "react-toastify";

const ParentChildAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH LINKED CHILD ================= */
  const fetchChildAndAttendance = async () => {
    try {
      // 1️⃣ Get linked child
      const childRes = await api.get("/parent/child");

      if (!childRes.data?.child) {
        toast.error("No child linked to this parent");
        setLoading(false);
        return;
      }

      const studentId = childRes.data.child._id;
      setChild(childRes.data.child);

      // 2️⃣ Fetch attendance
      const attRes = await api.get(`/parent/attendance/${studentId}`);
      setAttendance(attRes.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load child attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildAndAttendance();
  }, []);

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-2">
          Child Attendance
        </h1>

        {child && (
          <p className="text-sm text-gray-500 mb-4">
            {child.name} • {child.branch} • Year {child.year} • Section {child.section}
          </p>
        )}

        {loading ? (
          <p className="text-gray-500 text-sm">Loading attendance...</p>
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
                    {new Date(record.date).toLocaleDateString()} • {record.day}
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
