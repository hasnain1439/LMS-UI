import React from "react";
import { FaCalendarAlt, FaVideo, FaRegClock } from "react-icons/fa";

const TeacherLiveSchedule = ({ data }) => {
  // If no classes today, show empty state
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
        <div className="flex justify-center mb-3">
          <div className="bg-blue-50 p-3 rounded-full">
            <FaCalendarAlt className="text-blue-400 text-xl" />
          </div>
        </div>
        <h3 className="text-gray-800 font-semibold">No Classes Today</h3>
        <p className="text-gray-500 text-sm mt-1">Enjoy your free time!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-blue-600 text-lg" />
          <h2 className="text-lg font-bold text-gray-800">Your Schedule</h2>
        </div>
        <span className="text-sm text-gray-500 font-medium">Today</span>
      </div>

      {/* Schedule List */}
      <div className="flex flex-col gap-4">
        {data.map((item) => {
          // Check backend status string exactly
          const isLive = item.status === "Live Now";

          return (
            <div
              key={item.id}
              className={`flex flex-col md:flex-row items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                isLive
                  ? "border-blue-500 bg-blue-50 shadow-md scale-[1.01]"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              {/* Left Side: Time & Details */}
              <div className="flex items-center gap-6 w-full md:w-auto">
                {/* Time Box */}
                <div className="flex flex-col items-center justify-center min-w-[60px] text-gray-600">
                  <div className="flex items-center gap-1 text-sm font-semibold">
                    <FaRegClock className={isLive ? "text-blue-600" : "text-gray-400"} />
                    <span className={isLive ? "text-blue-900" : "text-gray-600"}>
                      {item.time}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 font-medium uppercase mt-1">
                    Start
                  </span>
                </div>

                {/* Class Info */}
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-gray-900 text-lg">
                      {item.title}
                    </h3>
                    {/* Live Badge */}
                    {isLive && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                        <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                        Live Now
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                     Topic: <span className="font-medium text-gray-700">{item.topic || "General Session"}</span>
                  </p>
                </div>
              </div>

              {/* Right Side: Action Button */}
              <div className="mt-4 md:mt-0 w-full md:w-auto">
                <button
                  disabled={!isLive} 
                  onClick={() => {
                     // Check specifically for Jitsi or Google link
                     if (!item.meetingLink) {
                        alert("Error: Link missing. Please update schedule.");
                     } else {
                        window.open(item.meetingLink, "_blank");
                     }
                  }}
                  className={`w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all ${
                    isLive
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 shadow-lg cursor-pointer"
                      : "bg-white border border-blue-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isLive ? (
                    <>
                      <FaVideo /> Start Class
                    </>
                  ) : (
                    "Upcoming"
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeacherLiveSchedule;