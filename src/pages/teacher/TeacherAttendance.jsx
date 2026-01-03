import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import SearchableDropdown from "../../components/SearchableDropdown";
import api from "../../api/axios";

const TeacherAttendance = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [studentId, setStudentId] = useState("");
  const [subject, setSubject] = useState("");
  const [status, setStatus] = useState("present");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      const res = await api.get("/teacher/dashboard");
      setStudents(res.data.students || []);
    } catch (err) {
      console.error("Failed to fetch teacher data");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    try {
      await api.post("/teacher/attendance", {
        studentId,
        subject,
        status,
        day,
        time,
      });

      setStudentId("");
      setSubject("");
      setStatus("present");
      setDay("");
      setTime("");
      fetchTeacherData();
    } catch (err) {
      console.error("Failed to mark attendance");
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          Attendance Management
        </h1>

        <form
          onSubmit={handleMarkAttendance}
          className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <SearchableDropdown
            options={students.map((s) => ({
              _id: s._id,
              name: s.studentName,
            }))}
            value={studentId}
            onChange={setStudentId}
            placeholder="Search student by name..."
            required
            className="border rounded-md px-3 py-2 text-sm"
          />

          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="border rounded-md px-3 py-2 text-sm"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="present">Present</option>
            <option value="absent">Absent</option>
          </select>

          <input
            type="text"
            placeholder="Day (Monday)"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            required
            className="border rounded-md px-3 py-2 text-sm"
          />

          <input
            type="text"
            placeholder="Time (10:00 - 11:00)"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            className="border rounded-md px-3 py-2 text-sm"
          />

          <button
            type="submit"
            className="bg-sky-600 text-white rounded-md px-4 py-2 text-sm hover:bg-sky-700 md:col-span-3"
          >
            Mark Attendance
          </button>
        </form>

        {loading ? (
          <p className="text-gray-500 text-sm">
            Loading students...
          </p>
        ) : students.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No students linked
          </p>
        ) : (
          <div className="space-y-6">
            {students.map((s, index) => (
              <div key={index}>
                <h2 className="text-lg font-medium text-gray-700 mb-2">
                  {s.studentName}
                </h2>

                {s.attendance.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No attendance records
                  </p>
                ) : (
                  <div className="space-y-2">
                    {s.attendance.map((a, idx) => (
                      <div
                        key={idx}
                        className="border rounded-lg p-3 flex justify-between items-center"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            {a.subject}
                          </p>
                          <p className="text-xs text-gray-500">
                            {a.day} • {a.time}
                          </p>
                        </div>

                        <span
                          className={`text-xs px-3 py-1 rounded-full ${
                            a.status === "present"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {a.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherAttendance;
