import React, { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import toast from "react-hot-toast";
import { FaCamera, FaTimes, FaSpinner } from "react-icons/fa";

const FaceCapture = ({ isOpen, onClose, session, onSuccess, apiEndpoint }) => {
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // Helper: Convert Base64 to File
  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  // ... (keep your imports)

  const handleCapture = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return toast.error("Camera not ready");

    // Safety Check
    if (!session?.courseId) {
      alert("⚠️ Frontend Error: Course ID is missing.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Verifying Face...");

    try {
      const token = localStorage.getItem("token");
      const url = apiEndpoint || "/api/attendance/markAttendance";
      const fullUrl = url.startsWith("http")
        ? url
        : `http://localhost:5000${url}`;

      const imageFile = dataURLtoFile(imageSrc, "face-scan.jpg");
      const formData = new FormData();

      // ✅ FIX: Send ONLY 'image' (Matches your error message)
      formData.append("image", imageFile);

      // ✅ Send ID
      formData.append("courseId", session.courseId);

      // ✅ Send Schedule ID if available
      if (session.scheduleId || session.id) {
        formData.append("scheduleId", session.scheduleId || session.id);
      }

      console.log("🚀 Sending Request:", {
        url: fullUrl,
        courseId: session.courseId,
        fileType: "image",
      });

      const response = await axios.post(fullUrl, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(response.data.message || "Verification Successful!", {
        id: toastId,
      });
      if (onSuccess) onSuccess(response.data);
      onClose();
    } catch (error) {
      console.error("Verification Error:", error);
      const msg = error.response?.data?.error || "Verification Failed";
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  }, [webcamRef, session, onClose, onSuccess, apiEndpoint]);

  // ... (rest of component)

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-fadeIn">
        <div className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            Face Verification
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>
        <div className="p-6 flex flex-col items-center">
          <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border-2 border-gray-200 shadow-inner">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
            <div className="absolute inset-0 border-4 border-blue-500/30 rounded-lg pointer-events-none"></div>
          </div>
          <div className="mt-6 w-full flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 border rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCapture}
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl flex justify-center gap-2 hover:bg-blue-700"
            >
              {loading ? (
                <FaSpinner className="animate-spin" />
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
