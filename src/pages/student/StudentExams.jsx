import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";

const StudentExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await api.get("/exams/my");
      setExams(res.data || []);
    } catch (err) {
      console.error("Failed to fetch exams");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          My Exams
        </h1>

        {loading ? (
          <p className="text-gray-500 text-sm">Loading exams...</p>
        ) : exams.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No exams scheduled
          </p>
        ) : (
          <div className="space-y-4">
            {exams.map((exam) => (
              <div
                key={exam._id}
                className="border rounded-lg p-4"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-gray-800 font-medium">
                    {exam.title}
                  </h2>

                  <span
                    className={`text-xs px-2 py-1 rounded-full capitalize ${
                      exam.status === "scheduled"
                        ? "bg-yellow-100 text-yellow-700"
                        : exam.status === "ongoing"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {exam.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mt-1">
                  Branch: {exam.branch} • Year: {exam.year}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Timing: {exam.timing}
                </p>

                {/* Files (if available) */}
                <div className="mt-2 space-x-3">
                  {exam.syllabusFile && (
                    <a
                      href={exam.syllabusFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-sky-600 hover:underline"
                    >
                      Syllabus
                    </a>
                  )}

                  {exam.pyqFiles &&
                    exam.pyqFiles.map((file, index) => (
                      <a
                        key={index}
                        href={file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-sky-600 hover:underline"
                      >
                        PYQ {index + 1}
                      </a>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentExams;
