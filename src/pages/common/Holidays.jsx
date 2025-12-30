import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const Holidays = () => {
  const { role } = useAuth();
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  // Admin form state
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      const res = await api.get("/holidays");
      setHolidays(res.data || []);
    } catch (err) {
      console.error("Failed to fetch holidays");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHoliday = async (e) => {
    e.preventDefault();
    try {
      await api.post("/holidays", { name: title, date });
      setTitle("");
      setDate("");
      fetchHolidays();
    } catch (err) {
      console.error("Failed to create holiday");
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          Holidays
        </h1>

        {/* Admin Create Holiday */}
        {role === "admin" && (
          <form
            onSubmit={handleCreateHoliday}
            className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <input
              type="text"
              placeholder="Holiday Name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="border rounded-md px-3 py-2 text-sm"
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="border rounded-md px-3 py-2 text-sm"
            />

            <button
              type="submit"
              className="bg-sky-600 text-white rounded-md px-4 py-2 text-sm hover:bg-sky-700"
            >
              Add Holiday
            </button>
          </form>
        )}

        {/* Holiday List */}
        {loading ? (
          <p className="text-gray-500 text-sm">Loading holidays...</p>
        ) : holidays.length === 0 ? (
          <p className="text-gray-500 text-sm">No holidays found</p>
        ) : (
          <div className="space-y-3">
            {holidays.map((holiday) => (
              <div
                key={holiday._id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <p className="text-gray-700 font-medium">
                  {holiday.name}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(holiday.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Holidays;
