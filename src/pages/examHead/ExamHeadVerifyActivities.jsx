import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { getPendingActivities, approveActivity } from "../../api/examHead.api";

const ExamHeadVerifyActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await getPendingActivities();
      setActivities(res.data || []);
    } catch (err) {
      console.error("Failed to fetch pending activities");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (activityId, status) => {
    try {
      await approveActivity(activityId, status);
      fetchActivities(); // Refresh list
    } catch (err) {
      console.error("Failed to update activity");
      alert("Failed to update activity");
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          Verify Activities
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Review and approve/reject student activities
        </p>

        {loading ? (
          <p className="text-gray-500 text-sm">Loading activities...</p>
        ) : activities.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No pending activities to review
          </p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity._id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h2 className="text-gray-800 font-medium">
                      {activity.title}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Student: {activity.student?.name} ({activity.student?.email})
                    </p>
                    <p className="text-xs text-gray-500">
                      Branch: {activity.student?.branch} | Year: {activity.student?.year} | Section: {activity.student?.section}
                    </p>
                  </div>
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                    {activity.type}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-2">
                  {activity.description}
                </p>

                <p className="text-xs text-gray-500 mb-3">
                  Date: {new Date(activity.date).toLocaleDateString()}
                </p>

                {activity.certificateUrl && (
                  <a
                    href={activity.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-sky-600 hover:underline mb-3 inline-block"
                  >
                    View Certificate
                  </a>
                )}

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleApprove(activity._id, "approved")}
                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApprove(activity._id, "rejected")}
                    className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ExamHeadVerifyActivities;

