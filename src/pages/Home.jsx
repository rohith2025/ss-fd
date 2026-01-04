import { Link } from "react-router-dom";
import HomeNavbar from "./HomeNavbar";
import {
  GraduationCap,
  Users,
  ClipboardCheck,
  ShieldCheck,
  BookOpen,
  Building2,
  BarChart3,
  Layers,
  CheckCircle2,
  Settings,
} from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-sky-50">
      <HomeNavbar />

      <section
        id="home"
        className="scroll-mt-24 relative px-10 py-36 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
      >
        <div>
          <h1 className="text-5xl font-extrabold text-gray-800 leading-tight mb-6">
            A Smarter Way to Manage
            <span className="block text-sky-600">Modern Education</span>
          </h1>

          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            <strong>ShikshaSetu</strong> is a complete academic ERP platform
            connecting students, parents, teachers, HODs, exam heads,
            and administrators with transparency and security.
          </p>

          <div className="flex gap-5">
            <Link
              to="/login"
              className="bg-sky-600 text-white px-9 py-3 rounded-xl hover:bg-sky-700 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="border border-sky-600 text-sky-600 px-9 py-3 rounded-xl hover:bg-sky-100 transition"
            >
              Get Started
            </Link>
          </div>
        </div>

        <img
          src="https://images.unsplash.com/photo-1588072432836-e10032774350"
          className="rounded-3xl shadow-2xl"
          alt="Education Platform"
        />
      </section>

      <section
        id="why"
        className="scroll-mt-24 py-28 px-10 bg-sky-50"
      >
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
          Why Institutions Choose ShikshaSetu
        </h2>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              icon: <Layers />,
              title: "All-in-One Platform",
              desc: "Attendance, grades, fees, leaves, timetable & exams in one place.",
            },
            {
              icon: <ShieldCheck />,
              title: "Secure by Design",
              desc: "JWT authentication, role-based access & data protection.",
            },
            {
              icon: <BarChart3 />,
              title: "Academic Insights",
              desc: "CGPA, attendance analytics & semester-wise reports.",
            },
          ].map((c, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition"
            >
              <div className="w-14 h-14 flex items-center justify-center bg-sky-100 rounded-xl text-sky-600 mb-6">
                {c.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                {c.title}
              </h3>
              <p className="text-gray-600">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="roles"
        className="scroll-mt-24 bg-white py-28 px-10"
      >
        <h2 className="text-4xl font-bold text-center mb-20 text-gray-800">
          Role-Based Smart Dashboards
        </h2>

        <div className="max-w-7xl mx-auto space-y-16">
          <RoleBlock
            icon={<GraduationCap />}
            title="Students"
            points={[
              "Attendance tracking",
              "CGPA & semester grades",
              "Activity applications",
              "Timetable access",
            ]}
          />

          <RoleBlock
            icon={<Users />}
            title="Parents"
            points={[
              "Monitor attendance",
              "View grades & activities",
              "Fee & leave status",
            ]}
          />

          <RoleBlock
            icon={<ClipboardCheck />}
            title="Teachers"
            points={[
              "Mark attendance",
              "View linked students",
              "Access timetables",
            ]}
          />

          <RoleBlock
            icon={<Building2 />}
            title="HOD"
            points={[
              "Assign subjects",
              "Create timetables",
              "Monitor academics",
            ]}
          />

          <RoleBlock
            icon={<BookOpen />}
            title="Exam Head"
            points={[
              "Manage grades",
              "Approve activities",
              "Academic oversight",
            ]}
          />

          <RoleBlock
            icon={<Settings />}
            title="Admin"
            points={[
              "User & role management",
              "Approve fees",
              "System control",
            ]}
          />
        </div>
      </section>

      <section
        id="workflow"
        className="scroll-mt-24 bg-sky-50 py-28 px-10"
      >
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
          How ShikshaSetu Works
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          {[
            "User Registration",
            "Admin Role Linking",
            "Academic Operations",
            "Live Monitoring",
          ].map((step, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-8 shadow-sm text-center"
            >
              <CheckCircle2 className="mx-auto text-sky-600 mb-4" />
              <p className="font-semibold text-gray-800 mb-2">
                Step {i + 1}
              </p>
              <p className="text-gray-600 text-sm">{step}</p>
            </div>
          ))}
        </div>
      </section>


              <section className="bg-white py-24">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { label: "Active Students", value: "10,000+" },
            { label: "Faculty Members", value: "500+" },
            { label: "Institutions", value: "50+" },
            { label: "Records Managed Daily", value: "1M+" },
          ].map((i, idx) => (
            <div key={idx}>
              <p className="text-4xl font-bold text-sky-600">
                {i.value}
              </p>
              <p className="text-gray-600 mt-2">
                {i.label}
              </p>
            </div>
          ))}
        </div>
      </section>



      <footer className="bg-sky-50 py-6 text-center text-sm text-black-500">
        © {new Date().getFullYear()} ShikshaSetu. All rights reserved.
      </footer>
    </div>
  );
};

const RoleBlock = ({ icon, title, points }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
    </div>

    <ul className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
      {points.map((p, i) => (
        <li
          key={i}
          className="bg-sky-50 rounded-lg p-4 text-gray-700"
        >
          • {p}
        </li>
      ))}
    </ul>
  </div>
);

export default Home;
