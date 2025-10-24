import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const Registration = () => {
  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        "Password must contain uppercase, lowercase, number & special character"
      )
      .required("Password is required"),
    role: Yup.string().required("Please select a role"),
    faceImage: Yup.mixed().required("Face image is required"),
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-light">
      <div className="w-full max-w-lg p-8 bg-white rounded-2xl shadow-card">
        {/* 🧾 Title */}
        <h2 className="text-2xl font-bold text-center text-gray-dark mb-6">
          Create Your Account
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
            <Form className="space-y-5">
              {/* First & Last Name */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative sm:w-1/2">
                  <Field
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    className="w-full px-4 py-2.5 border border-gray rounded-lg focus:ring-2 focus:ring-primary-light outline-none transition"
                  />
                  <FaUser className="absolute top-3 right-3 text-gray" />
                  <ErrorMessage
                    name="firstName"
                    component="p"
                    className="text-error text-sm mt-1"
                  />
                </div>

                <div className="relative sm:w-1/2">
                  <Field
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    className="w-full px-4 py-2.5 border border-gray rounded-lg focus:ring-2 focus:ring-primary-light outline-none transition"
                  />
                  <FaUser className="absolute top-3 right-3 text-gray" />
                  <ErrorMessage
                    name="lastName"
                    component="p"
                    className="text-error text-sm mt-1"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="relative">
                <Field
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-2.5 border border-gray rounded-lg focus:ring-2 focus:ring-primary-light outline-none transition"
                />
                <FaEnvelope className="absolute top-3 right-3 text-gray" />
                <ErrorMessage
                  name="email"
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

              {/* Role */}
              <div>
                <Field
                  as="select"
                  name="role"
                  className="w-full px-4 py-2.5 border border-gray rounded-lg focus:ring-2 focus:ring-primary-light outline-none transition"
                >
                  <option value="">Select Role</option>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </Field>
                <ErrorMessage
                  name="role"
                  component="p"
                  className="text-error text-sm mt-1"
                />
              </div>

              {/* Face Image Upload */}
              <div>
                <label className="block text-gray-dark font-medium mb-1">
                  Upload Face Image
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

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2.5 text-white rounded-lg bg-primary hover:bg-primary-dark shadow-soft transition duration-300"
              >
                Register
              </button>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-dark">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary font-medium hover:underline"
                >
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

export default Registration;
