import { CiBellOn } from "react-icons/ci";
import { FaBars } from "react-icons/fa";
import profileImg from "../assets/icons/avatar.svg";

export default function Topbar({ title, onMenuClick }) {
  return (
    <header className="h-16 flex items-center justify-between bg-white px-6 shadow-soft border-b border-gray-light">
      <div className="flex items-center gap-2 sm:gap-4">
        {/* ✅ Menu button */}
        <FaBars
          className="block lg:hidden text-lg sm:text-xl cursor-pointer text-gray-dark"
          onClick={onMenuClick}
        />
        <h2 className="text-md sm:text-lg font-semibold text-gray-dark">{title}</h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative">
          <CiBellOn className="text-gray-dark text-xl sm:text-2xl cursor-pointer hover:text-primary" />
          <div className="absolute p-1 bg-error text-white text-[10px] rounded-full top-0 right-0.5"></div>
        </div>

        <div className="flex items-center sm:gap-2 bg-gray-light hover:bg-primary-light hover:text-white sm:px-3 sm:py-1.5 rounded-xl cursor-pointer transition-all">
          <img src={profileImg} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-light bg-white" alt="profile" />
          <h3 className="font-medium hidden sm:block">John Doe</h3>
        </div>
      </div>
    </header>
  );
}
