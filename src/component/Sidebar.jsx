import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { PiBookOpenTextThin } from "react-icons/pi";
import { RxCross2 } from "react-icons/rx";
import { UserContext } from "../context/ContextApi"; // ✅ Import Context
import { logout } from "./LogoutButton";

function Sidebar({ isOpen, setIsOpen, menuItems }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(UserContext); // ✅ Get User Data

  // ✅ Helper to handle Profile Image
  const getProfileImage = (url) => {
    if (!url) return "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    if (url.startsWith("http") || url.startsWith("blob")) return url;
    return `http://localhost:5000${url}`;
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // ✅ Auto-close sidebar on mobile when a link is clicked
  const handleLinkClick = () => {
    if (setIsOpen) setIsOpen(false);
  };

  const linkClass = (path) =>
    `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 font-medium ${
      pathname === path || pathname.startsWith(path + "/")
        ? "bg-blue-600 text-white shadow-md shadow-blue-200" // Updated active style
        : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
    }`;

  // Reusable Nav Content
  const NavContent = () => (
    <nav className="flex flex-col gap-2 p-4">
      {menuItems.map((item, idx) => (
        <Link 
          to={item.path} 
          className={linkClass(item.path)} 
          key={idx}
          onClick={handleLinkClick} // Close on click (Mobile)
        >
          <span className="text-xl">{item.icon}</span> 
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );

  // Reusable User Profile Section
  const UserProfile = () => (
    <div className="flex flex-col items-center justify-center py-6 border-b border-gray-100 bg-gray-50/50">
      <img
        src={getProfileImage(user?.profilePicture || user?.profile_picture)}
        alt="Profile"
        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md mb-3"
        onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; }}
      />
      <h3 className="font-bold text-gray-800 text-lg">
        {user ? `${user.firstName} ${user.lastName}` : "User"}
      </h3>
      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full uppercase font-semibold tracking-wide mt-1">
        {user?.role || "Guest"}
      </span>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between hidden lg:flex h-screen fixed left-0 top-0 overflow-y-auto z-40">
        <div>
          {/* Logo Area */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
            <div className="flex items-center justify-center p-2 bg-blue-600 rounded-lg text-white text-xl shadow-sm">
              <PiBookOpenTextThin />
            </div>
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">
              LMS Portal
            </h2>
          </div>

          {/* ✅ Added Profile Section */}
          <UserProfile />
          
          {/* Navigation */}
          <NavContent />
        </div>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 font-medium"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`w-72 bg-white border-r border-gray-200 flex flex-col justify-between lg:hidden fixed top-0 left-0 h-full z-50 transition-transform duration-300 ease-in-out shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative h-full flex flex-col">
          {/* Logo Area Mobile */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
            <div className="flex items-center justify-center p-2 bg-blue-600 rounded-lg text-white text-xl">
              <PiBookOpenTextThin />
            </div>
            <h2 className="text-xl font-bold text-gray-800">LMS Portal</h2>
          </div>
          
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full transition"
            onClick={() => setIsOpen(false)}
          >
            <RxCross2 size={24} />
          </button>

          {/* ✅ Added Profile Section */}
          <UserProfile />

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto">
             <NavContent />
          </div>

          {/* Logout Mobile */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 font-medium"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;