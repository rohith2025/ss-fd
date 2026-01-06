import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const HodTimetableList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimetables();
  }, []);

  const fetchTimetables = async () => {
    try {
      const res = await api.get("/hod/timetables");
      setTimetables(res.data || []);
    } catch (err) {
      console.error("Failed to fetch timetables");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (timetableId) => {
    navigate(`/hod/timetable/edit/${timetableId}`);
  };

  const groupTimetables = () => {
    const grouped = {};
    timetables.forEach((timetable) => {
      const key = `${timetable.year}-${timetable.section}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(timetable);
    });
    return grouped;
  };

  const groupedTimetables = groupTimetables();

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              My Timetables
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Branch: <span className="font-medium">{user?.managedBranch || "N/A"}</span>
            </p>
          </div>
          <button
            onClick={() => navigate("/hod/timetable")}
            className="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700 text-sm font-medium"
          >
            Create New Timetable
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="space-y-2">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="h-16 bg-gray-100 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : Object.keys(groupedTimetables).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm mb-4">
              No timetables created yet
            </p>
            <button
              onClick={() => navigate("/hod/timetable")}
              className="bg-sky-600 text-white px-6 py-2 rounded-md hover:bg-sky-700 text-sm"
            >
              Create Your First Timetable
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedTimetables).map(([key, timetableGroup]) => (
              <div key={key}>
                <h2 className="text-lg font-medium text-gray-700 mb-4">
                  Year {key.split('-')[0]} - Section {key.split('-')[1]}
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {timetableGroup.map((timetable) => (
                    <div
                      key={timetable._id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {timetable.day}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {timetable.slots?.length || 0} slots
                          </p>
                        </div>
                        <button
                          onClick={() => handleEdit(timetable._id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                          Edit
                        </button>
                      </div>

                      {timetable.slots && timetable.slots.length > 0 ? (
                        <div className="space-y-2">
                          {timetable.slots.slice(0, 3).map((slot, idx) => (
                            <div key={idx} className="text-xs text-gray-600">
                              <span className="font-medium">
                                {slot.startTime} - {slot.endTime}
                              </span>
                              {slot.subject && (
                                <span className="ml-2">• {slot.subject}</span>
                              )}
                            </div>
                          ))}
                          {timetable.slots.length > 3 && (
                            <p className="text-xs text-gray-400">
                              +{timetable.slots.length - 3} more slots
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400">No slots assigned</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default HodTimetableList;