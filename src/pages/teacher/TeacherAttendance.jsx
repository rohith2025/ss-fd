import { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  getTeacherClasses,
  getClassStudents,
  markBulkAttendance,
} from "../../api/attendance.api";
import { toast } from "react-toastify";

const TeacherAttendance = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1
  const [selectedDate, setSelectedDate] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");

  // Step 2
  const [availableClasses, setAvailableClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  // Step 3
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [searchTerm, setSearchTerm] = useState(""); // ✅ added

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      const dayName = new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
      });
      setDayOfWeek(dayName);
    } else {
      setDayOfWeek("");
    }
  };

  const handleFetchClasses = async () => {
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    setLoading(true);
    try {
      const res = await getTeacherClasses(selectedDate);
      setAvailableClasses(res.data || []);
      res.data.length ? setStep(2) : toast.info("No classes scheduled");
    } catch {
      toast.error("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  const handleClassSelect = async (classItem) => {
    setSelectedClass(classItem);
    setLoading(true);

    try {
      const res = await getClassStudents({
        year: classItem.year,
        section: classItem.section,
        branch: classItem.branch,
      });

      const studentList = res.data || [];
      setStudents(studentList);

      const init = {};
      studentList.forEach((s) => (init[s._id] = "present"));
      setAttendanceData(init);

      setSearchTerm("");
      setStep(3);
    } catch {
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (id, status) => {
    setAttendanceData((prev) => ({ ...prev, [id]: status }));
  };

  const handleMarkAttendance = async () => {
    setLoading(true);
    try {
      await markBulkAttendance({
        date: selectedDate,
        day: dayOfWeek,
        subject: selectedClass.subject,
        year: selectedClass.year,
        section: selectedClass.section,
        timeSlot: selectedClass.timeSlot,
        branch: selectedClass.branch,
        attendance: students.map((s) => ({
          studentId: s._id,
          status: attendanceData[s._id],
        })),
      });

      toast.success("Attendance marked successfully");
      setStep(1);
      setSelectedDate("");
      setDayOfWeek("");
      setAvailableClasses([]);
      setSelectedClass(null);
      setStudents([]);
      setAttendanceData({});
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setAvailableClasses([]);
    } else if (step === 3) {
      setStep(2);
      setSelectedClass(null);
      setStudents([]);
      setAttendanceData({});
    }
  };

  // ✅ Filtered list (UI only)
  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">Mark Attendance</h1>
          {step > 1 && (
            <button onClick={handleBack} className="border px-4 py-2 rounded">
              Back
            </button>
          )}
        </div>

        {/* STEP INDICATOR */}
        <div className="flex items-center mb-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= n ? "bg-sky-600 text-white" : "bg-gray-200"
                }`}
              >
                {n}
              </div>
              {n !== 3 && (
                <div
                  className={`w-8 h-0.5 mx-2 ${
                    step > n ? "bg-sky-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => handleDateChange(e.target.value)}
              className="border px-3 py-2 w-full rounded"
            />
            {dayOfWeek && <p className="text-blue-700">Day: {dayOfWeek}</p>}
            <button
              onClick={handleFetchClasses}
              className="w-full bg-sky-600 text-white py-2 rounded"
            >
              Continue
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="grid gap-3">
            {availableClasses.map((c, i) => (
              <div
                key={i}
                onClick={() => handleClassSelect(c)}
                className="border p-4 rounded cursor-pointer"
              >
                <h4>{c.subject}</h4>
                <p className="text-sm text-gray-600">
                  Year {c.year} • Section {c.section} • {c.timeSlot}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-4">
            {/* 🔍 SEARCH */}
            <input
              type="text"
              placeholder="Search student by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border px-3 py-2 w-full rounded"
            />

            <div className="border rounded max-h-96 overflow-y-auto">
              {filteredStudents.map((s) => (
                <div key={s._id} className="border-b p-3 flex justify-between">
                  <div>
                    <p className="font-medium">{s.name}</p>
                    {s.rollNo && (
                      <p className="text-sm text-gray-500">
                        Roll No: {s.rollNo}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <label>
                      <input
                        type="radio"
                        checked={attendanceData[s._id] === "present"}
                        onChange={() =>
                          handleAttendanceChange(s._id, "present")
                        }
                      />{" "}
                      Present
                    </label>
                    <label>
                      <input
                        type="radio"
                        checked={attendanceData[s._id] === "absent"}
                        onChange={() =>
                          handleAttendanceChange(s._id, "absent")
                        }
                      />{" "}
                      Absent
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleMarkAttendance}
              className="w-full bg-green-600 text-white py-3 rounded"
            >
              Mark Attendance ({students.length})
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherAttendance;
