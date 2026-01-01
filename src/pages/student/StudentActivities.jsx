import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const StudentActivities = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [certificateUrl, setCertificateUrl] = useState("");

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await api.get(
        `/activities?studentId=${user._id}`
      );
      setActivities(res.data || []);
    } catch (err) {
      console.error("Failed to fetch activities");
    } finally {
      setLoading(false);
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    try {
      await api.post("/activities", {
        title,
        type,
        description,
        date,
        certificateUrl,
        student: user._id,
      });

      setTitle("");
      setType("");
      setDescription("");
      setDate("");
      setCertificateUrl("");
      fetchActivities();
    } catch (err) {
      console.error("Failed to add activity");
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          My Activities
        </h1>

        {/* Add Activity Form */}
        <form
          onSubmit={handleAddActivity}
          className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            placeholder="Activity Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border rounded-md px-3 py-2 text-sm"
          />

          <input
            type="text"
            placeholder="Activity Type (Workshop, Sports, etc.)"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            className="border rounded-md px-3 py-2 text-sm"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="border rounded-md px-3 py-2 text-sm"
          />

          <input
            type="url"
            placeholder="Certificate URL (optional)"
            value={certificateUrl}
            onChange={(e) => setCertificateUrl(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
            className="border rounded-md px-3 py-2 text-sm md:col-span-2"
          />

          <button
            type="submit"
            className="bg-sky-600 text-white rounded-md px-4 py-2 text-sm hover:bg-sky-700 md:col-span-2"
          >
            Add Activity
          </button>
        </form>

        {/* Activities List */}
        {loading ? (
          <p className="text-gray-500 text-sm">
            Loading activities...
          </p>
        ) : activities.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No activities added yet
          </p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity._id}
                className="border rounded-lg p-4"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-gray-800 font-medium">
                    {activity.title}
                  </h2>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      activity.status === "approved" ? "bg-green-100 text-green-700" :
                      activity.status === "rejected" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {activity.status || "pending"}
                    </span>
                    <span className="text-xs bg-sky-100 text-sky-700 px-2 py-1 rounded">
                      {activity.type}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mt-1">
                  {activity.description}
                </p>

                <p className="text-xs text-gray-500 mt-2">
                  Date:{" "}
                  {new Date(activity.date).toLocaleDateString()}
                </p>

                {activity.certificateUrl && (
                  <a
                    href={activity.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-sky-600 hover:underline mt-2 inline-block"
                  >
                    View Certificate
                  </a>
                )}
                {activity.approvedBy && (
                  <p className="text-xs text-gray-500 mt-2">
                    Approved by: {activity.approvedBy?.name || "N/A"}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentActivities;
