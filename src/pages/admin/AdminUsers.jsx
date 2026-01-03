import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import { getUserLinks } from "../../api/admin.api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [userLinks, setUserLinks] = useState(null);
  const [loadingLinks, setLoadingLinks] = useState(false);

  // Filters
  const [searchText, setSearchText] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

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

  const handleViewLinks = async (studentId) => {
    if (selectedStudentId === studentId && userLinks) {
      // Toggle off if clicking same student
      setSelectedStudentId(null);
      setUserLinks(null);
      return;
    }

    setSelectedStudentId(studentId);
    setLoadingLinks(true);
    try {
      const res = await getUserLinks(studentId);
      setUserLinks(res.data);
    } catch (err) {
      console.error("Failed to fetch user links");
      setUserLinks(null);
    } finally {
      setLoadingLinks(false);
    }
  };

  // Get unique branches dynamically
  const branchOptions = [
    "all",
    ...Array.from(
      new Set(
        users
          .map((u) => u.branch)
          .filter((b) => b && b.trim() !== "")
      )
    ),
  ];

  // Filter logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !searchText ||
      user.name.toLowerCase().includes(searchText.toLowerCase());

    const matchesRole =
      selectedRole === "all" || user.role === selectedRole;

    const matchesBranch =
      selectedBranch === "all" ||
      (user.branch || "N/A") === selectedBranch;

    const matchesYear =
      selectedYear === "all" ||
      String(user.year || "N/A") === selectedYear;

    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "active" && user.isActive) ||
      (selectedStatus === "inactive" && !user.isActive);

    return (
      matchesSearch &&
      matchesRole &&
      matchesBranch &&
      matchesYear &&
      matchesStatus
    );
  });

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          User Management
        </h1>

        {/* Filters */}
        {!loading && users.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm w-48"
            />

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Roles</option>
              <option value="student">Student</option>
              <option value="parent">Parent</option>
              <option value="teacher">Teacher</option>
              <option value="hod">HOD</option>
              <option value="exam_head">Exam Head</option>
              <option value="lab_assistant">Lab Assistant</option>
              <option value="admin">Admin</option>
            </select>

            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              {branchOptions.map((b) => (
                <option key={b} value={b}>
                  {b === "all" ? "All Branches" : b}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Years</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="N/A">N/A</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        )}

        {loading ? (
          <p className="text-gray-500 text-sm">Loading users...</p>
        ) : filteredUsers.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No users match the selected filters
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-sky-50">
                <tr>
                  <th className="border px-3 py-2 text-left">Name</th>
                  <th className="border px-3 py-2 text-left">Email</th>
                  <th className="border px-3 py-2 text-left">Role</th>
                  <th className="border px-3 py-2 text-left">Branch</th>
                  <th className="border px-3 py-2 text-left">Subjects</th>
                  <th className="border px-3 py-2 text-left">Year</th>
                  <th className="border px-3 py-2 text-left">Status</th>
                  <th className="border px-3 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <>
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="border px-3 py-2">{user.name}</td>
                      <td className="border px-3 py-2">{user.email}</td>
                      <td className="border px-3 py-2 capitalize">{user.role}</td>
                      <td className="border px-3 py-2">
                        {user.branch || "N/A"}
                      </td>
                      <td className="border px-3 py-2">
                        {user.subjects?.length
                          ? user.subjects.join(", ")
                          : "N/A"}
                      </td>
                      <td className="border px-3 py-2">
                        {user.year || "N/A"}
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
                      <td className="border px-3 py-2">
                        {user.role === "student" && (
                          <button
                            onClick={() => handleViewLinks(user._id)}
                            className="text-xs text-sky-600 hover:text-sky-700"
                          >
                            {selectedStudentId === user._id ? "Hide Links" : "View Links"}
                          </button>
                        )}
                      </td>
                    </tr>
                    {user.role === "student" && selectedStudentId === user._id && (
                      <tr>
                        <td colSpan="8" className="border px-3 py-4 bg-gray-50">
                          {loadingLinks ? (
                            <p className="text-sm text-gray-500">Loading links...</p>
                          ) : userLinks ? (
                            <div className="space-y-3">
                              <h3 className="font-medium text-gray-700 mb-2">User Links</h3>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">Parent:</span>
                                  <span className="ml-2 text-gray-800">
                                    {userLinks.parent ? `${userLinks.parent.name} (${userLinks.parent.email})` : "Not Linked"}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500">HOD:</span>
                                  <span className="ml-2 text-gray-800">
                                    {userLinks.hod ? `${userLinks.hod.name} (${userLinks.hod.email})` : "Not Linked"}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Exam Head:</span>
                                  <span className="ml-2 text-gray-800">
                                    {userLinks.examHead ? `${userLinks.examHead.name} (${userLinks.examHead.email})` : "Not Linked"}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Teachers:</span>
                                  <span className="ml-2 text-gray-800">
                                    {userLinks.teachers && userLinks.teachers.length > 0
                                      ? userLinks.teachers.map((t) => `${t.name} (${t.email})`).join(", ")
                                      : "Not Linked"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">No links found</p>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
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
