import { useState, useEffect } from "react";
import { useMatches, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function TeacherLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const matches = useMatches();

  const currentRoute = [...matches].reverse().find((m) => m.handle?.title);
  const pageTitle = currentRoute?.handle?.title || "LMS";

  useEffect(() => {
    document.title = `${pageTitle} | LMS`;
  }, [pageTitle]);

  return (
    <div className="flex h-screen bg-gray-light relative overflow-hidden">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar title={pageTitle} onMenuClick={() => setIsOpen(!isOpen)} />
        {/* Make main scrollable without breaking horizontal scroll */}
        <main className="flex-1 p-6 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default TeacherLayout;
