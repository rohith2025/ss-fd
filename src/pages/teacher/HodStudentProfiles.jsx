import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import SearchableDropdown from "../../components/SearchableDropdown";
import { getLinkedStudents, getStudentProfile } from "../../api/hod.api";
import { toast } from "react-toastify";


const HodStudentProfiles = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [showLeaves, setShowLeaves] = useState(false);

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

  const fetchProfile = async (studentId) => {
    setProfileLoading(true);
    try {
      const res = await getStudentProfile(studentId);
      setProfile(res.data);
      toast.success("Student profile loaded");

    } catch (err) {
      console.error("Failed to fetch student profile");
      toast.error("Failed to load student profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleStudentSelect = (studentId) => {
    const student = students.find((s) => s._id === studentId);
    setSelectedStudentId(studentId);
    setSelectedStudent(student);
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
        ) : (
          <div className="space-y-6">
            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Student
              </label>
              <SearchableDropdown
                options={students}
                value={selectedStudentId}
                onChange={handleStudentSelect}
                placeholder="Search student by name or email..."
              />
            </div>

            {profileLoading ? (
              <p className="text-gray-500 text-sm">Loading profile...</p>
            ) : profile ? (
              <div className="space-y-6">
                <div className="border rounded-lg p-4">
                  <h2 className="text-lg font-medium text-gray-700 mb-3">
                    Student Information
                  </h2>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Name:</span>
                      <span className="ml-2 text-gray-800">{profile.student?.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <span className="ml-2 text-gray-800">{profile.student?.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Branch:</span>
                      <span className="ml-2 text-gray-800">{profile.student?.branch || "—"}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Year:</span>
                      <span className="ml-2 text-gray-800">{profile.student?.year || "—"}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Section:</span>
                      <span className="ml-2 text-gray-800">{profile.student?.section || "—"}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Batch:</span>
                      <span className="ml-2 text-gray-800">{profile.student?.batch || "—"}</span>
                    </div>
                  </div>
                </div>

                {profile.grades && (
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h2 className="text-lg font-medium text-gray-700">
                        Grades
                      </h2>
                      {profile.grades.cgpa && (
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Overall CGPA</div>
                          <div className="text-2xl font-bold text-sky-600">{profile.grades.cgpa}</div>
                        </div>
                      )}
                    </div>

                    {profile.grades.semesters && profile.grades.semesters.length > 0 ? (
                      <div className="space-y-3">
                        {profile.grades.semesters
                          .sort((a, b) => a.semester - b.semester)
                          .map((semester) => (
                          <div key={semester.semester} className="border rounded-lg p-3 bg-gray-50">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-medium text-gray-700">
                                Semester {semester.semester}
                              </h3>
                              <div className="text-right">
                                <div className="text-sm text-gray-500">SGPA</div>
                                <div className="text-lg font-semibold text-sky-600">{semester.sgpa}</div>
                              </div>
                            </div>

                            {semester.subjects && semester.subjects.length > 0 ? (
                              <div className="mt-3">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="border-b">
                                      <th className="text-left py-1 text-gray-600">Subject</th>
                                      <th className="text-center py-1 text-gray-600">Grade</th>
                                      <th className="text-center py-1 text-gray-600">Credits</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {semester.subjects.map((subject, idx) => (
                                      <tr key={idx} className="border-b border-gray-200">
                                        <td className="py-1 text-gray-800">{subject.name}</td>
                                        <td className="py-1 text-center font-medium">{subject.grade}</td>
                                        <td className="py-1 text-center">{subject.credits}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 mt-2">No subject details available</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      // Fallback for old data format
                      <div className="text-sm">
                        <p>
                          <span className="text-gray-500">Semester:</span>
                          <span className="ml-2 text-gray-800">{profile.grades.semester}</span>
                        </p>
                        <p>
                          <span className="text-gray-500">SGPA:</span>
                          <span className="ml-2 text-gray-800">{profile.grades.sgpa}</span>
                        </p>
                        <p>
                          <span className="text-gray-500">CGPA:</span>
                          <span className="ml-2 text-gray-800">{profile.grades.cgpa}</span>
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-medium text-gray-700">
                      Attendance ({profile.attendance?.length || 0} records)
                    </h2>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="border rounded-md px-2 py-1 text-xs"
                      placeholder="Filter by date"
                    />
                  </div>
                  
                  {(() => {
                    const filteredAtt = selectedDate
                      ? profile.attendance?.filter((att) => {
                          const attDate = new Date(att.date || att.createdAt);
                          const selectedDateObj = new Date(selectedDate);
                          return (
                            attDate.getDate() === selectedDateObj.getDate() &&
                            attDate.getMonth() === selectedDateObj.getMonth() &&
                            attDate.getFullYear() === selectedDateObj.getFullYear()
                          );
                        }) || []
                      : profile.attendance || [];
                    
                    const presentCount = filteredAtt.filter((att) => att.status === "present").length;
                    const percentage = filteredAtt.length > 0 
                      ? ((presentCount / filteredAtt.length) * 100).toFixed(1) 
                      : 0;
                    
                    return (
                      <>
                        {filteredAtt.length > 0 && (
                          <div className="mb-3 p-2 bg-sky-50 rounded text-sm">
                            <span className="text-gray-700">Attendance Percentage: </span>
                            <span className="text-sky-600 font-semibold">{percentage}%</span>
                            <span className="text-gray-500 text-xs ml-2">
                              ({presentCount} present / {filteredAtt.length} total)
                            </span>
                          </div>
                        )}
                        {filteredAtt.length > 0 ? (
                          <div className="text-sm space-y-1 max-h-40 overflow-auto">
                            {filteredAtt.slice(0, 10).map((att, idx) => (
                              <div key={idx} className="flex justify-between">
                                <span>{att.subject}</span>
                                <span className={att.status === "present" ? "text-green-600" : "text-red-600"}>
                                  {att.status}
                                </span>
                              </div>
                            ))}
                            {filteredAtt.length > 10 && (
                              <p className="text-gray-500 text-xs mt-2">
                                +{filteredAtt.length - 10} more records
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">
                            {selectedDate ? "No attendance records for selected date" : "No attendance records"}
                          </p>
                        )}
                      </>
                    );
                  })()}
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-medium text-gray-700">
                      Approved Leaves
                    </h2>
                    <button
                      onClick={() => setShowLeaves(!showLeaves)}
                      className="text-sm text-sky-600 hover:text-sky-700"
                    >
                      {showLeaves ? "Hide" : "View Approved Leaves"}
                    </button>
                  </div>
                  {showLeaves && (
                    <div>
                      {(() => {
                        const approvedLeaves = profile.leaves?.filter(
                          (leave) => leave.finalStatus === "approved"
                        ) || [];
                        
                        return approvedLeaves.length > 0 ? (
                          <div className="space-y-2">
                            {approvedLeaves.map((leave) => (
                              <div key={leave._id} className="border rounded p-3 bg-green-50">
                                <div className="text-sm">
                                  <p className="font-medium text-gray-700">
                                    {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
                                  </p>
                                  <p className="text-gray-600 mt-1">{leave.reason}</p>
                                  <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                                    Approved
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No approved leaves</p>
                        );
                      })()}
                    </div>
                  )}
                </div>

                <div className="border rounded-lg p-4">
                  <h2 className="text-lg font-medium text-gray-700 mb-3">
                    Activities ({profile.activities?.length || 0} records)
                  </h2>
                  {profile.activities?.length > 0 ? (
                    <div className="text-sm space-y-2 max-h-40 overflow-auto">
                      {profile.activities.slice(0, 5).map((act) => (
                        <div key={act._id} className="flex justify-between items-center">
                          <span>{act.title}</span>
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            act.status === "approved" ? "bg-green-100 text-green-700" :
                            act.status === "rejected" ? "bg-red-100 text-red-700" :
                            "bg-yellow-100 text-yellow-700"
                          }`}>
                            {act.status}
                          </span>
                        </div>
                      ))}
                      {profile.activities.length > 5 && (
                        <p className="text-gray-500 text-xs mt-2">
                          +{profile.activities.length - 5} more activities
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No activities</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Exams
                    </h3>
                    <p className="text-sm text-gray-600">
                      {profile.exams?.length || 0} exam(s)
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Thesis
                    </h3>
                    <p className="text-sm text-gray-600">
                      {profile.thesis?.length || 0} thesis submission(s)
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Leaves
                    </h3>
                    <p className="text-sm text-gray-600">
                      {profile.leaves?.length || 0} leave request(s)
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Fees
                    </h3>
                    <p className="text-sm text-gray-600">
                      {profile.fees ? "Record available" : "No record"}
                    </p>
                  </div>
                </div>
              </div>
            ) : selectedStudent ? (
              <p className="text-gray-500 text-sm">Select a student to view profile</p>
            ) : null}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default HodStudentProfiles;
