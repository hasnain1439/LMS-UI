import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const Registeration = () => {
  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        "Password must contain at least one uppercase, one lowercase, one number, and one special character"
      )
      .required("Password is required"),
    role: Yup.string().required("Please select a role"),
    faceImage: Yup.mixed().required("Face image is required"),
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-2xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Register Account
        </h2>

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
          onSubmit={(values, { resetForm }) => {
            console.log("✅ Form Data Submitted:", values);
            alert("Registration successful (frontend only)");
            resetForm();
          }}
        >
          {({ setFieldValue }) => (
            <Form className="space-y-4">
              {/* First & Last Name */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="sm:w-1/2 relative">
                  <Field
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                  <FaUser className="absolute text-gray-400 top-3 right-3 sm:right-2" />
                </div>

                <div className="relative sm:w-1/2">
                  <Field
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                  <FaUser className="absolute text-gray-400 top-3 right-3 sm:right-2" />
                </div>
              </div>

              {/* Email */}
              <div className="relative">
                <Field
                  type="email"
                  name="email"
                  placeholder="Email address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
                <FaEnvelope className="absolute text-gray-400 top-3 right-3" />
              </div>

              {/* Password */}
              <div className="relative">
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
                <FaLock className="absolute text-gray-400 top-3 right-3" />
              </div>

              {/* Role */}
              <div>
                <Field
                  as="select"
                  name="role"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Role</option>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </Field>
                <ErrorMessage
                  name="role"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Face Image Upload */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Upload Face Image
                </label>
                <input
                  type="file"
                  name="faceImage"
                  accept="image/*"
                  onChange={(event) =>
                    setFieldValue("faceImage", event.currentTarget.files[0])
                  }
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2"
                />
                <ErrorMessage
                  name="faceImage"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              {/* Remember Me & Forgot Password */}
              <div className="text-end">
                <Link
                  to="#"
                  className="text-indigo-600 ps-1 text-sm hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2 text-white rounded-lg bg-indigo-600 hover:bg-indigo-700 transition duration-300"
              >
                Register
              </button>
              {/* Login Link */}
              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-indigo-600 hover:underline">
                  Login
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Registeration;
