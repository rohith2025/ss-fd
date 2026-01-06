import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";

const StudentExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(""); 

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

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getDay = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "long",
    });
  };

  const filteredExams = exams.filter((exam) =>
    exam.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          My Exams
        </h1>

        {!loading && exams.length > 0 && (
          <input
            type="text"
            placeholder="Search exam by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4 w-full max-w-md border rounded-md px-3 py-2 text-sm"
          />
        )}

        {loading ? (
          <p className="text-gray-500 text-sm">Loading exams...</p>
        ) : filteredExams.length === 0 ? (
          <p className="text-gray-500 text-sm">
            {exams.length === 0
              ? "No exams scheduled"
              : "No exams match your search"}
          </p>
        ) : (
          <div className="space-y-4">
            {filteredExams.map((exam) => (
              <div
                key={exam._id}
                className="border rounded-lg p-4 hover:shadow-sm transition"
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

                <p className="text-sm text-gray-600 mt-1">
                  Date: {formatDate(exam.examDate)} ({getDay(exam.examDate)})
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Timing: {exam.timing}
                </p>

                <div className="mt-2 flex flex-wrap gap-3">
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

                  {exam.pyqFiles?.map((file, index) => (
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
