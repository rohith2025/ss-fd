import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import { toast } from "react-toastify";

const StudentLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");

  // 🔍 FILTER STATES
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await api.get("/leaves/my");
      setLeaves(res.data || []);
    } catch (err) {
      console.error("Failed to fetch leaves");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    try {
      await api.post("/leaves/apply", {
        fromDate,
        toDate,
        reason,
      });

      toast.success("Leave applied successfully");
      setFromDate("");
      setToDate("");
      setReason("");
      fetchLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply leave");
    }
  };

  // 📅 GET UNIQUE YEARS FROM LEAVES
  const years = [
    ...new Set(
      leaves.map((l) => new Date(l.fromDate).getFullYear())
    ),
  ];

  // 🔎 FILTER LOGIC
  const filteredLeaves = leaves.filter((leave) => {
    const date = new Date(leave.fromDate);
    const monthMatch =
      selectedMonth === "" ||
      date.getMonth() + 1 === Number(selectedMonth);
    const yearMatch =
      selectedYear === "" ||
      date.getFullYear() === Number(selectedYear);

    return monthMatch && yearMatch;
  });

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          Leave Requests
        </h1>

        {/* ================= APPLY LEAVE ================= */}
        <form
          onSubmit={handleApplyLeave}
          className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            required
            className="border rounded-md px-3 py-2 text-sm"
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            required
            className="border rounded-md px-3 py-2 text-sm"
          />

          <input
            type="text"
            placeholder="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            className="border rounded-md px-3 py-2 text-sm md:col-span-2"
          />

          <button
            type="submit"
            className="bg-sky-600 text-white rounded-md px-4 py-2 text-sm hover:bg-sky-700 md:col-span-4"
          >
            Apply Leave
          </button>
        </form>

        {/* ================= FILTERS ================= */}
        {!loading && leaves.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-5">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option value="">All Months</option>
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i} value={i + 1}>
                  {new Date(0, i).toLocaleString("en-IN", {
                    month: "long",
                  })}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option value="">All Years</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ================= LEAVE LIST ================= */}
        {loading ? (
          <p className="text-gray-500 text-sm">
            Loading leave history...
          </p>
        ) : filteredLeaves.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No leave requests found
          </p>
        ) : (
          <div className="space-y-3">
            {filteredLeaves.map((leave) => (
              <div
                key={leave._id}
                className="border rounded-lg p-4"
              >
                <div className="flex justify-between items-center">
                  <p className="text-gray-700 font-medium">
                    {new Date(leave.fromDate).toLocaleDateString()} →{" "}
                    {new Date(leave.toDate).toLocaleDateString()}
                  </p>

                  <span
                    className={`text-xs px-3 py-1 rounded-full capitalize ${
                      leave.finalStatus === "approved"
                        ? "bg-green-100 text-green-700"
                        : leave.finalStatus === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {leave.finalStatus}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mt-1">
                  Reason: {leave.reason}
                </p>

                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                  <span>Parent: {leave.parentStatus}</span>
                  <span>HOD: {leave.hodStatus}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentLeaves;
