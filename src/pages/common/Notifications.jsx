import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const Notifications = () => {
  const { role } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Admin form state
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("general");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotification = async (e) => {
    e.preventDefault();
    try {
      await api.post("/notifications", { title, message, type });
      setTitle("");
      setMessage("");
      setType("general");
      fetchNotifications();
    } catch (err) {
      console.error("Failed to create notification");
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          Notifications
        </h1>

        {/* Admin Create Notification */}
        {role === "admin" && (
          <form
            onSubmit={handleCreateNotification}
            className="mb-6 space-y-4"
          >
            <input
              type="text"
              placeholder="Notification Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border rounded-md px-3 py-2 text-sm"
            />

            <textarea
              placeholder="Notification Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={3}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
            >
              <option value="general">General</option>
              <option value="attendance">Attendance</option>
              <option value="exam">Exam</option>
              <option value="fee">Fee</option>
              <option value="leave">Leave</option>
            </select>

            <button
              type="submit"
              className="bg-sky-600 text-white rounded-md px-4 py-2 text-sm hover:bg-sky-700"
            >
              Send Notification
            </button>
          </form>
        )}

        {/* Notifications List */}
        {loading ? (
          <p className="text-gray-500 text-sm">
            Loading notifications...
          </p>
        ) : notifications.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No notifications available
          </p>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className="border rounded-lg p-4"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-gray-800 font-medium">
                    {notification.title}
                  </h2>
                  <span className="text-xs px-2 py-0.5 rounded bg-sky-100 text-sky-700 capitalize">
                    {notification.type}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mt-1">
                  {notification.message}
                </p>

                <p className="text-xs text-gray-400 mt-2">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
