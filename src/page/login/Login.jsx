import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaEnvelope, FaLock, FaIdBadge, FaCamera } from "react-icons/fa";
import { Link } from "react-router-dom";

// ✅ Validation Schema — user can log in with:
// (Email + Password) OR (Roll Number + Password) OR (Face Image)
const validationSchema = Yup.object().test(
  "oneOfRequired",
  "Provide Email + Password, Roll Number + Password, or Face Image",
  function (values) {
    return (
      (values.email && values.password) ||
      (values.rollNumber && values.password) ||
      values.faceImage
    );
  }
);

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-light px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-card p-8">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-dark mb-6">
          Login to Your Account
        </h2>

        <Formik
          initialValues={{
            email: "",
            rollNumber: "",
            password: "",
            faceImage: null,
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            console.log("🟢 Login data submitted:", values);
            alert("✅ Login submitted (frontend only)");
            resetForm();
          }}
        >
          {({ setFieldValue }) => (
            <Form className="space-y-5">
              {/* Email */}
              <div className="relative">
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full px-4 py-2.5 border border-gray rounded-lg focus:ring-2 focus:ring-primary-light outline-none transition"
                />
                <FaEnvelope className="absolute top-3 right-3 text-gray" />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-error text-sm mt-1"
                />
              </div>

              {/* Roll Number */}
              <div className="relative">
                <Field
                  type="text"
                  name="rollNumber"
                  placeholder="Roll Number"
                  className="w-full px-4 py-2.5 border border-gray rounded-lg focus:ring-2 focus:ring-primary-light outline-none transition"
                />
                <FaIdBadge className="absolute top-3 right-3 text-gray" />
                <ErrorMessage
                  name="rollNumber"
                  component="p"
                  className="text-error text-sm mt-1"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full px-4 py-2.5 border border-gray rounded-lg focus:ring-2 focus:ring-primary-light outline-none transition"
                />
                <FaLock className="absolute top-3 right-3 text-gray" />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-error text-sm mt-1"
                />
              </div>

              {/* Face Image Upload */}
              <div>
                <label className="block text-gray-dark font-medium mb-1">
                  Or Login with Face
                </label>
                <input
                  type="file"
                  name="faceImage"
                  accept="image/*"
                  onChange={(event) =>
                    setFieldValue("faceImage", event.currentTarget.files[0])
                  }
                  className="w-full text-sm border border-gray rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-light outline-none transition"
                />
                <ErrorMessage
                  name="faceImage"
                  component="p"
                  className="text-error text-sm mt-1"
                />
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-primary text-sm hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2.5 text-white rounded-lg bg-primary hover:bg-primary-dark shadow-soft transition duration-300"
              >
                Login
              </button>

              {/* Register Link */}
              <p className="text-center text-sm text-gray-dark">
                Don’t have an account?{" "}
                <Link to="/register" className="text-primary font-medium hover:underline">
                  Register
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
