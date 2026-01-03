import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import SearchableDropdown from "../../components/SearchableDropdown";
import api from "../../api/axios";

const TeacherStudentThesis = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [thesisList, setThesisList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get("/teacher/dashboard");
      setStudents(res.data.students || []);
    } catch (err) {
      console.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentThesis = async (studentId) => {
    try {
      const res = await api.get(`/thesis/student/${studentId}`);
      setThesisList(res.data || []);
    } catch (err) {
      console.error("Failed to fetch thesis");
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          Student Thesis
        </h1>

        <div className="mb-6 w-full md:w-1/2">
          <SearchableDropdown
            options={students.map((s) => ({
              _id: s._id || s.student?._id,
              name: s.studentName || s.student?.name,
            }))}
            value={selectedStudent}
            onChange={(value) => {
              setSelectedStudent(value);
              if (value) {
                fetchStudentThesis(value);
              } else {
                setThesisList([]);
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
