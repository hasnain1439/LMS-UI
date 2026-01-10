import React, { useState, useContext } from "react";
import { FaCalendarAlt, FaVideo, FaRegClock } from "react-icons/fa";
import toast from "react-hot-toast"; // 🔔 Import Toast

// 👇 Import Standard Component
import EmptyState from "../../../../component/EmptyState";
import FaceCapture from "../../../../component/FaceCapture";
import { UserContext } from "../../../../context/ContextApi";

const LiveSchedule = ({ data }) => {
  const { user } = useContext(UserContext);
  const [captureOpen, setCaptureOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
         <EmptyState message="No classes scheduled for today." />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
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
        {data.map((item) => {
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
                <div className="flex flex-col items-center justify-center min-w-[60px] text-gray-600">
                  <span
                    className={`font-semibold ${
                      isLive ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {item.day}
                  </span>
                  <div className="flex items-center gap-1 text-sm">
                    <FaRegClock className="text-xs" />
                    <span>{item.time}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-gray-900 text-lg">
                      {item.title}
                    </h3>
                    {isLive && (
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
                  disabled={!isLive}
                  onClick={() => {
                    if (!isLive) return;
                    if (!user) {
                      toast.error("Please login to join the class.");
                      return;
                    }
                    // open face capture modal which will call backend for verification
                    setSelectedSession(item);
                    setCaptureOpen(true);
                  }}
                  className={`w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all ${
                    isLive
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 shadow-lg cursor-pointer"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                  }`}
                >
                  {isLive ? (
                    <>
                      <FaVideo /> Start Lecture
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
      {/* Face capture modal */}
      <FaceCapture
        isOpen={captureOpen}
        onClose={() => {
          setCaptureOpen(false);
          setSelectedSession(null);
        }}
        session={selectedSession}
        onSuccess={(data) => {
          // backend may return meetingLink and attendance details
          if (data?.meetingLink) {
            window.open(data.meetingLink, "_blank");
          }
        }}
      />
    </div>
  );
};

export default LiveSchedule;