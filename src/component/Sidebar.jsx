import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { PiBookOpenTextThin } from "react-icons/pi";
import { RxCross2 } from "react-icons/rx";
import { logout } from "./LogoutButton";

// Now accepts 'menuItems' as a prop
function Sidebar({ isOpen, setIsOpen, menuItems }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const linkClass = (path) =>
    `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
      pathname === path
        ? "bg-primary text-white font-semibold shadow-sm"
        : "text-gray hover:bg-gray-light hover:text-primary-dark"
    }`;

  // Reusable Nav Content to avoid duplicating code for Mobile/Desktop
  const NavContent = () => (
    <nav className="flex flex-col gap-2 p-4">
      {menuItems.map((item, idx) => (
        <Link to={item.path} className={linkClass(item.path)} key={idx}>
          {item.icon} {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="min-w-64 bg-white border-r border-gray-light flex flex-col justify-between hidden lg:flex">
        <div>
          <div className="flex items-center gap-3 mb-6 px-4 py-7 border-b border-gray-light">
            <div className="flex items-center justify-center p-2 bg-primary-light rounded-lg text-white text-xl">
              <PiBookOpenTextThin />
            </div>
            <h2 className="text-lg font-semibold text-gray-dark">
              LMS Dashboard
            </h2>
          </div>
          
          {/* Render the Nav Items passed via props */}
          <NavContent />
        </div>

        <div className="p-4 border-t border-gray-light">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 p-3 rounded-lg bg-light-gray hover:bg-red-100 text-gray hover:text-error transition-all duration-200"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`w-64 bg-white border-r border-gray-light flex flex-col justify-between lg:hidden absolute top-0 left-0 h-full z-50 transition-all duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative">
          <div className="flex items-center gap-3 mb-6 px-4 py-7 border-b border-gray-light">
            <div className="flex items-center justify-center p-2 bg-primary-light rounded-lg text-white text-xl">
              <PiBookOpenTextThin />
            </div>
            <h2 className="text-lg font-semibold text-gray-dark">
              LMS Dashboard
            </h2>
          </div>
          <RxCross2
            className="absolute top-2 right-3 text-[24px] hover:cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          />

          <NavContent />
        </div>

        <div className="p-4 border-t border-gray-light">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 p-3 rounded-lg bg-light-gray hover:bg-red-100 text-gray hover:text-error transition-all duration-200"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;