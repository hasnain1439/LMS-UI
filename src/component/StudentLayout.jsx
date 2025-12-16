import { useState, useEffect } from "react";
import { useMatches, Outlet } from "react-router-dom";
import { 
  FaHome, 
  FaBook, 
  FaList, 
  FaClipboardCheck, 
  FaUser 
} from "react-icons/fa";
import Sidebar from "./Sidebar"; // Adjust path if needed
import Topbar from "./Topbar";   // Adjust path if needed

function StudentLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const matches = useMatches();

  const currentRoute = [...matches].reverse().find((m) => m.handle?.title);
  const pageTitle = currentRoute?.handle?.title || "LMS";

  useEffect(() => {
    document.title = `${pageTitle} | LMS`;
  }, [pageTitle]);

  // --- STUDENT NAVIGATION ITEMS ---
  const studentNavItems = [
    { path: "/student", label: "Dashboard", icon: <FaHome /> },
    { path: "/student/my-courses", label: "My Courses", icon: <FaBook /> },
    { path: "/student/catalog", label: "Course Catalog", icon: <FaList /> },
    { path: "/student/quizzes", label: "Quizzes", icon: <FaClipboardCheck /> },
    { path: "/student/profile", label: "Profile", icon: <FaUser /> },
  ];

  return (
    <div className="flex h-screen bg-gray-light relative overflow-hidden">
      {/* Pass student items to the shared Sidebar */}
      <Sidebar
        isOpen={isOpen} 
        setIsOpen={setIsOpen} 
        menuItems={studentNavItems} 
      />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar title={pageTitle} onMenuClick={() => setIsOpen(!isOpen)} />
        
        <main className="flex-1 p-6 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default StudentLayout;