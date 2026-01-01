import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import SearchableDropdown from "../../components/SearchableDropdown";
import api from "../../api/axios";

const HodStudentProfiles = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  /* ================= FETCH LINKED STUDENTS (HOD) ================= */
  const fetchStudents = async () => {
    try {
      // ✅ HOD students come from teacher dashboard logic
      const res = await api.get("/teacher/dashboard");
      setStudents(res.data.students || []);
    } catch (err) {
      console.error("Failed to fetch HOD students", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH STUDENT PROFILE ================= */
  const fetchProfile = async (studentId) => {
    setProfileLoading(true);
    try {
      // ✅ Unified profile API (teacher + HOD)
      const res = await api.get(`/teacher/student/${studentId}`);
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch student profile", err);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleStudentSelect = (studentId) => {
    setSelectedStudentId(studentId);
    if (studentId) {
      fetchProfile(studentId);
    } else {
      setProfile(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-2">
          HOD – Student Profiles
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          View complete academic details of students under your branch
        </p>

        {loading ? (
          <p className="text-gray-500 text-sm">Loading students...</p>
        ) : students.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No students linked to you
          </p>
        ) : (
          <div className="space-y-6">
            {/* ================= STUDENT SELECT ================= */}
            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Student
              </label>
              <SearchableDropdown
                options={students.map((s) => ({
                  _id: s._id,
                  name: s.studentName,
                }))}
                value={selectedStudentId}
                onChange={handleStudentSelect}
                placeholder="Search student by name..."
              />
            </div>

            {/* ================= PROFILE ================= */}
            {profileLoading ? (
              <p className="text-gray-500 text-sm">Loading profile...</p>
            ) : profile ? (
              <div className="space-y-6">
                {/* ---------- Attendance ---------- */}
                <div className="border rounded-lg p-4">
                  <h2 className="text-lg font-medium text-gray-700 mb-3">
                    Attendance ({profile.attendance?.length || 0})
                  </h2>
                  {profile.attendance?.length > 0 ? (
                    <div className="space-y-1 text-sm max-h-40 overflow-auto">
                      {profile.attendance.map((a, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>{a.subject}</span>
                          <span
                            className={
                              a.status === "present"
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {a.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No attendance records
                    </p>
                  )}
                </div>

                {/* ---------- Activities ---------- */}
                <div className="border rounded-lg p-4">
                  <h2 className="text-lg font-medium text-gray-700 mb-3">
                    Activities ({profile.activities?.length || 0})
                  </h2>
                  {profile.activities?.length > 0 ? (
                    <div className="space-y-2 text-sm max-h-40 overflow-auto">
                      {profile.activities.map((act) => (
                        <div
                          key={act._id}
                          className="flex justify-between items-center"
                        >
                          <span>{act.title}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs ${
                              act.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : act.status === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {act.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No activities
                    </p>
                  )}
                </div>

                {/* ---------- Grades ---------- */}
                <div className="border rounded-lg p-4">
                  <h2 className="text-lg font-medium text-gray-700 mb-3">
                    Grades
                  </h2>
                  {profile.grades ? (
                    <div className="text-sm space-y-1">
                      <p>Semester: {profile.grades.semester}</p>
                      <p>SGPA: {profile.grades.sgpa}</p>
                      <p>CGPA: {profile.grades.cgpa}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No grades available
                    </p>
                  )}
                </div>

                {/* ---------- Thesis ---------- */}
                <div className="border rounded-lg p-4">
                  <h2 className="text-lg font-medium text-gray-700 mb-3">
                    Thesis ({profile.thesis?.length || 0})
                  </h2>
                  <p className="text-sm text-gray-600">
                    {profile.thesis?.length > 0
                      ? "Thesis submissions available"
                      : "No thesis submitted"}
                  </p>
                </div>
              </div>
            ) : selectedStudentId ? (
              <p className="text-gray-500 text-sm">
                Select a student to view profile
              </p>
            ) : null}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default HodStudentProfiles;
