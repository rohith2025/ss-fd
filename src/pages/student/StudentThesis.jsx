import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import { toast } from "react-toastify";

const StudentThesis = () => {
  const [thesisList, setThesisList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  /* ================= FETCH MY THESIS ================= */
  const fetchMyThesis = async () => {
    try {
      const res = await api.get("/thesis/my");
      setThesisList(res.data || []);
    } catch (err) {
      console.error("Failed to fetch thesis");
      toast.error("Failed to load thesis");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyThesis();
  }, []);

  /* ================= UPLOAD THESIS ================= */
  const handleUploadThesis = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/thesis", {
        subject,
        title,
        fileUrl,
      });

      // Add new thesis at top
      setThesisList((prev) => [
        res.data.thesis,
        ...prev,
      ]);

      toast.success("Thesis uploaded successfully");

      setSubject("");
      setTitle("");
      setFileUrl("");
    } catch (err) {
      console.error("Failed to upload thesis");
      toast.error(
        err.response?.data?.message || "Failed to upload thesis"
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          My Thesis
        </h1>

        {/* ================= UPLOAD FORM ================= */}
        <form
          onSubmit={handleUploadThesis}
          className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="border rounded-md px-3 py-2 text-sm"
          />

          <input
            type="text"
            placeholder="Thesis Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border rounded-md px-3 py-2 text-sm"
          />

          <input
            type="url"
            placeholder="Thesis File URL (Drive / PDF link)"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            required
            className="border rounded-md px-3 py-2 text-sm md:col-span-2"
          />

          <button
            type="submit"
            className="bg-sky-600 text-white rounded-md px-4 py-2 text-sm hover:bg-sky-700 md:col-span-2"
          >
            Upload Thesis
          </button>
        </form>

        {/* ================= THESIS LIST ================= */}
        {loading ? (
          <p className="text-gray-500 text-sm">
            Loading thesis...
          </p>
        ) : thesisList.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No thesis uploaded yet
          </p>
        ) : (
          <div className="space-y-4">
            {thesisList.map((thesis) => (
              <div
                key={thesis._id}
                className="border rounded-lg p-4 hover:shadow-sm transition"
              >
                <h2 className="text-gray-800 font-medium">
                  {thesis.title}
                </h2>

                <p className="text-sm text-gray-600 mt-1">
                  Subject: {thesis.subject}
                </p>

                <a
                  href={thesis.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-sky-600 hover:underline mt-2 inline-block"
                >
                  View Thesis File
                </a>

                <p className="text-xs text-gray-400 mt-2">
                  Uploaded on{" "}
                  {new Date(thesis.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentThesis;
