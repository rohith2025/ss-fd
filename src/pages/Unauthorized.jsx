import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Unauthorized = () => {
  const { role, logout } = useAuth();

  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Access Denied
        </h2>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page.
        </p>
        {role && (
          <p className="text-sm text-gray-500 mb-4">
            Current role: <span className="font-medium capitalize">{role}</span>
          </p>
        )}
        <div className="space-x-4">
          <Link
            to="/"
            className="bg-sky-600 text-white px-6 py-2 rounded-md hover:bg-sky-700"
          >
            Go Home
          </Link>
          <button
            onClick={logout}
            className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;






