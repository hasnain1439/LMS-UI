import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const ForgotPassword = () => {
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const handleForgotPassword = async (values, { resetForm }) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email: values.email,
      });
      alert(res.data.message);
      resetForm();
    } catch (error) {
      console.error("Forgot Password Error:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-light px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-card p-8">
        <h2 className="text-2xl font-bold text-center text-gray-dark mb-6">
          Forgot Password
        </h2>

        <Formik
          initialValues={{ email: "" }}
          validationSchema={validationSchema}
          onSubmit={handleForgotPassword}
        >
          <Form className="space-y-5">
            <div className="relative">
              <Field
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 border border-gray rounded-lg focus:ring-2 focus:ring-primary-light outline-none transition"
              />
              <ErrorMessage
                name="email"
                component="p"
                className="text-error text-sm mt-1"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-white rounded-lg bg-primary hover:bg-primary-dark shadow-soft transition duration-300"
            >
              Send Reset Link
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default ForgotPassword;
