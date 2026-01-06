import { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  getTeacherClasses,
  getClassStudents,
  markBulkAttendance,
} from "../../api/attendance.api";
import { toast } from "react-toastify";

const StatusBadge = ({ status }) => {
  const styles = {
    present: "bg-green-100 text-green-700",
    absent: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        styles[status] || styles.pending
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const TeacherAttendance = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // STEP 1
  const [selectedDate, setSelectedDate] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");

  // STEP 2
  const [availableClasses, setAvailableClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  // STEP 3
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  /* ================= DATE HANDLER ================= */
  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      const dayName = new Date(date).toLocaleDateString("en-IN", {
        weekday: "long",
      });
      setDayOfWeek(dayName);
    } else {
      setDayOfWeek("");
    }
  };

  /* ================= FETCH CLASSES ================= */
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

  /* ================= SELECT CLASS ================= */
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

      // Default status → present (can be changed to pending later)
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

  /* ================= UPDATE STATUS ================= */
  const handleAttendanceChange = (id, status) => {
    setAttendanceData((prev) => ({ ...prev, [id]: status }));
  };

  /* ================= SUBMIT ================= */
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
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  };

  /* ================= BACK ================= */
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

  /* ================= FILTER ================= */
  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">Mark Attendance</h1>
          {step > 1 && (
            <button
              onClick={handleBack}
              className="border px-4 py-2 rounded text-sm"
            >
              Back
            </button>
          )}
        </div>

        {/* STEP INDICATOR */}
        <div className="flex items-center mb-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
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

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <div className="space-y-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="border px-3 py-2 w-full rounded"
            />
            {dayOfWeek && (
              <p className="text-sky-700 font-medium">Day: {dayOfWeek}</p>
            )}
            <button
              onClick={handleFetchClasses}
              className="w-full bg-sky-600 text-white py-2 rounded"
            >
              Continue
            </button>
          </div>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <div className="grid gap-3">
            {availableClasses.map((c, i) => (
              <div
                key={i}
                onClick={() => handleClassSelect(c)}
                className="border p-4 rounded cursor-pointer hover:bg-sky-50"
              >
                <h4 className="font-medium">{c.subject}</h4>
                <p className="text-sm text-gray-600">
                  Year {c.year} • Section {c.section} • {c.timeSlot}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ================= STEP 3 ================= */}
        {step === 3 && (
          <div className="space-y-4">
            {/* SEARCH */}
            <input
              type="text"
              placeholder="Search student by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border px-3 py-2 w-full rounded"
            />

            <div className="border rounded max-h-96 overflow-y-auto">
              {filteredStudents.map((s) => (
                <div
                  key={s._id}
                  className="border-b p-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{s.name}</p>
                    {s.rollNo && (
                      <p className="text-sm text-gray-500">
                        Roll No: {s.rollNo}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-6">
                    {/* STATUS BADGE */}
                    <StatusBadge status={attendanceData[s._id]} />

                    {/* CONTROLS */}
                    <div className="flex gap-4 text-sm">
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          checked={attendanceData[s._id] === "present"}
                          onChange={() =>
                            handleAttendanceChange(s._id, "present")
                          }
                        />
                        Present
                      </label>
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          checked={attendanceData[s._id] === "absent"}
                          onChange={() =>
                            handleAttendanceChange(s._id, "absent")
                          }
                        />
                        Absent
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleMarkAttendance}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded disabled:opacity-50"
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
