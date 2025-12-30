import { useEffect, useState } from "react";
import api from "../../api/axios";
import DashboardLayout from "../../components/DashboardLayout";


const AdminDashboard = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [transactionsCount, setTransactionsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const usersRes = await api.get("/admin/users");
        const txRes = await api.get("/transactions");

        setUsersCount(usersRes.data.length || 0);
        setTransactionsCount(txRes.data.length || 0);
      } catch (err) {
        console.error("Failed to load admin dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

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
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          System overview and management
        </p>
      </div>

      {/* Main Content */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Users Card */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-lg font-medium text-gray-700 mb-2">
            Total Users
          </h2>
          <p className="text-3xl font-semibold text-sky-600">
            {usersCount}
          </p>
          <p className="text-sm text-gray-500">
            Registered users in system
          </p>
        </div>

        {/* Transactions Card */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-lg font-medium text-gray-700 mb-2">
            Transactions
          </h2>
          <p className="text-3xl font-semibold text-sky-600">
            {transactionsCount}
          </p>
          <p className="text-sm text-gray-500">
            Fee payments recorded
          </p>
        </div>

        {/* Actions Card */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-lg font-medium text-gray-700 mb-2">
            Admin Actions
          </h2>

          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Manage users & roles</li>
            <li>• Link students with parents & staff</li>
            <li>• Approve semester fees</li>
            <li>• Create notices & holidays</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
