import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const Navbar = () => {
  const { logout, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("User Logged Out successfully");
    navigate("/login");
  };

  return (
    <header
      className="
        fixed top-0 left-0 right-0
        h-16
        bg-white
        shadow-sm
        px-6
        flex justify-between items-center
        z-40
      "
    >
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
    </header>
  );
};

export default Navbar;
