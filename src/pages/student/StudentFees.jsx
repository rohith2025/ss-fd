import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";

const StudentFees = () => {
  const [fees, setFees] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const res = await api.get("/fees/my");
      setFees(res.data);
    } catch (err) {
      console.error("Failed to fetch fees");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          My Fees
        </h1>

        {loading ? (
          <p className="text-gray-500 text-sm">Loading fee details...</p>
        ) : !fees ? (
          <p className="text-gray-500 text-sm">
            Fee information not available
          </p>
        ) : (
          <div className="space-y-3">
            {Object.entries(fees.semesters).map(
              ([semester, data]) => (
                <div
                  key={semester}
                  className="border rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="text-gray-700 font-medium capitalize">
                      {semester}
                    </p>
                    <p className="text-sm text-gray-500">
                      Amount: ₹{data.amount}
                    </p>
                  </div>

                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-full ${
                      data.paid
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {data.paid ? "Paid" : "Pending"}
                  </span>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentFees;
