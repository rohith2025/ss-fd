import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { createTimetable, getTeachersByBranch } from "../../api/timetable.api";
import { useAuth } from "../../context/AuthContext";

const HodTimetable = () => {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fixed time slots
  const timeSlots = [
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 1:00 PM", // LUNCH BREAK
    "1:00 PM - 2:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
  ];

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Form state - slots indexed by day and timeIndex
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [slots, setSlots] = useState({}); // { "Monday-0": { teacher: "", subject: "" }, ... }

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await getTeachersByBranch();
      setTeachers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch teachers");
    } finally {
      setLoading(false);
    }
  };

  const getSlotKey = (day, timeIndex) => `${day}-${timeIndex}`;

  const updateSlot = (day, timeIndex, field, value) => {
    const key = getSlotKey(day, timeIndex);
    setSlots((prev) => {
      const newSlots = { ...prev };
      if (!newSlots[key]) {
        newSlots[key] = { teacher: "", subject: "" };
      }
      newSlots[key][field] = value;
      // If teacher changes, reset subject
      if (field === "teacher") {
        newSlots[key].subject = "";
      }
      return newSlots;
    });
  };

  const getSlotValue = (day, timeIndex, field) => {
    const key = getSlotKey(day, timeIndex);
    return slots[key]?.[field] || "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert slots object to periods format
      const periods = days.map((day) => ({
        day,
        slots: timeSlots.map((time, timeIndex) => {
          const key = getSlotKey(day, timeIndex);
          const slot = slots[key] || {};
          return {
            timeIndex,
            subject: slot.subject || "",
            teacher: slot.teacher || null,
          };
        }),
      }));

      await createTimetable({
        year: parseInt(year),
        section,
        periods,
      });
      alert("Timetable created successfully!");
      // Reset form
      setYear("");
      setSection("");
      setSlots({});
    } catch (err) {
      console.error("Failed to create timetable");
      alert("Failed to create timetable");
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          Create Timetable
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Branch: <span className="font-medium">{user?.managedBranch || "N/A"}</span> (auto-set)
        </p>

        {loading ? (
          <p className="text-gray-500 text-sm">Loading teachers...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Year and Section */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                  className="w-full border rounded-md px-3 py-2 text-sm"
                >
                  <option value="">Select Year</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section
                </label>
                <input
                  type="text"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  required
                  placeholder="e.g., A, B, C"
                  className="w-full border rounded-md px-3 py-2 text-sm"
                />
              </div>
            </div>

            {/* Periods */}
            {days.map((day) => (
              <div key={day} className="border rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-700 mb-3">
                  {day}
                </h3>

                <div className="space-y-3">
                  {timeSlots.map((time, timeIndex) => {
                    const isLunch = timeIndex === 2; // 12:00 PM - 1:00 PM
                    const teacherId = getSlotValue(day, timeIndex, "teacher");
                    const subject = getSlotValue(day, timeIndex, "subject");
                    const selectedTeacher = teachers.find((t) => t._id === teacherId);

                    return (
                      <div
                        key={timeIndex}
                        className={`grid grid-cols-4 gap-3 p-3 rounded ${
                          isLunch ? "bg-yellow-50 border-2 border-yellow-200" : "bg-gray-50"
                        }`}
                      >
                        {/* Time (read-only) */}
                        <div className="flex items-center">
                          <span
                            className={`text-sm font-medium ${
                              isLunch ? "text-yellow-800" : "text-gray-700"
                            }`}
                          >
                            {time}
                            {isLunch && " (LUNCH BREAK)"}
                          </span>
                        </div>

                        {/* Teacher (disabled during lunch) */}
                        <select
                          value={teacherId}
                          onChange={(e) =>
                            updateSlot(day, timeIndex, "teacher", e.target.value)
                          }
                          disabled={isLunch}
                          className={`border rounded px-2 py-1 text-sm ${
                            isLunch
                              ? "bg-yellow-100 text-yellow-700 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <option value="">
                            {isLunch ? "Lunch Break" : "Select Teacher"}
                          </option>
                          {!isLunch &&
                            teachers.map((t) => (
                              <option key={t._id} value={t._id}>
                                {t.name}
                              </option>
                            ))}
                        </select>

                        {/* Subject (disabled during lunch or if no teacher) */}
                        <select
                          value={subject}
                          onChange={(e) =>
                            updateSlot(day, timeIndex, "subject", e.target.value)
                          }
                          disabled={isLunch || !teacherId}
                          className={`border rounded px-2 py-1 text-sm ${
                            isLunch || !teacherId
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <option value="">
                            {isLunch
                              ? "Lunch Break"
                              : !teacherId
                              ? "Select Teacher First"
                              : "Select Subject"}
                          </option>
                          {!isLunch &&
                            teacherId &&
                            selectedTeacher?.subjects?.map((subj) => (
                              <option key={subj} value={subj}>
                                {subj}
                              </option>
                            ))}
                        </select>

                        {/* Clear button (disabled during lunch) */}
                        <button
                          type="button"
                          onClick={() => {
                            const key = getSlotKey(day, timeIndex);
                            setSlots((prev) => {
                              const newSlots = { ...prev };
                              delete newSlots[key];
                              return newSlots;
                            });
                          }}
                          disabled={isLunch}
                          className={`px-2 py-1 rounded text-sm ${
                            isLunch
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-red-500 text-white hover:bg-red-600"
                          }`}
                        >
                          Clear
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <button
              type="submit"
              className="bg-sky-600 text-white px-6 py-2 rounded-md hover:bg-sky-700"
            >
              Create Timetable
            </button>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
};

export default HodTimetable;


