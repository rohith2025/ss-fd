import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import SearchableDropdown from "../../components/SearchableDropdown";
import { getLinkedStudents, addOrUpdateGrades } from "../../api/examHead.api";

const ExamHeadManageGrades = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [semester, setSemester] = useState("");
  const [sgpa, setSgpa] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await getLinkedStudents();
      setStudents(res.data || []);
    } catch (err) {
      console.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addOrUpdateGrades({
        studentId: selectedStudent,
        semester,
        sgpa: parseFloat(sgpa),
        cgpa: parseFloat(cgpa),
      });

      alert("Grades updated successfully");
      setSelectedStudent("");
      setSemester("");
      setSgpa("");
      setCgpa("");
    } catch (err) {
      console.error("Failed to update grades");
      alert("Failed to update grades");
    }
  };

  const selectedStudentData = students.find((s) => s._id === selectedStudent);

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          Manage Grades
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Add or update student grades
        </p>

        {loading ? (
          <p className="text-gray-500 text-sm">Loading students...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
            {/* Searchable Student Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student
              </label>
              <SearchableDropdown
                options={students}
                value={selectedStudent}
                onChange={setSelectedStudent}
                placeholder="Search student by name or email..."
                required
              />
              {selectedStudentData && (
                <p className="text-xs text-gray-500 mt-1">
                  Selected: {selectedStudentData.name} - {selectedStudentData.branch} | Year {selectedStudentData.year}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Semester
              </label>
              <input
                type="text"
                placeholder="e.g., Sem 1, Sem 2"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                required
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SGPA
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  placeholder="0.00"
                  value={sgpa}
                  onChange={(e) => setSgpa(e.target.value)}
                  required
                  className="w-full border rounded-md px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CGPA
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  placeholder="0.00"
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  required
                  className="w-full border rounded-md px-3 py-2 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-sky-600 text-white px-5 py-2 rounded-md text-sm hover:bg-sky-700"
            >
              Update Grades
            </button>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ExamHeadManageGrades;

