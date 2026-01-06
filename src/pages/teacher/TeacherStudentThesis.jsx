import { useEffect, useState, useRef } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import SearchableDropdown from "../../components/SearchableDropdown";
import api from "../../api/axios";
import { toast } from "react-toastify";

const TeacherStudentThesis = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [thesisList, setThesisList] = useState([]);
  const [loading, setLoading] = useState(true);
  const noThesisToastShown = useRef(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  /* ================= FETCH STUDENTS ================= */
  const fetchStudents = async () => {
    try {
      const res = await api.get("/teacher/dashboard");
      setStudents(res.data.students || []);
    } catch (err) {
      console.error("Failed to fetch students", err);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH THESIS ================= */
  const fetchStudentThesis = async (studentId) => {
    if (!studentId) return;

    try {
      const res = await api.get(`/thesis/student/${studentId}`);
      const list = res.data || [];
      setThesisList(list);

      if (list.length === 0 && !noThesisToastShown.current) {
        toast.info("No thesis uploaded by this student");
        noThesisToastShown.current = true;
      } else if (list.length > 0) {
        toast.success("Thesis records loaded successfully");
        noThesisToastShown.current = false;
      }
    } catch (err) {
      console.error("Failed to fetch thesis", err);
      toast.error("Failed to load thesis");
    }
  };

  /* ================= DROPDOWN OPTIONS (KEY FIX) ================= */
  const studentOptions = students.map((s) => ({
    _id: s._id,                               // REQUIRED
    name: s.name || s.studentName,            // REQUIRED
  }));

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          Student Thesis
        </h1>

        <div className="mb-6 w-full md:w-1/2">
          <SearchableDropdown
            options={studentOptions}
            value={selectedStudent}
            onChange={(studentId) => {
              setSelectedStudent(studentId);
              setThesisList([]);
              noThesisToastShown.current = false;

              if (studentId) {
                fetchStudentThesis(studentId);
              }
            }}
            placeholder="Search student by name..."
          />
        </div>

        {loading ? (
          <p className="text-gray-500 text-sm">
            Loading students...
          </p>
        ) : selectedStudent && thesisList.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No thesis uploaded by this student
          </p>
        ) : (
          <div className="space-y-4">
            {thesisList.map((thesis) => (
              <div
                key={thesis._id}
                className="border rounded-lg p-4"
              >
                <h2 className="text-gray-800 font-medium">
                  {thesis.title}
                </h2>

                <p className="text-sm text-gray-600 mt-1">
                  Subject: {thesis.subject}
                </p>

                <a
                  href={thesis.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-sky-600 hover:underline mt-2 inline-block"
                >
                  View Thesis File
                </a>

                <p className="text-xs text-gray-400 mt-2">
                  Uploaded on{" "}
                  {new Date(thesis.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherStudentThesis;
