import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const StudentsOverlay = ({
  isOpen,
  onClose,
  students = [],
  title = "Linked Students",
}) => {
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  if (!isOpen) return null;

  const downloadCSV = () => {
    const headers = ["Name", "Branch", "Year", "Section"];

    const rows = students.map((s) => [
      s.name || s.studentName || "",
      s.branch || "",
      s.year || "",
      s.section || "",
    ]);

    const csvContent =
      [headers, ...rows]
        .map((e) => e.map(v => `"${v}"`).join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "students_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(title, 14, 18);

    autoTable(doc, {
      startY: 26,
      head: [["#", "Name", "Branch", "Year", "Section"]],
      body: students.map((s, i) => [
        i + 1,
        s.name || s.studentName || "—",
        s.branch || "—",
        s.year || "—",
        s.section || "—",
      ]),
      styles: { halign: "center" },
      headStyles: { fillColor: [14, 165, 233] }, 
      columnStyles: {
        1: { halign: "left" }, 
      },
    });

    doc.save("students_list.pdf");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {title}
          </h2>

          <div className="flex items-center gap-3">
            {students.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowDownloadOptions(!showDownloadOptions)}
                  className="px-4 py-2 text-sm bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
                >
                  📥 Download
                </button>

                {showDownloadOptions && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => {
                        downloadCSV();
                        setShowDownloadOptions(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      CSV
                    </button>
                    <button
                      onClick={() => {
                        downloadPDF();
                        setShowDownloadOptions(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      PDF
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {students.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">#</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Name</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Branch</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Year</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Section</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {students.map((student, index) => (
                    <tr key={student._id || index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-center text-sm">{index + 1}</td>
                      <td className="px-4 py-3 text-left text-sm font-medium">
                        {student.name || student.studentName || "—"}
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        {student.branch || "—"}
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        {student.year || "—"}
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        {student.section || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500">No students available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentsOverlay;
