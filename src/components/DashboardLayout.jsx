import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => {
  return (
    <>
      {/* Top Navbar (fixed) */}
      <Navbar />

      {/* Left Sidebar (fixed, below navbar) */}
      <Sidebar />

      {/* Page Content */}
      <main
        className="
          ml-64        /* space for sidebar */
          pt-20       /* space for navbar */
          min-h-screen
          bg-sky-50
          px-6
          py-6
        "
      >
        {children}
      </main>
    </>
  );
};

export default DashboardLayout;
