import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const CgpaOverlay = ({ isOpen, onClose, grades }) => {
  const [selectedSemester, setSelectedSemester] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (grades?.semesters?.length) {
        const first = Math.min(
          ...grades.semesters.map((s) => s.semester)
        );
        setSelectedSemester(first);
      }
    } else {
      document.body.style.overflow = "unset";
      setSelectedSemester(null);
    }

    return () => (document.body.style.overflow = "unset");
  }, [isOpen, grades]);

  if (!isOpen || !grades) return null;

  /* ================= PDF GENERATOR ================= */
  const downloadReport = (type = "all", semesterNo = null) => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(16);
    doc.text("Academic Performance Report", 14, y);
    y += 10;

    /* ========== FULL REPORT (CGPA + ALL SEMS) ========== */
    if (type === "all") {
      doc.setFontSize(12);
      doc.text(`Overall CGPA: ${grades.cgpa}`, 14, y);
      y += 10;

      grades.semesters.forEach((sem) => {
        doc.setFontSize(14);
        doc.text(
          `Semester ${sem.semester} (SGPA: ${sem.sgpa})`,
          14,
          y
        );
        y += 6;

        autoTable(doc, {
          startY: y,
          head: [["Subject", "Grade", "Credits"]],
          body: sem.subjects.map((s) => [
            s.name,
            s.grade,
            s.credits,
          ]),
          styles: { halign: "center" },
        });

        y = doc.lastAutoTable.finalY + 10;
      });

      doc.save("CGPA_Full_Report.pdf");
    }

    /* ========== SINGLE SEMESTER (ONLY SGPA) ========== */
    if (type === "semester") {
      const sem = grades.semesters.find(
        (s) => s.semester === semesterNo
      );
      if (!sem) return;

      doc.setFontSize(14);
      doc.text(`Semester ${sem.semester} Report`, 14, y);
      y += 8;

      doc.setFontSize(12);
      doc.text(`SGPA: ${sem.sgpa}`, 14, y);
      y += 8;

      autoTable(doc, {
        startY: y,
        head: [["Subject", "Grade", "Credits"]],
        body: sem.subjects.map((s) => [
          s.name,
          s.grade,
          s.credits,
        ]),
        styles: { halign: "center" },
      });

      doc.save(`Semester_${sem.semester}_Report.pdf`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Semester Performance
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] space-y-6">
          {/* OVERALL CGPA */}
          <div
            onClick={() => downloadReport("all")}
            className="cursor-pointer text-center bg-sky-50 rounded-lg p-6 hover:shadow-md transition"
          >
            <div className="text-sm text-gray-500 mb-1">
              Overall CGPA (Click to Download Full Report)
            </div>
            <div className="text-4xl font-bold text-sky-600">
              {grades.cgpa}
            </div>
          </div>

          {/* SEMESTERS */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Semester-wise Performance
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {grades.semesters
                .sort((a, b) => a.semester - b.semester)
                .map((semester) => (
                  <div
                    key={semester.semester}
                    onClick={() => {
                      setSelectedSemester(semester.semester);
                      downloadReport(
                        "semester",
                        semester.semester
                      );
                    }}
                    className={`cursor-pointer bg-white border-2 rounded-lg p-4 text-center transition ${
                      selectedSemester === semester.semester
                        ? "border-sky-500 bg-sky-50 shadow-md"
                        : "border-gray-200 hover:border-sky-300 hover:shadow-md"
                    }`}
                  >
                    <div className="text-sm text-gray-500">
                      Semester {semester.semester}
                    </div>
                    <div className="text-2xl font-bold text-gray-700">
                      {semester.sgpa}
                    </div>
                    <div className="text-xs text-gray-400">
                      SGPA (Click to Download)
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CgpaOverlay;
