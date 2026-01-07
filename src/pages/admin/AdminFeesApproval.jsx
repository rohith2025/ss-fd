import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import SearchableDropdown from "../../components/SearchableDropdown";
import api from "../../api/axios";
import { toast } from "react-toastify";

const semesters = ["sem1","sem2","sem3","sem4","sem5","sem6","sem7","sem8"];

const AdminFeesApproval = () => {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [semester, setSemester] = useState("");
  const [fees, setFees] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get("/admin/users");
      setStudents(res.data.filter(u => u.role === "student"));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFees = async (id) => {
    try {
      const res = await api.get(`/fees/${id}`);
      setFees(res.data);
    } catch (err) {
      console.error("Failed to fetch fees");
      setFees(null);
    }
  };

  const handleStudentSelect = (id) => {
    setStudentId(id);
    setSemester("");
    setFees(null);
    if (id) fetchFees(id);
  };

  const handleApprove = async (e) => {
    e.preventDefault();

    if (!studentId || !semester) {
      alert("Select student & semester");
      return;
    }

    try {
      await api.put(`/fees/approve/${studentId}/${semester}`);
      toast.success(`${semester.toUpperCase()} approved`)
      fetchFees(studentId);
      setSemester("");
    } catch (err) {
      alert("Approval failed");
      toast.error("Approval failed");
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-xl font-semibold mb-6">Fees Approval</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <form onSubmit={handleApprove} className="space-y-4">
            <SearchableDropdown
              options={students}
              value={studentId}
              onChange={handleStudentSelect}
              placeholder="Select student"
            />

            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select semester</option>
              {semesters.map((s) => (
                <option key={s} value={s}>{s.toUpperCase()}</option>
              ))}
            </select>
            <div className="text-center">

            <button className="bg-sky-600 text-white px-4 py-2 rounded">
              Approve Fee
            </button>
            </div>
          </form>

          <div>
            <h2 className="text-xl font-semibold mb-6">Fee Status</h2>

            {!fees ? (
              <p className="text-sm text-gray-500">
                Select a student to view status
              </p>
            ) : (
              <div className="border rounded divide-y">
                {semesters.map((sem) => (
                  <div key={sem} className="flex justify-between px-4 py-2">
                    <span>{sem.toUpperCase()}</span>
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        fees.semesters[sem]?.paid
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {fees.semesters[sem]?.paid ? "PAID" : "PENDING"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminFeesApproval;
