import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// ✅ Validation Schema
const validationSchema = Yup.object({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain uppercase, lowercase, number & special character"
    )
    .required("Password is required"),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const ChangePassword = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const changePasswordHandler = async (
    values,
    { setSubmitting, resetForm }
  ) => {
    try {
      // API call to change password
      const res = await axios.put(
        "http://localhost:5000/api/auth/change-password",
        {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          confirmPassword: values.confirmNewPassword, // ✅ ADD THIS
        },
        { withCredentials: true }
      );

      setMessage(res.data.message || "Password changed successfully!");
      setError("");
      resetForm();

      // Redirect after 2 seconds
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
      setMessage("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-light sm:px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-card p-4 sm:p-8">
        <h2 className="text-2xl font-bold text-center text-gray-dark mb-6">
          Change Password
        </h2>

        {message && (
          <p className="text-green-600 text-center mb-4">{message}</p>
        )}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

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
              <div className="relative">
                <Field
                  type="password"
                  name="currentPassword"
                  placeholder="Current Password"
                  className="w-full px-4 py-2.5 border border-gray rounded-lg focus:ring-2 focus:ring-primary-light outline-none transition"
                />
                <FaLock className="absolute top-3 right-3 text-gray" />
                <ErrorMessage
                  name="currentPassword"
                  component="p"
                  className="text-error text-sm mt-1"
                />
              </div>

              {/* New Password */}
              <div className="relative">
                <Field
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  className="w-full px-4 py-2.5 border border-gray rounded-lg focus:ring-2 focus:ring-primary-light outline-none transition"
                />
                <FaLock className="absolute top-3 right-3 text-gray" />
                <ErrorMessage
                  name="newPassword"
                  component="p"
                  className="text-error text-sm mt-1"
                />
              </div>

              {/* Confirm New Password */}
              <div className="relative">
                <Field
                  type="password"
                  name="confirmNewPassword"
                  placeholder="Confirm New Password"
                  className="w-full px-4 py-2.5 border border-gray rounded-lg focus:ring-2 focus:ring-primary-light outline-none transition"
                />
                <FaLock className="absolute top-3 right-3 text-gray" />
                <ErrorMessage
                  name="confirmNewPassword"
                  component="p"
                  className="text-error text-sm mt-1"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 text-white rounded-lg bg-primary hover:bg-primary-dark shadow-soft transition duration-300"
              >
                {isSubmitting ? "Saving..." : "Change Password"}
              </button>

              {/* Optional Login Link */}
              <p className="mt-3 text-sm text-gray-dark text-center">
                Remembered your password?{" "}
                <a
                  href="/login"
                  className="text-primary font-medium hover:underline"
                >
                  Login
                </a>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ChangePassword;
