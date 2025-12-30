import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";

const StudentTimetable = () => {
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      const res = await api.get("/timetable/my");
      setTimetable(res.data);
    } catch (err) {
      console.error("Failed to fetch timetable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          My Timetable
        </h1>

        {loading ? (
          <p className="text-gray-500 text-sm">
            Loading timetable...
          </p>
        ) : !timetable ? (
          <p className="text-gray-500 text-sm">
            Timetable not available
          </p>
        ) : (
          <div className="space-y-6">
            {timetable.periods.map((period, index) => (
              <div key={index}>
                <h2 className="text-lg font-medium text-sky-700 mb-2">
                  {period.day}
                </h2>

                {period.slots.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No classes
                  </p>
                ) : (
                  <div className="space-y-3">
                    {period.slots.map((slot, idx) => (
                      <div
                        key={idx}
                        className="border rounded-lg p-4 flex justify-between items-center"
                      >
                        <div>
                          <p className="text-gray-800 font-medium">
                            {slot.subject}
                          </p>
                          <p className="text-sm text-gray-500">
                            {slot.teacher?.name || "—"}
                          </p>
                        </div>

                        <span className="text-sm text-gray-600">
                          {slot.time}
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

export default StudentTimetable;
