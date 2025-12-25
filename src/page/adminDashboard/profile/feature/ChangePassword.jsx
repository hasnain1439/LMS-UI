import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Lock, Eye, EyeOff, ArrowLeft, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast"; // 🔔 1. Import Toast

// ✅ Validation Schema
const validationSchema = Yup.object({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Must contain uppercase, lowercase, number & special char"
    )
    .required("New password is required"),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const ChangePassword = () => {
  const navigate = useNavigate();
  
  // Toggle Visibility States
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const changePasswordHandler = async (values, { setSubmitting, resetForm }) => {
    try {
      const res = await axios.put(
        "http://localhost:5000/api/auth/change-password",
        {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          confirmPassword: values.confirmNewPassword,
        },
        { withCredentials: true }
      );

      // 🔔 Success Toast
      toast.success(res.data.message || "Password changed successfully!");
      
      resetForm();

      // Redirect logic
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || "Something went wrong";
      // 🔔 Error Toast
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-800">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100 flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 bg-white rounded-xl border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-200 transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
        </div>

        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <KeyRound size={32} />
            </div>
          </div>
          
          <p className="text-center text-gray-500 text-sm mb-8">
            Your new password must be different from previous used passwords.
          </p>

          <Formik
            initialValues={{
              currentPassword: "",
              newPassword: "",
              confirmNewPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={changePasswordHandler}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-5">
                
                {/* Current Password */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute top-3.5 left-4 text-gray-400" size={16} />
                    <Field
                      type={showCurrent ? "text" : "password"}
                      name="currentPassword"
                      placeholder="Enter current password"
                      className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-transparent rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute top-3.5 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <ErrorMessage name="currentPassword" component="p" className="text-red-500 text-xs mt-1.5 font-medium ml-1" />
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">New Password</label>
                  <div className="relative">
                    <Lock className="absolute top-3.5 left-4 text-gray-400" size={16} />
                    <Field
                      type={showNew ? "text" : "password"}
                      name="newPassword"
                      placeholder="Enter new password"
                      className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-transparent rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute top-3.5 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <ErrorMessage name="newPassword" component="p" className="text-red-500 text-xs mt-1.5 font-medium ml-1" />
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute top-3.5 left-4 text-gray-400" size={16} />
                    <Field
                      type={showConfirm ? "text" : "password"}
                      name="confirmNewPassword"
                      placeholder="Re-enter new password"
                      className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-transparent rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute top-3.5 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <ErrorMessage name="confirmNewPassword" component="p" className="text-red-500 text-xs mt-1.5 font-medium ml-1" />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Updating Password..." : "Update Password"}
                </button>

              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;