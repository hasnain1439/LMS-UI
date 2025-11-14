import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link } from "react-router-dom";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
});

const ResendVerification = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const resendEmailHandler = async (values, { resetForm }) => {
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/resend-verification",
        { email: values.email }
      );
      setMessage(res.data.message);
      resetForm();
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || "Something went wrong");
      } else {
        setError("Network Error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-light">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-card">
        <h2 className="text-2xl font-bold text-center text-gray-dark mb-2">
          Resend Verification Email
        </h2>

        {/* ✅ If email sent, hide form and show success message */}
        {message === "Verification email sent" ? (
          <div className="text-center">
            <p className="text-green-600 font-medium mt-3">
              {message}. Please check your inbox.
            </p>
            <Link
              to="/login"
              className="inline-block mt-5 text-primary font-medium hover:underline"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <>
            <p className="text-gray-dark text-sm text-center mb-6">
              Enter your registered email to resend your verification link.
            </p>

            <Formik
              initialValues={{ email: "" }}
              validationSchema={validationSchema}
              onSubmit={resendEmailHandler}
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
                  disabled={loading}
                  className={`w-full py-2.5 text-white rounded-lg bg-primary hover:bg-primary-dark shadow-soft transition duration-300 ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Sending..." : "Resend Verification Email"}
                </button>
              </Form>
            </Formik>

            {error && (
              <p className="text-error text-sm mt-3 text-center">{error}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ResendVerification;
