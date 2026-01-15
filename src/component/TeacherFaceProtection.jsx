import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/ContextApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaShieldAlt, FaCheckCircle } from "react-icons/fa";

/**
 * TeacherFaceProtection Component
 * Wraps teacher dashboard/class pages to ensure face verification
 * Usage: <TeacherFaceProtection><YourDashboard /></TeacherFaceProtection>
 */
const TeacherFaceProtection = ({ children }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [isFaceVerified, setIsFaceVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);

  useEffect(() => {
    const checkFaceVerification = async () => {
      // Only check for teachers
      if (user?.role !== "teacher") {
        setLoading(false);
        setIsFaceVerified(true);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Check if face was verified recently (within 24 hours)
        const lastVerification = localStorage.getItem("lastFaceVerification");
        if (lastVerification) {
          const verificationTime = new Date(lastVerification);
          const now = new Date();
          const hoursDiff = (now - verificationTime) / (1000 * 60 * 60);

          if (hoursDiff < 24) {
            setIsFaceVerified(true);
            setLoading(false);
            return;
          }
        }

        // If no recent verification, prompt verification
        setShowVerificationPrompt(true);
        setLoading(false);
      } catch (error) {
        console.error("Face verification check failed:", error);
        setLoading(false);
        setShowVerificationPrompt(true);
      }
    };

    checkFaceVerification();
  }, [user, navigate]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking face verification...</p>
        </div>
      </div>
    );
  }

  // If face is verified, show children (dashboard)
  if (isFaceVerified) {
    return <>{children}</>;
  }

  // Show verification prompt modal
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
            <FaShieldAlt className="text-3xl text-amber-600" />
          </div>
        </div>

        {/* Header */}
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Face Verification Required
        </h2>
        <p className="text-center text-gray-600 text-sm mb-6">
          To start a class and record attendance, please verify your face first.
        </p>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex gap-3">
            <FaCheckCircle className="text-blue-600 flex-shrink-0 mt-1" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Why face verification?</p>
              <p>It ensures accurate attendance tracking and classroom security.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/settings")}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all active:scale-95"
          >
            Go to Settings
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all active:scale-95"
          >
            Go Back
          </button>
        </div>

        {/* Additional Info */}
        <p className="text-xs text-gray-500 text-center mt-4">
          💡 After verifying your face in Settings, you can access the dashboard.
        </p>
      </div>
    </div>
  );
};

export default TeacherFaceProtection;
