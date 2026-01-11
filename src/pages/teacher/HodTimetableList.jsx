import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const HodTimetableList = () => {
  const { user } = useAuth();

  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);

  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const timeSlots = [
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 1:00 PM",
    "1:00 PM - 2:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
  ];

  useEffect(() => {
    fetchTimetables();
  }, []);

  const fetchTimetables = async () => {
    try {
      const res = await api.get("/timetable/hod/all");
      setTimetables(res.data || []);
    } catch {
      toast.error("Failed to load timetables");
    } finally {
      setLoading(false);
    }
  };

  /* ===== SELECTED TIMETABLE ===== */
  const selectedTimetable = timetables.find(
    (tt) =>
      tt.year === Number(year) &&
      tt.section.toLowerCase() === section.toLowerCase()
  );

  const getCell = (day, time) => {
    if (!selectedTimetable) return null;
    const period = selectedTimetable.periods.find((p) => p.day === day);
    return period?.slots.find((s) => s.time === time);
  };

  /* ===== CSV DOWNLOAD ===== */
  const downloadCSV = () => {
    if (!selectedTimetable) return;

    const headers = ["Time", ...days];

    const rows = timeSlots.map((time) => {
      const row = [time];
      days.forEach((day) => {
        const cell = getCell(day, time);
        row.push(
          cell && cell.subject && cell.subject !== "LUNCH BREAK"
            ? `${cell.subject} (${cell.teacher?.name || "-"})`
            : "-"
        );
      });
      return row;
    });

    const csv =
      [headers, ...rows]
        .map((r) => r.map((v) => `"${v}"`).join(","))
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `timetable_year_${year}_section_${section}.csv`;
    link.click();
  };

  /* ===== PDF DOWNLOAD (jsPDF + autoTable) ===== */
  const downloadPDF = () => {
    if (!selectedTimetable) return;

    const doc = new jsPDF("landscape");

    doc.setFontSize(16);
    doc.text(
      `${user?.managedBranch} - Year ${year}, Section ${section}`,
      14,
      18
    );

    const head = [["Time", ...days]];

    const body = timeSlots.map((time) => {
      const row = [time];
      days.forEach((day) => {
        const cell = getCell(day, time);
        row.push(
          cell && cell.subject && cell.subject !== "LUNCH BREAK"
            ? `${cell.subject}\n${cell.teacher?.name || ""}`
            : "-"
        );
      });
      return row;
    });

    autoTable(doc, {
      startY: 26,
      head,
      body,
      styles: {
        halign: "center",
        valign: "middle",
        fontSize: 9,
        cellPadding: 4,
      },
      headStyles: {
        fillColor: [14, 165, 233], // sky-500
        textColor: 255,
      },
      columnStyles: {
        0: { cellWidth: 35 },
      },
    });

    doc.save(`timetable_year_${year}_section_${section}.pdf`);
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm p-6">

        {/* HEADER */}
        <h1 className="text-xl font-semibold text-gray-800 mb-2">
          Timetable List
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Branch: <span className="font-medium">{user?.managedBranch}</span>
        </p>

        {/* FILTERS */}
        <div className="flex gap-4 mb-6 items-center">
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="">Select Year</option>
            {[1, 2, 3, 4].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <input
            type="text"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            placeholder="Section (A/B/C)"
            className="border rounded-md px-3 py-2 text-sm"
          />

          {selectedTimetable && (
            <div className="relative">
              <button
                onClick={() => setShowDownloadOptions(!showDownloadOptions)}
                className="bg-sky-500 text-white px-4 py-2 rounded-md hover:bg-sky-600 text-sm"
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
        </div>

        {/* CONTENT */}
        {loading ? (
          <p className="text-gray-500 text-sm">Loading timetables...</p>
        ) : !selectedTimetable ? (
          <p className="text-gray-500 text-sm">
            Select Year and Section to view timetable
          </p>
        ) : (
          <div className="overflow-x-auto border rounded-lg p-4 bg-white">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Time</th>
                  {days.map((day) => (
                    <th key={day} className="border px-4 py-2">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((time) => (
                  <tr key={time}>
                    <td className="border px-4 py-2 font-medium">
                      {time}
                    </td>
                    {days.map((day) => {
                      const cell = getCell(day, time);
                      return (
                        <td key={day} className="border px-4 py-2 text-center">
                          {cell && cell.subject && cell.subject !== "LUNCH BREAK" ? (
                            <>
                              <div className="font-semibold">
                                {cell.subject}
                              </div>
                              <div className="text-xs text-gray-600">
                                {cell.teacher?.name || "-"}
                              </div>
                            </>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default HodTimetableList;