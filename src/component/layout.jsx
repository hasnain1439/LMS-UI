import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../component/Sidebar"; // ✅ Adjust path if needed
import Topbar from "../component/Topbar";   // ✅ Adjust path if needed
import { FaHome, FaBook, FaClipboardList, FaUsers, FaUser } from "react-icons/fa";

export default function Layout() {
  // 1. State to control Sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 2. Define Menu Items (So Sidebar knows what to display)
  const menuItems = [
    { label: "Dashboard", path: "/teacher", icon: <FaHome /> },
    { label: "Courses", path: "/teacher/courses", icon: <FaBook /> },
    { label: "Quizzes", path: "/teacher/quizzes", icon: <FaClipboardList /> },
    { label: "Students", path: "/teacher/enrollments", icon: <FaUsers /> },
    { label: "Profile", path: "/teacher/profile", icon: <FaUser /> },
  ];

  return (
    <div className="flex h-screen bg-gray-light">
      
      {/* 3. SIDEBAR: Pass all 3 props so it works correctly */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        menuItems={menuItems} 
      />

      {/* 4. MOBILE OVERLAY: Allows closing sidebar by clicking outside */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* 5. MAIN CONTENT WRAPPER 
          - Added 'lg:ml-64': Pushes content to the right on desktop to make room for fixed Sidebar
          - Added 'transition-all': Smooth animation when resizing
      */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden lg:ml-64 transition-all duration-300">
        
        {/* Pass toggle function to Topbar */}
        <Topbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
           <Outlet />
        </main>
      </div>
    </div>
  );
}