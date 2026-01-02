import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";

const StudentAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [selectedDay, setSelectedDay] = useState("All");
  const [loading, setLoading] = useState(true);

  const days = ["All", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
    fetchAttendance();
  }, []);

  useEffect(() => {
    if (selectedDay === "All") {
      setFilteredAttendance(attendance);
    } else {
      setFilteredAttendance(
        attendance.filter((item) => item.day === selectedDay)
      );
    }
  }, [selectedDay, attendance]);

  const fetchAttendance = async () => {
    try {
      const res = await api.get("/attendance/my");
      setAttendance(res.data || []);
      setFilteredAttendance(res.data || []);
    } catch (err) {
      console.error("Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Date formatter (safe)
  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";
    return new Date(dateValue).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold text-gray-800">
            My Attendance
          </h1>
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          >
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-gray-500 text-sm">Loading attendance...</p>
        ) : filteredAttendance.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No attendance records found{selectedDay !== "All" ? ` for ${selectedDay}` : ""}
          </p>
        ) : (
          <div className="space-y-3">
            {filteredAttendance.map((item) => (
              <div
                key={item._id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="text-gray-700 font-medium">
                    {item.subject}
                  </p>

                  {/* ✅ Day + Time */}
                  <p className="text-sm text-gray-500">
                    {item.day} • {item.time}
                  </p>

                  {/* ✅ Date added */}
                  <p className="text-xs text-gray-400 mt-1">
                    Date: {formatDate(item.date || item.createdAt)}
                  </p>
                </div>

                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${
                    item.status === "present"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentAttendance;
