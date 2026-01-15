import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
  FaHome,
  FaBook,
  FaList,
  FaClipboardCheck,
  FaUser,
  FaCalendarCheck, // ✅ Added Icon for Attendance
} from "react-icons/fa";
import Sidebar from "../component/Sidebar"; 
import Topbar from "../component/Topbar";   

function StudentLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // --- Dynamic Document Title ---
  useEffect(() => {
    const path = location.pathname;
    let title = "Student Dashboard";

    if (path.includes("my-courses")) title = "My Courses";
    else if (path.includes("catalog")) title = "Course Catalog";
    else if (path.includes("quizzes")) title = "My Quizzes";
    else if (path.includes("attendance")) title = "My Attendance"; // ✅ Added Title Logic
    else if (path.includes("profile")) title = "Student Profile";

    document.title = `${title} | LMS`;
  }, [location]);

  // --- STUDENT NAVIGATION ITEMS ---
  const studentNavItems = [
    { path: "/student", label: "Dashboard", icon: <FaHome /> },
    { path: "/student/my-courses", label: "My Courses", icon: <FaBook /> },
    { path: "/student/catalog", label: "Course Catalog", icon: <FaList /> },
    { path: "/student/quizzes", label: "Quizzes", icon: <FaClipboardCheck /> },
    { path: "/student/profile", label: "Profile", icon: <FaUser /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-800">
      
      {/* 1. Sidebar (Fixed) */}
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        menuItems={studentNavItems}
        role="student"
      />

      {/* 2. Main Content Wrapper */}
      <div className="flex flex-col flex-1 w-full lg:ml-64 transition-all duration-300 relative">
        
        {/* Topbar */}
        <Topbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto overflow-x-hidden bg-gray-bg">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default StudentLayout;