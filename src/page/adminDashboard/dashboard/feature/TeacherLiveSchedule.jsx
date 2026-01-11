import React from "react";
import { FaCalendarAlt, FaVideo, FaRegClock } from "react-icons/fa";
import EmptyState from "../../../../component/EmptyState";
import toast from "react-hot-toast";

const TeacherLiveSchedule = ({ data }) => {
  
  // ✅ Function to call the Verification API
  const handleStartClass = async (courseId, scheduleId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first.");
        return;
      }

      // ⚠️ DUMMY IMAGE: Replace this with real webcam logic later
      const dummyImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=";

      const loadingToast = toast.loading("Verifying Face...");

      const response = await fetch("http://localhost:5000/api/lectures/startLectureWithFaceVerification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          courseId: courseId,
          scheduleId: scheduleId,
          image: dummyImage
        })
      });

      const result = await response.json();
      toast.dismiss(loadingToast);

      if (response.ok) {
        toast.success("Verification Successful!");
        window.open(result.meetingLink, "_blank");
      } else {
        toast.error(result.error || "Verification Failed");
      }

    } catch (error) {
      console.error("Error starting class:", error);
      toast.error("Network error. Check console.");
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 min-h-[200px] flex items-center justify-center">
        <EmptyState message="No classes scheduled for today." />
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
          // Robust status check
          const status = item.status ? item.status.trim().toLowerCase() : "";
          const isLive = status === "live now";

          return (
            <div key={item.id} className="flex flex-col md:flex-row items-center justify-between p-4 rounded-xl border border-gray-200">
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="flex flex-col items-center justify-center min-w-[60px] text-gray-600">
                  <div className="flex items-center gap-1 text-sm font-semibold">
                    <FaRegClock className={isLive ? "text-blue-600" : "text-gray-400"} />
                    <span className={isLive ? "text-blue-900" : "text-gray-600"}>{item.time}</span>
                  </div>
                  <span className="text-xs text-gray-400 font-medium uppercase mt-1">Start</span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                    {isLive && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                        Live Now
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">Topic: <span className="font-medium text-gray-700">{item.topic || "General"}</span></p>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <div className="mt-4 md:mt-0 w-full md:w-auto">
                <button
                  // ✅ FIX: Sending item.courseId properly now
                  onClick={() => handleStartClass(item.courseId, item.id)}
                  className={`w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all ${
                    isLive
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 shadow-lg cursor-pointer"
                      : "bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isLive ? <><FaVideo /> Start Class</> : "Upcoming"}
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