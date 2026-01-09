import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import SearchableDropdown from "../../components/SearchableDropdown";
import { getLinkedStudents, addOrUpdateGrades } from "../../api/examHead.api";

const ExamHeadManageGrades = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [semester, setSemester] = useState("");
  const [sgpa, setSgpa] = useState("");
  const [subjects, setSubjects] = useState([{ name: "", grade: "", credits: "" }]);
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
      const validSubjects = subjects.filter(sub =>
        sub.name.trim() && sub.grade.trim() && sub.credits
      ).map(sub => ({
        name: sub.name.trim(),
        grade: sub.grade.trim(),
        credits: parseInt(sub.credits, 10)
      }));

      await addOrUpdateGrades({
        studentId: selectedStudent,
        semester: parseInt(semester, 10),
        sgpa: parseFloat(sgpa),
        subjects: validSubjects,
      });

      alert("Grades updated successfully");
      setSelectedStudent("");
      setSemester("");
      setSgpa("");
      setSubjects([{ name: "", grade: "", credits: "" }]);
    } catch (err) {
      console.error("Failed to update grades");
      alert("Failed to update grades");
    }
  };

  const addSubject = () => {
    setSubjects([...subjects, { name: "", grade: "", credits: "" }]);
  };

  const removeSubject = (index) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((_, i) => i !== index));
    }
  };

  const updateSubject = (index, field, value) => {
    const updatedSubjects = subjects.map((subject, i) =>
      i === index ? { ...subject, [field]: value } : subject
    );
    setSubjects(updatedSubjects);
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
          <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Semester
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  required
                  className="w-full border rounded-md px-3 py-2 text-sm"
                >
                  <option value="">Select Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>Semester {num}</option>
                  ))}
                </select>
              </div>

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
            </div>

            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-700">Subjects</h3>
                <button
                  type="button"
                  onClick={addSubject}
                  className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700"
                >
                  + Add Subject
                </button>
              </div>

              <div className="space-y-3">
                {subjects.map((subject, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Subject Name"
                        value={subject.name}
                        onChange={(e) => updateSubject(index, 'name', e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="w-20">
                      <select
                        value={subject.grade}
                        onChange={(e) => updateSubject(index, 'grade', e.target.value)}
                        className="w-full border rounded-md px-2 py-2 text-sm"
                      >
                        <option value="">Grade</option>
                        <option value="O">O (10)</option>
                        <option value="A+">A+ (9)</option>
                        <option value="A">A (8)</option>
                        <option value="B+">B+ (7)</option>
                        <option value="B">B (6)</option>
                        <option value="C+">C+ (5)</option>
                        <option value="C">C (4)</option>
                        <option value="D+">D+ (3)</option>
                        <option value="D">D (2)</option>
                        <option value="F">F (0)</option>
                      </select>
                    </div>
                    <div className="w-20">
                      <input
                        type="number"
                        placeholder="Credits"
                        min="1"
                        max="10"
                        value={subject.credits}
                        onChange={(e) => updateSubject(index, 'credits', e.target.value)}
                        className="w-full border rounded-md px-2 py-2 text-sm"
                      />
                    </div>
                    {subjects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSubject(index)}
                        className="text-red-600 hover:text-red-800 text-xl"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
              <strong>Note:</strong> CGPA will be automatically calculated based on all semester grades and subject credits.
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

