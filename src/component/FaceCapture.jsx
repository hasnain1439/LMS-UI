import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import toast from "react-hot-toast";
import { FaCamera, FaTimes, FaSpinner } from "react-icons/fa";

// ✅ Accept 'apiEndpoint' as a prop
const FaceCapture = ({ isOpen, onClose, session, onSuccess, apiEndpoint }) => {
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // Capture & Verify Function
  const handleCapture = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      toast.error("Camera not ready");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Verifying Face...");

    try {
      const token = localStorage.getItem("token");
      
      // ✅ USE THE DYNAMIC ENDPOINT PASSED FROM PARENT
      // If apiEndpoint is missing, fallback to teacher route (safety)
      const url = apiEndpoint || "/api/lectures/startLectureWithFaceVerification";
      
      // Ensure full URL if using Vite proxy or relative path
      const fullUrl = url.startsWith("http") ? url : `http://localhost:5000${url}`;

      const response = await axios.post(
        fullUrl,
        {
          courseId: session.courseId, // Ensure session has courseId
          scheduleId: session.id,
          image: imageSrc,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(response.data.message || "Verification Successful!", { id: toastId });
      
      if (onSuccess) {
        onSuccess(response.data);
      }
      onClose(); // Close modal on success

    } catch (error) {
      console.error("Verification Error:", error);
      const msg = error.response?.data?.error || "Verification Failed";
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  }, [webcamRef, session, onClose, onSuccess, apiEndpoint]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-fadeIn">
        {/* Header */}
        <div className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            Face Verification
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Camera View */}
        <div className="p-6 flex flex-col items-center">
          <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border-2 border-gray-200 shadow-inner">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
            />
            {/* Overlay Frame */}
            <div className="absolute inset-0 border-4 border-blue-500/30 rounded-lg pointer-events-none"></div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 border-2 border-dashed border-white/50 rounded-full"></div>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mt-4 text-center">
            Please center your face in the circle and ensure good lighting.
          </p>

          {/* Action Buttons */}
          <div className="mt-6 w-full flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleCapture}
              disabled={loading}
              className={`flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" /> Verifying...
                </>
              ) : (
                <>
                  <FaCamera /> Scan Face
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceCapture;