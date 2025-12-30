import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";

const AdminUserLinking = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected IDs
  const [studentId, setStudentId] = useState("");
  const [parentId, setParentId] = useState("");
  const [teacherIds, setTeacherIds] = useState([]);
  const [hodId, setHodId] = useState("");
  const [examHeadId, setExamHeadId] = useState("");

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

  const handleTeacherToggle = (id) => {
    setTeacherIds((prev) =>
      prev.includes(id)
        ? prev.filter((t) => t !== id)
        : [...prev, id]
    );
  };

  const handleLinkUsers = async (e) => {
    e.preventDefault();
    try {
      await api.put("/admin/link-user", {
        studentId,
        parentId,
        teacherIds,
        hodId,
        examHeadId,
      });

      alert("Users linked successfully");

      // Reset form
      setStudentId("");
      setParentId("");
      setTeacherIds([]);
      setHodId("");
      setExamHeadId("");
    } catch (err) {
      console.error("Failed to link users");
      alert("Failed to link users");
    }
  };

  // Filter users by role
  const students = users.filter((u) => u.role === "student");
  const parents = users.filter((u) => u.role === "parent");
  const teachers = users.filter(
    (u) => u.role === "teacher" || u.role === "lab_assistant"
  );
  const hods = users.filter((u) => u.role === "hod");
  const examHeads = users.filter((u) => u.role === "exam_head");

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          User Linking
        </h1>

        {loading ? (
          <p className="text-gray-500 text-sm">
            Loading users...
          </p>
        ) : (
          <form
            onSubmit={handleLinkUsers}
            className="space-y-5"
          >
            {/* Student */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student
              </label>
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                <option value="">Select student</option>
                {students.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Parent */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent
              </label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                required
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                <option value="">Select parent</option>
                {parents.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Teachers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teachers / Lab Assistants
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {teachers.map((t) => (
                  <label
                    key={t._id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={teacherIds.includes(t._id)}
                      onChange={() => handleTeacherToggle(t._id)}
                    />
                    {t.name}
                  </label>
                ))}
              </div>
            </div>

            {/* HOD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                HOD
              </label>
              <select
                value={hodId}
                onChange={(e) => setHodId(e.target.value)}
                required
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                <option value="">Select HOD</option>
                {hods.map((h) => (
                  <option key={h._id} value={h._id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Exam Head */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exam Head
              </label>
              <select
                value={examHeadId}
                onChange={(e) => setExamHeadId(e.target.value)}
                required
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                <option value="">Select Exam Head</option>
                {examHeads.map((e) => (
                  <option key={e._id} value={e._id}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="bg-sky-600 text-white px-5 py-2 rounded-md text-sm hover:bg-sky-700"
            >
              Link Users
            </button>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminUserLinking;
