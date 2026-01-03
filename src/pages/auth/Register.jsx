import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../api/auth.api";
import HomeNavbar from "../HomeNavbar";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    year: "",
    branch: "",
    batch: "",
    section: "",
    managedBranch: "",
    subjects: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      };

      if (form.role === "student") {
        payload.year = form.year;
        payload.branch = form.branch;
        payload.batch = form.batch;
        payload.section = form.section;
      }

      if (
        ["teacher", "hod", "lab_assistant", "exam_head"].includes(form.role)
      ) {
        payload.managedBranch = form.managedBranch;
      }

      if (["teacher", "lab_assistant"].includes(form.role)) {
        payload.subjects = form.subjects
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }

      await registerUser(payload);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <HomeNavbar />

      <div className="min-h-screen flex items-center justify-center bg-sky-50">
        <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            Create Account
          </h2>

          {error && (
            <div className="mt-4 text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Name</label>
              <input
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Password</label>
              <input
                type="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-sky-500"
              >
                <option value="student">Student</option>
                <option value="parent">Parent</option>
                <option value="teacher">Teacher</option>
                <option value="hod">HOD</option>
                <option value="lab_assistant">Lab Assistant</option>
                <option value="exam_head">Exam Head</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {form.role === "student" && (
              <div className="grid grid-cols-2 gap-3">
                <input
                  name="year"
                  placeholder="Year"
                  value={form.year}
                  onChange={handleChange}
                  className="px-3 py-2 border rounded-md"
                />
                <input
                  name="branch"
                  placeholder="Branch"
                  value={form.branch}
                  onChange={handleChange}
                  className="px-3 py-2 border rounded-md"
                />
                <input
                  name="batch"
                  placeholder="Batch"
                  value={form.batch}
                  onChange={handleChange}
                  className="px-3 py-2 border rounded-md"
                />
                <input
                  name="section"
                  placeholder="Section"
                  value={form.section}
                  onChange={handleChange}
                  className="px-3 py-2 border rounded-md"
                />
              </div>
            )}

            {["teacher", "hod", "lab_assistant", "exam_head"].includes(
              form.role
            ) && (
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Managed Branch
                </label>
                <input
                  name="managedBranch"
                  required
                  value={form.managedBranch}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-sky-500"
                />
              </div>
            )}

            {["teacher", "lab_assistant"].includes(form.role) && (
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Subjects (comma separated)
                </label>
                <input
                  name="subjects"
                  value={form.subjects}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-sky-500"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white py-2 rounded-md transition"
            >
              {loading ? "Creating..." : "Register"}
            </button>
          </form>

          <p className="text-sm text-gray-600 text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-sky-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
