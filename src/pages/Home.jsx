import { Link } from "react-router-dom";
import HomeNavbar from "./HomeNavbar";

const Home = () => {
  return (
    <div className="min-h-screen bg-sky-50">
      <HomeNavbar />

      {/* ================= HERO ================= */}
      <section
        id="home"
        className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-10 py-28 max-w-7xl mx-auto"
      >
        <div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Smart College Management System
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            ShikshaSetu is a secure, role-based academic management
            platform that connects students, parents, teachers,
            HODs, exam heads, and administrators into one unified system.
          </p>
          <div className="space-x-4">
            <Link
              to="/login"
              className="bg-sky-600 text-white px-6 py-3 rounded-md hover:bg-sky-700"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="border border-sky-600 text-sky-600 px-6 py-3 rounded-md hover:bg-sky-100"
            >
              Get Started
            </Link>
          </div>
        </div>

        <img
          src="https://images.unsplash.com/photo-1588072432836-e10032774350"
          alt="Education"
          className="rounded-xl shadow-md"
        />
      </section>

      {/* ================= TRUST / STATS ================= */}
      <section className="bg-white px-10 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Students", value: "10K+" },
            { label: "Teachers", value: "500+" },
            { label: "Institutions", value: "50+" },
            { label: "Daily Records", value: "1M+" },
          ].map((item, idx) => (
            <div key={idx}>
              <p className="text-3xl font-bold text-sky-600">
                {item.value}
              </p>
              <p className="text-gray-600 text-sm">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section id="about" className="bg-white px-10 py-24">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-3xl font-semibold text-gray-800 mb-6">
            About ShikshaSetu
          </h3>
          <p className="text-gray-600 leading-relaxed">
            ShikshaSetu simplifies academic operations by providing
            a centralized digital platform for attendance tracking,
            examination management, fee processing, leave approvals,
            and communication. It ensures transparency, accountability,
            and seamless coordination between all stakeholders.
          </p>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="bg-sky-50 px-10 py-24">
        <h3 className="text-3xl font-semibold text-center text-gray-800 mb-14">
          Powerful Features
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { title: "🎓 Student Dashboard", desc: "Attendance, exams, fees, leaves, activities, thesis, and timetable." },
            { title: "👨‍👩‍👧 Parent Monitoring", desc: "Track child attendance and approve leave requests." },
            { title: "👩‍🏫 Teacher Tools", desc: "Mark attendance and review student performance." },
            { title: "🏢 HOD Controls", desc: "Approve leave requests and manage department data." },
            { title: "⚙️ Admin Management", desc: "User control, role linking, transactions, holidays, and notices." },
            { title: "🔐 Secure Access", desc: "JWT-based authentication with role-based authorization." },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <h4 className="text-lg font-semibold text-sky-600 mb-2">
                {item.title}
              </h4>
              <p className="text-sm text-gray-600">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="bg-white px-10 py-24">
        <h3 className="text-3xl font-semibold text-center text-gray-800 mb-12">
          How ShikshaSetu Works
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
          {[
            "Register & Login",
            "Role-based Dashboard",
            "Perform Academic Actions",
            "Track & Monitor Progress",
          ].map((step, idx) => (
            <div key={idx} className="p-6 bg-sky-50 rounded-xl shadow-sm">
              <p className="text-sky-700 font-semibold mb-2">
                Step {idx + 1}
              </p>
              <p className="text-gray-600 text-sm">
                {step}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= WHO CAN USE ================= */}
      <section id="roles" className="bg-white px-10 py-24">
        <h3 className="text-3xl font-semibold text-center text-gray-800 mb-12">
          Who Can Use ShikshaSetu?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-6xl mx-auto text-center">
          {[
            "Students",
            "Parents",
            "Teachers",
            "HODs",
            "Administrators",
          ].map((role, idx) => (
            <div
              key={idx}
              className="bg-sky-50 p-6 rounded-xl shadow-sm"
            >
              <p className="text-sky-700 font-medium">
                {role}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-sky-600 text-white px-10 py-20 text-center">
        <h3 className="text-3xl font-semibold mb-4">
          Ready to Experience Smart Education?
        </h3>
        <p className="mb-6 text-sky-100">
          Join ShikshaSetu today and simplify academic management.
        </p>
        <Link
          to="/register"
          className="bg-white text-sky-600 px-8 py-3 rounded-md font-medium hover:bg-sky-100"
        >
          Create Your Account
        </Link>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white text-center py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} ShikshaSetu. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
