import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { logout, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <h1 className="text-lg font-semibold text-sky-600">
        ShikshaSetu
      </h1>

      <div className="flex items-center gap-4">
        {role && (
          <span className="text-sm text-gray-600 capitalize">
            {role}
          </span>
        )}
        <button
          onClick={handleLogout}
          className="text-sm bg-sky-600 hover:bg-sky-700 text-white px-4 py-1.5 rounded-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
