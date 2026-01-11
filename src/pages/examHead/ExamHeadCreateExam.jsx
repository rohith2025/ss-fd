import { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { createExam } from "../../api/exam.api";
import { toast } from "react-toastify";


const ExamHeadCreateExam = () => {
  const [form, setForm] = useState({
    title: "",
    branch: "",
    year: "",
    examDate: "",
    timing: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.title ||
      !form.branch ||
      !form.year ||
      !form.examDate ||
      !form.timing
    ) {
      toast.warn("All fields are required");
      return;
    }

    setLoading(true);

    try {
      await createExam(form);
      toast.success("Exam created successfully");

      setForm({
        title: "",
        branch: "",
        year: "",
        examDate: "",
        timing: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create exam");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm p-6 w-full">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          Create Exam
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Exam Head can create exams only for their managed branch
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Exam Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Mid-1 Examination"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Branch
            </label>
            <input
              type="text"
              name="branch"
              placeholder="CSE / ECE / MECH"
              value={form.branch}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Year
            </label>
            <select
              name="year"
              value={form.year}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              required
            >
              <option value="">Select Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Exam Date
            </label>
            <input
              type="date"
              name="examDate"
              value={form.examDate}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Exam Timing
            </label>
            <input
              type="text"
              name="timing"
              placeholder="10:00 AM - 1:00 PM"
              value={form.timing}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-600 text-white py-2 rounded-md hover:bg-sky-700 transition"
          >
            {loading ? "Creating..." : "Create Exam"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ExamHeadCreateExam;
