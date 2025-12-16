import React from "react";
import { FaCalendarAlt, FaVideo, FaRegClock } from "react-icons/fa";

const LiveSchedule = () => {
  // Mock Data - You will eventually fetch this from your backend
  const scheduleData = [
    {
      id: 1,
      day: "Tue",
      time: "10:00",
      title: "Advanced Mathematics",
      instructor: "Dr. Sarah Johnson",
      status: "live", // 'live' or 'upcoming'
      link: "https://zoom.us/j/123456789", // Meeting link
    },
    {
      id: 2,
      day: "Tue",
      time: "13:00",
      title: "Computer Science",
      instructor: "Prof. Michael Chen",
      status: "upcoming",
      link: null,
    },
    {
      id: 3,
      day: "Wed",
      time: "09:00",
      title: "Physics Laboratory",
      instructor: "Dr. Emily Rodriguez",
      status: "upcoming",
      link: null,
    },
    {
      id: 4,
      day: "Wed",
      time: "14:00",
      title: "English Literature",
      instructor: "Prof. James Wilson",
      status: "upcoming",
      link: null,
    },
    {
      id: 5,
      day: "Thu",
      time: "11:00",
      title: "Chemistry Seminar",
      instructor: "Dr. Amanda Lee",
      status: "upcoming",
      link: null,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-blue-600 text-lg" />
          <h2 className="text-lg font-bold text-gray-800">Live Schedule</h2>
        </div>
        <span className="text-sm text-gray-500 font-medium">This Week</span>
      </div>

      {/* Schedule List */}
      <div className="flex flex-col gap-4">
        {scheduleData.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col md:flex-row items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
              item.status === "live"
                ? "border-blue-500 bg-blue-50 shadow-md scale-[1.01]"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            {/* Left Side: Time & Details */}
            <div className="flex items-center gap-6 w-full md:w-auto">
              {/* Time Box */}
              <div className="flex flex-col items-center justify-center min-w-[60px] text-gray-600">
                <span className={`font-semibold ${item.status === 'live' ? 'text-blue-600' : 'text-gray-500'}`}>
                  {item.day}
                </span>
                <div className="flex items-center gap-1 text-sm">
                  <FaRegClock className="text-xs" />
                  <span>{item.time}</span>
                </div>
              </div>

              {/* Class Info */}
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-gray-900 text-lg">
                    {item.title}
                  </h3>
                  {/* Live Badge */}
                  {item.status === "live" && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                      Live Now
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{item.instructor}</p>
              </div>
            </div>

            {/* Right Side: Action Button */}
            <div className="mt-4 md:mt-0 w-full md:w-auto">
              <button
                disabled={item.status !== "live"}
                onClick={() => window.open(item.link, "_blank")}
                className={`w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all ${
                  item.status === "live"
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 shadow-lg cursor-pointer"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {item.status === "live" ? (
                  <>
                    <FaVideo /> Join Class
                  </>
                ) : (
                  "Upcoming"
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveSchedule;