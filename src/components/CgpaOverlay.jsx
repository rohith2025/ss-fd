import { useEffect, useState } from "react";

const CgpaOverlay = ({ isOpen, onClose, grades }) => {
  const [selectedSemester, setSelectedSemester] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Auto-select first semester when overlay opens
      if (grades?.semesters && grades.semesters.length > 0) {
        const firstSemester = Math.min(...grades.semesters.map(s => s.semester));
        setSelectedSemester(firstSemester);
      }
    } else {
      document.body.style.overflow = 'unset';
      setSelectedSemester(null);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, grades]);

  if (!isOpen || !grades) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Semester Performance</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {grades.semesters && grades.semesters.length > 0 ? (
            <div className="space-y-6">
              {/* Overall CGPA */}
              <div className="text-center bg-sky-50 rounded-lg p-6">
                <div className="text-sm text-gray-500 mb-1">Overall CGPA</div>
                <div className="text-4xl font-bold text-sky-600">{grades.cgpa || 'N/A'}</div>
              </div>

              {/* Semester Grid */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Semester-wise Performance</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {grades.semesters
                    .sort((a, b) => a.semester - b.semester)
                    .map((semester) => (
                    <div
                      key={semester.semester}
                      onClick={() => setSelectedSemester(semester.semester)}
                      className={`bg-white border-2 rounded-lg p-4 text-center transition-all duration-200 cursor-pointer ${
                        selectedSemester === semester.semester
                          ? 'border-sky-500 bg-sky-50 shadow-md'
                          : 'border-gray-200 hover:border-sky-300 hover:shadow-md'
                      }`}
                    >
                      <div className="text-sm text-gray-500 mb-1">Semester {semester.semester}</div>
                      <div className="text-2xl font-bold text-gray-700">{semester.sgpa}</div>
                      <div className="text-xs text-gray-400 mt-1">SGPA</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subject Details */}
              {selectedSemester && (
                <div className="border-t pt-6">
                  <h4 className="text-lg font-medium text-gray-700 mb-4">
                    Semester {selectedSemester} - Subject Details
                  </h4>
                  {(() => {
                    const selectedSemData = grades.semesters.find(s => s.semester === selectedSemester);
                    if (selectedSemData?.subjects && selectedSemData.subjects.length > 0) {
                      return (
                        <div className="bg-gray-50 rounded-lg overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Subject
                                  </th>
                                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Grade
                                  </th>
                                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Credits
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {selectedSemData.subjects.map((subject, idx) => (
                                  <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                      {subject.name}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-center font-semibold text-gray-700">
                                      {subject.grade}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-center text-gray-500">
                                      {subject.credits}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div className="bg-gray-50 rounded-lg p-6 text-center">
                          <p className="text-gray-500">No subject details available for this semester</p>
                        </div>
                      );
                    }
                  })()}
                </div>
              )}

            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No semester data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CgpaOverlay;
