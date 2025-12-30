import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          User Management
        </h1>

        {loading ? (
          <p className="text-gray-500 text-sm">
            Loading users...
          </p>
        ) : users.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No users found
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-sky-50">
                <tr>
                  <th className="border px-3 py-2 text-left">
                    Name
                  </th>
                  <th className="border px-3 py-2 text-left">
                    Email
                  </th>
                  <th className="border px-3 py-2 text-left">
                    Role
                  </th>
                  <th className="border px-3 py-2 text-left">
                    Branch
                  </th>
                  <th className="border px-3 py-2 text-left">
                    Year
                  </th>
                  <th className="border px-3 py-2 text-left">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="border px-3 py-2">
                      {user.name}
                    </td>
                    <td className="border px-3 py-2">
                      {user.email}
                    </td>
                    <td className="border px-3 py-2 capitalize">
                      {user.role}
                    </td>
                    <td className="border px-3 py-2">
                      {user.branch || "—"}
                    </td>
                    <td className="border px-3 py-2">
                      {user.year || "—"}
                    </td>
                    <td className="border px-3 py-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          user.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;
