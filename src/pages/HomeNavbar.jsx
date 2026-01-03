import { Link, useLocation } from "react-router-dom";

const HomeNavbar = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-xl font-bold text-sky-700">
        ShikshaSetu
      </Link>

      <div className="space-x-6 text-sm flex items-center">
        {isHome && (
          <>
            <button
              onClick={() => scrollToSection("home")}
              className="text-gray-600 hover:text-sky-600"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-gray-600 hover:text-sky-600"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="text-gray-600 hover:text-sky-600"
            >
              Features
            </button>
          </>
        )}

        <Link
          to="/login"
          className="text-sky-600 font-medium hover:underline"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default HomeNavbar;
