import React, { useState, useRef, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaEnvelope, FaLock, FaUser, FaIdBadge, FaCloudUploadAlt, FaSpinner, FaExclamationCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast"; // 🔔 Import Toast

const Registration = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [fileName, setFileName] = useState(""); 
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    const video = videoRef.current;
    if (stream && video) {
      video.srcObject = stream;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => console.warn("Autoplay prevented:", err));
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [stream]);

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        "Must contain 1 Uppercase, 1 Lowercase, 1 Number & 1 Special Char"
      )
      .required("Password is required"),
    role: Yup.string().required("Please select a role"),
    faceImage: Yup.mixed().required("Face image is required for verification"),
  });

  const postData = async (values, { resetForm, setSubmitting }) => {
    setServerError(""); 
    
    const formData = new FormData();
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("role", values.role);
    if (values.faceImage) {
      formData.append("faceImage", values.faceImage);
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      
      const token = res.data.token;
      if (token) localStorage.setItem("token", token);
      
      // 🔔 Notification
      toast.success("Account created successfully!");
      console.log("✅ Registration successful:", res.data);
      
      navigate(`/verify-email/${token}`);
      resetForm();
    } catch (error) {
      console.error("❌ Registration failed:", error);
      const msg = error.response?.data?.error || "Registration failed. Please try again.";
      setServerError(msg);
      
      // 🔔 Notification
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-bg px-4 py-10">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Create Account</h2>
          <p className="text-gray-500 mt-2 text-sm">Join us and start your journey today</p>
        </div>

        {serverError && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 animate-pulse">
            <FaExclamationCircle className="text-xl shrink-0" />
            <span className="text-sm font-medium">{serverError}</span>
          </div>
        )}

        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            role: "",
            faceImage: null,
          }}
          validationSchema={validationSchema}
          onSubmit={postData}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form className="space-y-5">
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full relative group">
                  <FaUser className="absolute top-3.5 left-4 text-gray-400 group-focus-within:text-blue-600 transition-colors z-10" />
                  <Field
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
                  />
                  <ErrorMessage name="firstName" component="p" className="text-red-500 text-xs mt-1 ml-1" />
                </div>

                <div className="w-full relative group">
                  <FaUser className="absolute top-3.5 left-4 text-gray-400 group-focus-within:text-blue-600 transition-colors z-10" />
                  <Field
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
                  />
                  <ErrorMessage name="lastName" component="p" className="text-red-500 text-xs mt-1 ml-1" />
                </div>
              </div>

              <div className="relative group">
                <FaEnvelope className="absolute top-3.5 left-4 text-gray-400 group-focus-within:text-blue-600 transition-colors z-10" />
                <Field
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
                />
                <ErrorMessage name="email" component="p" className="text-red-500 text-xs mt-1 ml-1" />
              </div>

              <div className="relative group">
                <FaLock className="absolute top-3.5 left-4 text-gray-400 group-focus-within:text-blue-600 transition-colors z-10" />
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
                />
                <ErrorMessage name="password" component="p" className="text-red-500 text-xs mt-1 ml-1" />
              </div>

              <div className="relative group">
                <FaIdBadge className="absolute top-3.5 left-4 text-gray-400 group-focus-within:text-blue-600 transition-colors z-10" />
                <Field
                  as="select"
                  name="role"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white appearance-none cursor-pointer text-gray-600"
                >
                  <option value="" disabled>Select Role</option>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </Field>
                <ErrorMessage name="role" component="p" className="text-red-500 text-xs mt-1 ml-1" />
              </div>

              <div className="pt-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Capture Face Image (For Verification)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const s = await navigator.mediaDevices.getUserMedia({ video: true });
                        setStream(s);
                        setShowCamera(true);
                      } catch (err) {
                        console.error("Camera error:", err);
                        toast.error("Unable to access camera");
                      }
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Capture Live
                  </button>
                  <span className="text-sm text-gray-500">Make sure your face is centered</span>
                </div>

                {showCamera && (
                  <div className="mt-3 border rounded-lg p-3 bg-gray-50">
                    <div className="flex flex-col items-center gap-2">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full max-w-sm rounded-md bg-black"
                      />
                      <canvas ref={canvasRef} style={{ display: "none" }} />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const video = videoRef.current;
                            const canvas = canvasRef.current;
                            if (!video || !canvas) return;
                            canvas.width = video.videoWidth || 640;
                            canvas.height = video.videoHeight || 480;
                            const ctx = canvas.getContext("2d");
                            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                            canvas.toBlob((blob) => {
                              if (!blob) return;
                              const file = new File([blob], "face_capture.png", { type: blob.type });
                              setFieldValue("faceImage", file);
                              setFileName(file.name);
                              toast.success("Captured image ready");
                              if (stream) {
                                stream.getTracks().forEach((t) => t.stop());
                                setStream(null);
                              }
                              setShowCamera(false);
                            }, "image/png");
                          }}
                          className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                        >
                          Take Photo
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (stream) {
                              stream.getTracks().forEach((t) => t.stop());
                              setStream(null);
                            }
                            setShowCamera(false);
                          }}
                          className="px-3 py-2 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {fileName && (
                  <p className="text-sm text-blue-600 mt-2 font-medium">{fileName}</p>
                )}

                <ErrorMessage name="faceImage" component="p" className="text-red-500 text-xs mt-1 ml-1" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center gap-2
                  ${isSubmitting 
                    ? "bg-blue-400 cursor-not-allowed" 
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/30"
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin" /> Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-all"
                  >
                    Log In
                  </Link>
                </p>
              </div>

            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Registration;