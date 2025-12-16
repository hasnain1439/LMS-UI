import React from "react";
import { FaExclamationCircle, FaFileAlt, FaClipboardCheck } from "react-icons/fa";

const UpcomingDeadlines = () => {
  // Mock Data - In the future, this comes from your database
  const deadlines = [
    {
      id: 1,
      title: "Midterm Exam",
      course: "Advanced Mathematics",
      dueDate: "Dec 18, 2025",
      daysLeft: "2 days left!",
      type: "urgent", // Triggers the orange style
    },
    {
      id: 2,
      title: "Programming Assignment #3",
      course: "Computer Science",
      dueDate: "Dec 20, 2025",
      daysLeft: null,
      type: "standard",
    },
    {
      id: 3,
      title: "Lab Report",
      course: "Physics Laboratory",
      dueDate: "Dec 22, 2025",
      daysLeft: null,
      type: "standard",
    },
    {
      id: 4,
      title: "Essay Analysis",
      course: "English Literature",
      dueDate: "Dec 23, 2025",
      daysLeft: null,
      type: "standard",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <FaExclamationCircle className="text-orange-500 text-xl" />
        <h2 className="text-lg font-bold text-gray-800">Upcoming Deadlines</h2>
      </div>

      {/* List */}
      <div className="flex flex-col gap-4">
        {deadlines.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col md:flex-row items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
              item.type === "urgent"
                ? "bg-orange-50 border-orange-200"
                : "bg-white border-gray-100 hover:border-gray-200"
            }`}
          >
            {/* Left Side: Icon & Info */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div
                className={`p-3 rounded-lg text-xl ${
                  item.type === "urgent"
                    ? "bg-orange-100 text-orange-500"
                    : "bg-blue-50 text-blue-500"
                }`}
              >
                {item.type === "urgent" ? <FaClipboardCheck /> : <FaFileAlt />}
              </div>

              <div>
                <h3
                  className={`font-bold text-base ${
                    item.type === "urgent" ? "text-orange-900" : "text-gray-900"
                  }`}
                >
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500">{item.course}</p>
                <div className="flex items-center gap-2 text-xs font-medium mt-1">
                  <span className="text-gray-400">📅 Due {item.dueDate}</span>
                  {item.daysLeft && (
                    <span className="text-orange-600">• {item.daysLeft}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side: Action Button */}
            <div className="mt-3 md:mt-0 w-full md:w-auto">
              <button
                className={`w-full md:w-auto px-6 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  item.type === "urgent"
                    ? "bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-200"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-100"
                }`}
              >
                Take Quiz
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingDeadlines;