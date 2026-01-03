import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";

const StudentAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [selectedDay, setSelectedDay] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);

  const days = ["All", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate]);

  useEffect(() => {
    let filtered = attendance;
    
    // Filter by date if selected
    if (selectedDate) {
      const selectedDateObj = new Date(selectedDate);
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date || item.createdAt);
        return (
          itemDate.getDate() === selectedDateObj.getDate() &&
          itemDate.getMonth() === selectedDateObj.getMonth() &&
          itemDate.getFullYear() === selectedDateObj.getFullYear()
        );
      });
    }
    
    // Filter by day if selected
    if (selectedDay !== "All") {
      filtered = filtered.filter((item) => item.day === selectedDay);
    }
    
    setFilteredAttendance(filtered);
  }, [selectedDay, selectedDate, attendance]);

  const fetchAttendance = async () => {
    try {
      const url = selectedDate 
        ? `/attendance/my?date=${selectedDate}`
        : "/attendance/my";
      const res = await api.get(url);
      setAttendance(res.data || []);
    } catch (err) {
      console.error("Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  // Calculate attendance percentage
  const calculatePercentage = () => {
    if (filteredAttendance.length === 0) return 0;
    const presentCount = filteredAttendance.filter(
      (item) => item.status === "present"
    ).length;
    return ((presentCount / filteredAttendance.length) * 100).toFixed(1);
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
          <div className="flex gap-3">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedDay("All"); // Reset day filter when date is selected
              }}
              className="border rounded-md px-3 py-2 text-sm"
            />
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
        </div>

        {/* Attendance Percentage */}
        {!loading && filteredAttendance.length > 0 && (
          <div className="mb-4 p-3 bg-sky-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700">
              Attendance Percentage: <span className="text-sky-600 font-semibold">{calculatePercentage()}%</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              ({filteredAttendance.filter((item) => item.status === "present").length} present / {filteredAttendance.length} total)
            </p>
          </div>
        )}

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
