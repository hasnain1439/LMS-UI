import React, { useState, useContext, useRef, useEffect } from "react";
import { UserContext } from "../../context/ContextApi";
import axios from "axios";
import toast from "react-hot-toast";
import { FaCamera, FaCheckCircle, FaExclamationCircle, FaShieldAlt, FaSync } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [faceVerified, setFaceVerified] = useState(false);
  const fileInputRef = useRef(null);
  const verifyFileInputRef = useRef(null);

  // ✅ Helper to show correct image URL
  const getProfileImage = (url) => {
    if (!url || url === "undefined" || url === "null") {
      return "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    }
    if (url.startsWith("http") || url.startsWith("blob")) return url;
    return `http://localhost:5000${url}`; // Adjust if your backend port is different
  };

  // ✅ Check face verification status on component mount
  useEffect(() => {
    const checkFaceVerification = async () => {
      if (user?.role !== "teacher") return; // Only for teachers

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        
        const response = await axios.get(
          "http://localhost:5000/api/users/face-verification-status",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        if (response.data.success) {
          setFaceVerified(response.data.verified);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
        console.error("Face verification check failed:", error);
      }
    };

    checkFaceVerification();
  }, [user, navigate]);

  // ✅ Handle Face Registration & Profile Pic Upload
  const handleFaceRegistration = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate Image Type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }

    // Validate File Size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", file); 
    formData.append("registerFace", "true"); // 🚨 Critical: Tells backend to generate Face Embedding

    setLoading(true);
    const toastId = toast.loading("Uploading & Registering Face ID...");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.put(
        "http://localhost:5000/api/users/profile", 
        formData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data" 
          },
        }
      );

      if (response.data.success) {
        toast.success("Face ID Registered Successfully!", { id: toastId });
        setUser(response.data.user); 
      } else {
        toast.error(response.data.error || "Face registration failed.", { id: toastId });
      }
    } catch (error) {
      console.error("Face Registration Error:", error);
      
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        toast.error("Session expired. Please login again.", { id: toastId });
      } else if (error.response?.status === 400) {
        const errorMsg = error.response.data.error || "Invalid image or file format.";
        toast.error(errorMsg, { id: toastId });
      } else {
        const errorMsg = error.response?.data?.error || "Face registration failed. Please try again.";
        toast.error(errorMsg, { id: toastId });
      }
    } finally {
      setLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // ✅ Handle Teacher Face Verification
  const handleFaceVerification = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate Image Type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }

    // Validate File Size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file); // ✅ Use "image" key for verification
    formData.append("verifyFace", "true");

    setVerifying(true);
    const toastId = toast.loading("Verifying your face for attendance...");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/users/verify-face",
        formData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data" 
          },
        }
      );

      if (response.data.success) {
        toast.success("Face Verification Successful! ✅", { id: toastId });
        setFaceVerified(true);
        
        // Store verification timestamp
        localStorage.setItem("lastFaceVerification", new Date().toISOString());
      } else {
        toast.error(response.data.error || "Face verification failed.", { id: toastId });
      }
    } catch (error) {
      console.error("Face Verification Error:", error);
      
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        toast.error("Session expired. Please login again.", { id: toastId });
      } else if (error.response?.status === 403) {
        toast.error("Face does not match registered image. Please try again.", { id: toastId });
      } else if (error.response?.status === 400) {
        const errorMsg = error.response.data.error || "No face detected in image. Please try again.";
        toast.error(errorMsg, { id: toastId });
      } else {
        const errorMsg = error.response?.data?.error || "Face verification failed. Please try again.";
        toast.error(errorMsg, { id: toastId });
      }
    } finally {
      setVerifying(false);
      // Reset file input
      if (verifyFileInputRef.current) {
        verifyFileInputRef.current.value = "";
      }
    }
  };

  // ✅ Trigger face verification for teacher
  const triggerFaceVerification = () => {
    if (verifyFileInputRef.current) {
      verifyFileInputRef.current.click();
    }
  };

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-gray-900">Profile & Security</h1>
          <p className="text-gray-500 mt-1">Manage your account and Face ID settings</p>
        </div>

        {/* Profile Card */}
        <div className="flex flex-col items-center pb-8 border-b border-gray-100">
          <div className="relative group cursor-pointer" onClick={() => !loading && fileInputRef.current.click()}>
            <img 
              src={getProfileImage(user?.profilePicture)} 
              alt="Profile" 
              className={`w-32 h-32 rounded-full object-cover border-4 ${
                user?.faceEmbedding ? 'border-green-500' : 'border-gray-200'
              } shadow-lg transition-all duration-300`}
            />
            
            {/* Camera Overlay */}
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <FaCamera className="text-white text-2xl" />
            </div>

            {/* Hidden Input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              disabled={loading}
              onChange={handleFaceRegistration} 
            />
          </div>

          <h2 className="mt-4 text-xl font-bold text-gray-900">
            {user?.firstName} {user?.lastName}
          </h2>
          <span className="text-sm font-medium px-3 py-1 bg-blue-50 text-blue-600 rounded-full mt-1 capitalize border border-blue-100">
            {user?.role || "Student"}
          </span>

          {/* Face ID Status Badge */}
          <div className={`mt-6 flex items-center gap-2 px-4 py-3 rounded-xl border ${
            user?.faceEmbedding 
              ? "bg-green-50 border-green-200 text-green-700" 
              : "bg-amber-50 border-amber-200 text-amber-700"
          }`}>
            {user?.faceEmbedding ? (
              <>
                <FaCheckCircle className="text-lg" /> 
                <span className="font-semibold">Face ID Active & Secure</span>
              </>
            ) : (
              <>
                <FaExclamationCircle className="text-lg" /> 
                <span className="font-semibold">Face ID Not Set (Tap photo to register)</span>
              </>
            )}
          </div>
          
          {!user?.faceEmbedding && (
             <p className="text-xs text-gray-400 mt-2 max-w-xs text-center">
               * Uploading a clear selfie will automatically register your Face ID for attendance.
             </p>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
                <div className="p-4 bg-gray-50 rounded-xl text-gray-700 font-medium border border-gray-100 truncate">
                  {user?.email}
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Roll Number / ID</label>
                <div className="p-4 bg-gray-50 rounded-xl text-gray-700 font-medium border border-gray-100">
                  {user?.rollNumber || "N/A"}
                </div>
            </div>
        </div>

        {/* Teacher Face Verification Section */}
        {user?.role === "teacher" && (
          <div className="mt-10 pt-8 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <FaShieldAlt className="text-2xl text-blue-600" />
              <h3 className="text-lg font-bold text-gray-900">Face Verification for Class</h3>
            </div>
            
            <div className={`p-6 rounded-2xl border-2 transition-all ${
              faceVerified 
                ? "bg-green-50 border-green-200" 
                : "bg-blue-50 border-blue-200"
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-700 mb-2">
                    {faceVerified 
                      ? "✅ Your face is verified and ready to start the class." 
                      : "⚠️ Please verify your face before starting a class for attendance tracking."}
                  </p>
                  <p className="text-xs text-gray-600">
                    Your verified face ensures accurate attendance records.
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  faceVerified 
                    ? "bg-green-100 text-green-700" 
                    : "bg-blue-100 text-blue-700"
                }`}>
                  {faceVerified ? "Verified" : "Pending"}
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={triggerFaceVerification}
                  disabled={verifying || loading}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                    verifying || loading
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                  }`}
                >
                  {verifying ? (
                    <>
                      <FaSync className="animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <FaCamera />
                      Verify Face Now
                    </>
                  )}
                </button>

                {faceVerified && (
                  <button
                    onClick={triggerFaceVerification}
                    disabled={verifying || loading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all active:scale-95"
                  >
                    <FaSync />
                    Re-verify
                  </button>
                )}
              </div>
            </div>

            {/* Hidden File Input for Verification */}
            <input 
              type="file" 
              ref={verifyFileInputRef} 
              className="hidden" 
              accept="image/*"
              disabled={verifying || loading}
              onChange={handleFaceVerification} 
            />
          </div>
        )}

      </div>
    </div>
  );
};

export default Settings;