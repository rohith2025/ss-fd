import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import SearchableDropdown from "../../components/SearchableDropdown";
import api from "../../api/axios";

const semesters = [
  "sem1",
  "sem2",
  "sem3",
  "sem4",
  "sem5",
  "sem6",
  "sem7",
  "sem8",
];

const AdminFeesApproval = () => {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [semester, setSemester] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get("/admin/users");
      const onlyStudents = res.data.filter(
        (u) => u.role === "student"
      );
      setStudents(onlyStudents);
    } catch (err) {
      console.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (e) => {
    e.preventDefault();

    if (!studentId || !semester) {
      alert("Please select student and semester");
      return;
    }

    try {
      await api.put(
        `/fees/approve/${studentId}/${semester}`
      );

      alert(`${semester} approved successfully`);
      setSemester("");
    } catch (err) {
      console.error("Failed to approve fees");
      alert("Approval failed");
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          Fees Approval
        </h1>

        {loading ? (
          <p className="text-gray-500 text-sm">
            Loading students...
          </p>
        ) : (
          <form
            onSubmit={handleApprove}
            className="space-y-5 max-w-md"
          >
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

            {/* Semester */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Semester
              </label>
              <select
                value={semester}
                onChange={(e) =>
                  setSemester(e.target.value)
                }
                required
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                <option value="">Select semester</option>
                {semesters.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="bg-sky-600 text-white px-5 py-2 rounded-md text-sm hover:bg-sky-700"
            >
              Approve Fee
            </button>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminFeesApproval;
