import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaEnvelope, FaLock, FaSpinner, FaExclamationCircle, FaCloudUploadAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// ✅ Validation Schema (Updated: Removed Roll Number check)
const validationSchema = Yup.object().test(
  "oneOfRequired",
  "Provide Email + Password OR Face Image",
  function (values) {
    return (
      (values.email && values.password) ||
      values.faceImage
    );
  }
);

const Login = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [fileName, setFileName] = useState(""); 

  const loginHandler = async (values, { setSubmitting }) => {
    setServerError(""); 

    try {
      const formData = new FormData();
      if (values.email) formData.append("email", values.email);
      if (values.password) formData.append("password", values.password);
      if (values.faceImage) formData.append("faceImage", values.faceImage);

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Login Success:", res.data);

      const token = res.data.token || res.data.accessToken;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } else {
        throw new Error("No access token received.");
      }

      // Redirect based on role
      const role = res.data.user?.role;
      if (role === "teacher") {
        navigate("/teacher");
      } else if (role === "student") {
        navigate("/student");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      console.error("Login Error:", error);
      const errorMsg = error.response?.data?.error || "Login failed. Please check your credentials.";
      setServerError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-bg px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Welcome Back</h2>
          <p className="text-gray-500 mt-2 text-sm">Login to access your dashboard</p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 animate-pulse">
            <FaExclamationCircle className="text-xl shrink-0" />
            <span className="text-sm font-medium">{serverError}</span>
          </div>
        )}

        <Formik
          initialValues={{
            email: "",
            password: "",
            faceImage: null,
          }}
          validationSchema={validationSchema}
          onSubmit={loginHandler}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form className="space-y-5">
              
              {/* Email Field */}
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

              {/* Password Field */}
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

              {/* Custom File Upload for Face Login */}
              <div className="pt-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Or Login with Face Recognition
                </label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 hover:bg-gray-50 transition-colors text-center cursor-pointer group">
                  <input
                    type="file"
                    name="faceImage"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      setFieldValue("faceImage", file);
                      setFileName(file ? file.name : "");
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FaCloudUploadAlt className="text-3xl text-gray-400 group-hover:text-blue-500 transition-colors" />
                    <span className="text-sm text-gray-500 font-medium group-hover:text-gray-700">
                      {fileName ? (
                        <span className="text-blue-600 font-bold">{fileName}</span>
                      ) : (
                        "Click to upload or drag face image"
                      )}
                    </span>
                  </div>
                </div>
                <ErrorMessage name="faceImage" component="p" className="text-red-500 text-xs mt-1 ml-1" />
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <Link
                  to="/forget-password"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
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
                    <FaSpinner className="animate-spin" /> Verifying...
                  </>
                ) : (
                  "Login"
                )}
              </button>

              {/* Register Link */}
              <p className="text-center text-sm text-gray-600 mt-6">
                Don’t have an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-600 font-bold hover:underline transition-all"
                >
                  Register Here
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;