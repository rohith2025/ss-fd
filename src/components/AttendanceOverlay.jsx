import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AttendanceOverlay = ({
  isOpen,
  onClose,
  attendance = [],
  student = {}, // pass student optionally if you have
}) => {
  const [view, setView] = useState("daily");

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  if (!isOpen) return null;

  /* ================= GROUP DATA ================= */
  const groupData = () => {
    if (view === "daily") return attendance;

    const map = {};

    attendance.forEach((a) => {
      const date = new Date(a.date);
      let key = "";

      if (view === "weekly") {
        key = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
      } else {
        key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      }

      if (!map[key]) map[key] = [];
      map[key].push(a);
    });

    return Object.entries(map).map(([key, records]) => ({
      key,
      records,
    }));
  };

  const getPercentage = (records) => {
    const present = records.filter((r) => r.status === "present").length;
    return ((present / records.length) * 100).toFixed(2);
  };

  /* ================= MONTHLY PDF ================= */
  const downloadPDF = () => {
    if (view !== "monthly") return;

    const doc = new jsPDF();

    /* ---------- HEADER ---------- */
    doc.setFontSize(14);
    // doc.text(`Name: ${student?.name || "__________"}`, 14, 18);
    // doc.text(`Year: ${student?.year || "___"}`, 140, 18);

    // doc.text(`Section: ${student?.section || "___"}`, 14, 26);
    doc.text(
      `Month Attendance: ${new Date().toLocaleString("default", {
        month: "long",
        year: "numeric",
      })}`,
      14,
      34
    );

    doc.setLineWidth(0.5);
    doc.line(14, 38, 196, 38);

    /* ---------- SUBJECT SUMMARY ---------- */
    const subjectMap = {};

    attendance.forEach((a) => {
      if (!a.subject) return;

      if (!subjectMap[a.subject]) {
        subjectMap[a.subject] = { conducted: 0, attended: 0 };
      }

      subjectMap[a.subject].conducted += 1;
      if (a.status === "present") {
        subjectMap[a.subject].attended += 1;
      }
    });

    let totalConducted = 0;
    let totalAttended = 0;

    const tableRows = Object.entries(subjectMap).map(
      ([subject, data]) => {
        totalConducted += data.conducted;
        totalAttended += data.attended;

        return [
          subject,
          data.conducted,
          data.attended,
        ];
      }
    );

    const percentage =
      totalConducted === 0
        ? "0.00"
        : ((totalAttended / totalConducted) * 100).toFixed(2);

    autoTable(doc, {
      startY: 44,
      head: [["Subject", "Conducted", "Attended"]],
      body: tableRows,
      styles: { halign: "center" },
      headStyles: { fillColor: [220, 220, 220], textColor: 0 },
      foot: [
        [
          "TOTAL",
          totalConducted,
          totalAttended,
        ],
      ],
      footStyles: {
        fillColor: [240, 240, 240],
        textColor: 0,
        fontStyle: "bold",
      },
    });

    doc.setFontSize(12);
    doc.text(
      `Overall Percentage: ${percentage}%`,
      14,
      doc.lastAutoTable.finalY + 10
    );

    doc.save("Monthly_Attendance_Report.pdf");
  };

  const data = groupData();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Attendance Details
          </h2>

          <div className="flex gap-3">
            {view === "monthly" && (
              <button
                onClick={downloadPDF}
                className="px-4 py-2 text-sm bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
              >
                📥 Download Monthly PDF
              </button>
            )}

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 p-4 border-b">
          {["daily", "weekly", "monthly"].map((t) => (
            <button
              key={t}
              onClick={() => setView(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                view === t
                  ? "bg-sky-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Body (UNCHANGED) */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
          {data.length ? (
            data.map((item, idx) => {
              const records = item.records || [item];
              return (
                <div key={idx} className="bg-gray-50 rounded-lg p-4">
                  {item.key && (
                    <h4 className="font-medium text-gray-700 mb-2">
                      {item.key}
                    </h4>
                  )}

                  <div className="flex justify-between text-sm mb-2">
                    <span>Total: {records.length}</span>
                    <span className="font-semibold text-sky-600">
                      {getPercentage(records)}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {records.map((r, i) => (
                      <div
                        key={i}
                        className={`p-2 rounded text-center text-xs ${
                          r.status === "present"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {new Date(r.date).toLocaleDateString()}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500">
              No attendance data available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceOverlay;
