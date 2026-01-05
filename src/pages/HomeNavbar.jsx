import { Link, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

const HomeNavbar = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const [activeSection, setActiveSection] = useState("home");
  const isScrollingRef = useRef(false);

  const scrollToSection = (id) => {
    if (isScrollingRef.current) return;

    const section = document.getElementById(id);
    if (!section) return;

    isScrollingRef.current = true;
    setActiveSection(id);

    const startY = window.pageYOffset;
    const targetY =
      section.getBoundingClientRect().top +
      window.pageYOffset -
      90;

    const duration = 1600;
    let startTime = null;

    const easeOutExpo = (t) =>
      t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

    const animateScroll = (time) => {
      if (!startTime) startTime = time;

      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);

      window.scrollTo(
        0,
        startY + (targetY - startY) * easeOutExpo(progress)
      );

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 100);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  // ================= SCROLL SPY =================
  useEffect(() => {
    if (!isHome) return;

    const sections = ["home", "why", "roles", "workflow"];

    const onScroll = () => {
      const scrollPos = window.scrollY + 120;

      for (let id of sections) {
        const section = document.getElementById(id);
        if (!section) continue;

        const top = section.offsetTop;
        const height = section.offsetHeight;

        if (scrollPos >= top && scrollPos < top + height) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // ================= CLASS HANDLER =================
  const navClass = (id) =>
    `nav-btn transition ${
      activeSection === id
        ? "text-sky-600 font-semibold"
        : "text-gray-600 hover:text-sky-600"
    }`;

  return (
    <nav className="bg-white/90 backdrop-blur shadow-sm px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-xl font-extrabold text-sky-700">
        ShikshaSetu
      </Link>

      <div className="space-x-6 text-sm flex items-center">
        {isHome && (
          <>
            <button onClick={() => scrollToSection("home")} className={navClass("home")}>
              Home
            </button>
            <button onClick={() => scrollToSection("why")} className={navClass("why")}>
              Why Us
            </button>
            <button onClick={() => scrollToSection("roles")} className={navClass("roles")}>
              Roles
            </button>
            <button
              onClick={() => scrollToSection("workflow")}
              className={navClass("workflow")}
            >
              Workflow
            </button>
          </>
        )}

        <Link to="/login" className="text-sky-600 font-medium hover:underline">
          Login
        </Link>

        <Link
          to="/register"
          className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default HomeNavbar;
