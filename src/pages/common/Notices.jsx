import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const Notices = () => {
  const { role } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await api.get("/notices");
      setNotices(res.data || []);
    } catch (err) {
      console.error("Failed to fetch notices");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    try {
      await api.post("/notices", { title, description });
      setTitle("");
      setDescription("");
      fetchNotices();
    } catch (err) {
      console.error("Failed to create notice");
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          Notices
        </h1>

        {role === "admin" && (
          <form
            onSubmit={handleCreateNotice}
            className="mb-6 space-y-4"
          >
            <input
              type="text"
              placeholder="Notice Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border rounded-md px-3 py-2 text-sm"
            />

            <textarea
              placeholder="Notice Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />

            <button
              type="submit"
              className="bg-sky-600 text-white rounded-md px-4 py-2 text-sm hover:bg-sky-700"
            >
              Publish Notice
            </button>
          </form>
        )}

        {loading ? (
          <p className="text-gray-500 text-sm">Loading notices...</p>
        ) : notices.length === 0 ? (
          <p className="text-gray-500 text-sm">No notices available</p>
        ) : (
          <div className="space-y-4">
            {notices.map((notice) => (
              <div
                key={notice._id}
                className="border rounded-lg p-4"
              >
                <h2 className="text-gray-800 font-medium">
                  {notice.title}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {notice.description}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(notice.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Notices;
