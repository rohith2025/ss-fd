import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { getTeacherTimetable } from "../../api/timetable.api";

const TeacherTimetable = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      const res = await getTeacherTimetable();
      setSlots(res.data || []);
    } catch (err) {
      console.error("Failed to fetch timetable");
    } finally {
      setLoading(false);
    }
  };

  // Group slots by day
  const groupedSlots = slots.reduce((acc, slot) => {
    if (!acc[slot.day]) {
      acc[slot.day] = [];
    }
    acc[slot.day].push(slot);
    return acc;
  }, {});

  // Sort slots by time within each day
  Object.keys(groupedSlots).forEach((day) => {
    groupedSlots[day].sort((a, b) => {
      const timeA = a.time.split("-")[0] || "";
      const timeB = b.time.split("-")[0] || "";
      return timeA.localeCompare(timeB);
    });
  });

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          My Timetable
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Your assigned classes and time slots
        </p>

        {loading ? (
          <p className="text-gray-500 text-sm">Loading timetable...</p>
        ) : slots.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No timetable assigned yet
          </p>
        ) : (
          <div className="space-y-6">
            {days.map((day) => {
              const daySlots = groupedSlots[day] || [];
              if (daySlots.length === 0) return null;

              return (
                <div key={day} className="border rounded-lg p-4">
                  <h2 className="text-lg font-medium text-sky-700 mb-3">
                    {day}
                  </h2>
                  <div className="space-y-3">
                    {daySlots.map((slot, idx) => (
                      <div
                        key={idx}
                        className="border rounded-lg p-4 flex justify-between items-center bg-gray-50"
                      >
                        <div>
                          <p className="text-gray-800 font-medium">
                            {slot.subject}
                          </p>
                          <p className="text-sm text-gray-600">
                            {slot.branch} - Year {slot.year} - Section {slot.section}
                          </p>
                        </div>
                        <span className="text-sm text-gray-600 font-medium">
                          {slot.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherTimetable;



