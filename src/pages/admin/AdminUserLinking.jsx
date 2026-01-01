import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import SearchableDropdown from "../../components/SearchableDropdown";
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

  const addTeacher = (id) => {
    if (!teacherIds.includes(id)) {
      setTeacherIds((prev) => [...prev, id]);
    }
  };

  const removeTeacher = (id) => {
    setTeacherIds((prev) => prev.filter((t) => t !== id));
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

  const selectedTeachers = teachers.filter((t) =>
    teacherIds.includes(t._id)
  );

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          User Linking
        </h1>

        {loading ? (
          <p className="text-gray-500 text-sm">Loading users...</p>
        ) : (
          <form onSubmit={handleLinkUsers} className="space-y-5">
            {/* Student */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student
              </label>
              <SearchableDropdown
                options={students}
                value={studentId}
                onChange={setStudentId}
                placeholder="Search student by name or email..."
                required
              />
            </div>

            {/* Parent */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent
              </label>
              <SearchableDropdown
                options={parents}
                value={parentId}
                onChange={setParentId}
                placeholder="Search parent by name or email..."
                required
              />
            </div>

            {/* Teachers / Lab Assistants (Searchable + Multi Select) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teachers / Lab Assistants
              </label>

              <SearchableDropdown
                options={teachers}
                value=""
                onChange={addTeacher}
                placeholder="Search teacher or lab assistant..."
              />

              {/* Selected Teachers */}
              {selectedTeachers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedTeachers.map((t) => (
                    <span
                      key={t._id}
                      className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-xs flex items-center gap-2"
                    >
                      {t.name}
                      <button
                        type="button"
                        onClick={() => removeTeacher(t._id)}
                        className="text-sky-700 hover:text-red-600"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* HOD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                HOD
              </label>
              <SearchableDropdown
                options={hods}
                value={hodId}
                onChange={setHodId}
                placeholder="Search HOD by name or email..."
                required
              />
            </div>

            {/* Exam Head */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exam Head
              </label>
              <SearchableDropdown
                options={examHeads}
                value={examHeadId}
                onChange={setExamHeadId}
                placeholder="Search exam head by name or email..."
                required
              />
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
