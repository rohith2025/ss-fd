import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import ParentAttendanceOverlay from "../../components/ParentAttendanceOverlay";
import ParentGradesOverlay from "../../components/ParentGradesOverlay";

const ParentAcademicOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAttendance, setShowAttendance] = useState(false);
  const [showGrades, setShowGrades] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const childRes = await api.get("/parent/child");
      if (!childRes.data?.child) {
        setLoading(false);
        return;
      }

      const studentId = childRes.data.child._id;
      const profileRes = await api.get(
        `/parent/child/${studentId}/profile`
      );
      setData(profileRes.data);
    } catch (err) {
      console.error("Failed to load parent overview", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <p className="p-6 text-gray-500">Loading...</p>
      </DashboardLayout>
    );
  }

  if (!data?.student) {
    return (
      <DashboardLayout>
        <p className="p-6 text-gray-500">No child linked</p>
      </DashboardLayout>
    );
  }

  /* ================= ATTENDANCE PERCENTAGE ================= */
  const attendance = data.attendance || [];
  const attendancePercentage =
    attendance.length === 0
      ? "0.0"
      : (
          (attendance.filter(a => a.status === "present").length /
            attendance.length) *
          100
        ).toFixed(1);

  return (
    <DashboardLayout>
      {/* HEADER */}
      <div className="bg-white shadow-sm px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Parent Academic Overview
        </h1>
        <p className="text-sm text-gray-500">
          Monitoring {data.student.name}
        </p>
      </div>

      {/* CARDS */}
      <div className="p-6 flex flex-col lg:flex-row gap-6">

        {/* PROFILE CARD */}
        <div className="flex-1 bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-lg font-medium text-gray-700 mb-2">
            Student Profile
          </h2>
          <p className="text-sm text-gray-600">
            Branch: {data.student.branch}
          </p>
          <p className="text-sm text-gray-600">
            Year: {data.student.year}
          </p>
          <p className="text-sm text-gray-600">
            Section: {data.student.section}
          </p>
        </div>

        {/* ATTENDANCE CARD */}
        <div className="flex-1 bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-lg font-medium text-gray-700 mb-4">
            Attendance
          </h2>

          <div
            onClick={() => setShowAttendance(true)}
            className="p-6 rounded-lg cursor-pointer transition hover:shadow-md hover:bg-gray-50 text-center"
          >
            <div className="text-sm text-gray-500 mb-2">
              Overall Attendance
            </div>

            <div className="text-5xl font-bold text-sky-600 mb-2">
              {attendancePercentage}%
            </div>

            <div className="text-xs text-gray-400">
              Total Records: {attendance.length}
            </div>

            <div className="text-xs text-gray-400 mt-1">
              Click to view details
            </div>
          </div>
        </div>

        {/* CGPA CARD */}
        <div className="flex-1 bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-lg font-medium text-gray-700 mb-4">
            Academic Performance
          </h2>

          {data.grades ? (
            <div
              onClick={() => setShowGrades(true)}
              className="p-6 rounded-lg cursor-pointer transition hover:shadow-md hover:bg-gray-50 text-center"
            >
              <div className="text-sm text-gray-500 mb-2">
                Current CGPA
              </div>

              <div className="text-5xl font-bold text-sky-600 mb-2">
                {data.grades.cgpa}
              </div>

              <div className="text-xs text-gray-400">
                Click to view semester details
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center">
              Grades not published yet
            </p>
          )}
        </div>
      </div>

{/* LINKED FACULTY */}
<div className="px-6 pb-6">
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-5">
      Linked Faculty
    </h3>

    {/* COLUMN WISE */}
    <div className="flex flex-col gap-4">

      {/* HOD */}
      <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition">
        <div className="w-11 h-11 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600">
          🎓
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-1">HOD</p>
          {data.linkedUsers.hod ? (
            <ul className="space-y-1">
              <li className="text-sm font-medium text-gray-800">
                • {data.linkedUsers.hod.name}
              </li>
            </ul>
          ) : (
            <p className="text-sm font-medium text-gray-400">
              Not Assigned
            </p>
          )}
        </div>
      </div>

      {/* Exam Head */}
      <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition">
        <div className="w-11 h-11 flex items-center justify-center rounded-lg bg-purple-100 text-purple-600">
          📝
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-1">Exam Head</p>
          {data.linkedUsers.examHead ? (
            <ul className="space-y-1">
              <li className="text-sm font-medium text-gray-800">
                • {data.linkedUsers.examHead.name}
              </li>
            </ul>
          ) : (
            <p className="text-sm font-medium text-gray-400">
              Not Assigned
            </p>
          )}
        </div>
      </div>

      {/* Teachers */}
      <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition">
        <div className="w-11 h-11 flex items-center justify-center rounded-lg bg-green-100 text-green-600">
          👩‍🏫
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-1">Teachers</p>

          {data.linkedUsers.teachers?.length ? (
            <ul className="space-y-1">
              {data.linkedUsers.teachers.map((t, index) => (
                <li
                  key={index}
                  className="text-sm font-medium text-gray-800"
                >
                  • {t.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm font-medium text-gray-400">
              Not Assigned
            </p>
          )}
        </div>
      </div>

    </div>
  </div>
</div>



      {/* OVERLAYS */}
      <ParentAttendanceOverlay
        open={showAttendance}
        onClose={() => setShowAttendance(false)}
        attendance={attendance}
      />

      {data.grades && (
        <ParentGradesOverlay
          open={showGrades}
          onClose={() => setShowGrades(false)}
          grades={data.grades}
        />
      )}
    </DashboardLayout>
  );
};

export default ParentAcademicOverview;
