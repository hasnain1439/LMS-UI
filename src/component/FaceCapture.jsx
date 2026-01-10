import React, { useEffect, useRef, useState } from "react";
import { FaTimes, FaCamera } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function FaceCapture({ isOpen, onClose, session, onSuccess }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) startCamera();

    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (err) {
      console.error("Camera error:", err);
      toast.error("Camera access is required for face verification");
      onClose?.();
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
  };

  const captureAndSend = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setLoading(true);
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      // mirror to make it natural for user
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise((res) => canvas.toBlob(res, "image/png"));
      if (!blob) throw new Error("Failed to capture image");

      const file = new File([blob], "face.png", { type: "image/png" });
      const fd = new FormData();
      fd.append("faceImage", file);
      if (session?.sessionId) fd.append("sessionId", session.sessionId);
      if (session?.courseId) fd.append("courseId", session.courseId);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${BACKEND_URL}/api/lectures/startLectureWithFaceVerification`,
        fd,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = res.data;
      // Expect backend to return { success, meetingLink, attendance, matchPercentage }
      if (data?.success) {
        toast.success(data.message || "Face verified. Attendance recorded.");
        onSuccess?.(data);
      } else {
        toast.error(data?.message || "Face verification failed.");
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || error.message || "Verification failed";
      toast.error(msg);
    } finally {
      setLoading(false);
      stopCamera();
      onClose?.();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-lg bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 bg-gray-800">
          <h3 className="text-white text-sm font-semibold">Face Verification</h3>
          <button onClick={() => { stopCamera(); onClose?.(); }} className="text-white/80">
            <FaTimes />
          </button>
        </div>

        <div className="relative bg-black h-72 flex items-center justify-center">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover -scale-x-100" />
          <canvas ref={canvasRef} className="hidden" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-64 border-2 border-white/30 rounded-[50%]" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 p-5 bg-gray-900">
          <button
            onClick={() => { stopCamera(); onClose?.(); }}
            className="px-4 py-2 rounded-md bg-gray-700 text-white"
          >
            Cancel
          </button>
          <button
            onClick={captureAndSend}
            disabled={loading}
            className="px-6 py-3 rounded-full bg-blue-600 text-white flex items-center gap-2"
          >
            <FaCamera /> {loading ? "Verifying..." : "Scan Face"}
          </button>
        </div>
      </div>
    </div>
  );
}
