import { useEffect, useState } from "react";
import api from "../../api/axios";
import DashboardLayout from "../../components/DashboardLayout";


const ParentDashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await api.get("/leaves/parent");
        setLeaves(res.data || []);
      } catch (err) {
        console.error("Failed to load leave requests");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  const pendingLeaves = leaves.filter(
    (l) => l.parentStatus === "pending"
  );

  const handleAction = async (leaveId, status) => {
    try {
      await api.put(`/leaves/parent/${leaveId}`, { status });

      setLeaves((prev) =>
        prev.map((leave) =>
          leave._id === leaveId
            ? { ...leave, parentStatus: status, finalStatus: status }
            : leave
        )
      );
    } catch (err) {
      console.error("Failed to update leave");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-50">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <DashboardLayout>
      {/* Navbar */}
      <div className="bg-white shadow-sm px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Parent Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Review and manage your child’s leave requests
        </p>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-lg font-medium text-gray-700 mb-4">
            Pending Leave Requests
          </h2>

          {pendingLeaves.length === 0 ? (
            <p className="text-sm text-gray-500">
              No pending leave requests !!
            </p>
          ) : (
            <div className="space-y-4">
              {pendingLeaves.map((leave) => (
                <div
                  key={leave._id}
                  className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">From:</span>{" "}
                      {new Date(leave.fromDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">To:</span>{" "}
                      {new Date(leave.toDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Reason: {leave.reason}
                    </p>
                  </div>

                  <div className="flex gap-3 mt-3 md:mt-0">
                    <button
                      onClick={() =>
                        handleAction(leave._id, "approved")
                      }
                      className="px-4 py-1.5 bg-green-500 text-white text-sm rounded-md hover:bg-green-600"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        handleAction(leave._id, "rejected")
                      }
                      className="px-4 py-1.5 bg-red-500 text-white text-sm rounded-md hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ParentDashboard;
