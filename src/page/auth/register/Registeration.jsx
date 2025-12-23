import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaEnvelope, FaLock, FaUser, FaIdBadge, FaCloudUploadAlt, FaSpinner, FaExclamationCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Registration = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [fileName, setFileName] = useState(""); // To display selected file name

  // ✅ Validation Schema
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
    setServerError(""); // Clear previous errors
    
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
      
      console.log("✅ Registration successful:", res.data);
      navigate(`/verify-email/${token}`);
      resetForm();
    } catch (error) {
      console.error("❌ Registration failed:", error);
      const msg = error.response?.data?.error || "Registration failed. Please try again.";
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen  bg-gray-bg px-4 py-10">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Create Account</h2>
          <p className="text-gray-500 mt-2 text-sm">Join us and start your journey today</p>
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
              
              {/* Name Row */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* First Name */}
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

                {/* Last Name */}
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

              {/* Email */}
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

              {/* Password */}
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

              {/* Role Selection */}
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

              {/* Custom File Upload */}
              <div className="pt-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Upload Face Image (For Login)
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
                        "Click to upload or drag and drop"
                      )}
                    </span>
                    {!fileName && <span className="text-xs text-gray-400">JPG, PNG (Max 5MB)</span>}
                  </div>
                </div>
                <ErrorMessage name="faceImage" component="p" className="text-red-500 text-xs mt-1 ml-1" />
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
                    <FaSpinner className="animate-spin" /> Creating Account...
                  </>
                ) : (
                  "Register"
                )}
              </button>

              {/* Login Link */}
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