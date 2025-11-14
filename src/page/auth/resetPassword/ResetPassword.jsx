import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        "Password must contain uppercase, lowercase, number & special character"
      )
      .required("Password is required"),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const handleResetPassword = async (values, { resetForm }) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        {
          password: values.password,
          confirmPassword: values.confirmPassword, // ✅ REQUIRED FOR BACKEND
        }
      );

      alert(res.data.message);
      resetForm();
    } catch (error) {
      console.error("Reset Password Error:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-light px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-card p-8">
        <h2 className="text-2xl font-bold text-center text-gray-dark mb-6">
          Reset Password
        </h2>

        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={handleResetPassword}
        >
          <Form className="space-y-5">
            
            {/* Password */}
            <div>
              <Field
                type="password"
                name="password"
                placeholder="Enter new password"
                className="w-full px-4 py-2.5 border border-gray rounded-lg focus:ring-2 focus:ring-primary-light outline-none transition"
              />
              <ErrorMessage name="password" component="p" className="text-error text-sm mt-1" />
            </div>

            {/* Confirm Password */}
            <div>
              <Field
                type="password"
                name="confirmPassword"
                placeholder="Confirm new password"
                className="w-full px-4 py-2.5 border border-gray rounded-lg focus:ring-2 focus:ring-primary-light outline-none transition"
              />
              <ErrorMessage
                name="confirmPassword"
                component="p"
                className="text-error text-sm mt-1"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-white rounded-lg bg-primary hover:bg-primary-dark shadow-soft transition duration-300"
            >
              Reset Password
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default ResetPassword;
