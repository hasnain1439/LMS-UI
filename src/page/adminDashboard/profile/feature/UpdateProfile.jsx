import React, { useContext, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../../context/ContextApi";
import { FaUser } from "react-icons/fa";

const UpdateProfile = () => {
  const { user, setUser } = useContext(UserContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);

      if (selectedFile) {
        formData.append("profilePicture", selectedFile);
      }

      const res = await axios.put(
        "http://localhost:5000/api/auth/profile",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setUser(res.data.user);
      setMessage("Profile updated successfully!");
      navigate("/teacher/profile");
    } catch (error) {
      setMessage(error.response?.data?.error || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user)
    return <p className="text-center mt-20 text-gray-500">Loading...</p>;

  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-light sm:p-4">
      <div className="w-full bg-white rounded-2xl shadow-card p-4 sm:p-8">
        <h2 className="text-2xl font-bold text-center text-gray-dark mb-6">
          Update Profile
        </h2>
        {message && <p className="text-success mb-4 text-center">{message}</p>}

        <Formik
          initialValues={{
            firstName: user.firstName || "",
            lastName: user.lastName || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form className="space-y-5">
              {/* First Name */}
              <div className="relative">
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

              {/* Last Name */}
              <div className="relative">
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

              {/* Profile Picture */}
              <div>
                <label className="block text-gray-dark font-medium mb-1">
                  Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setSelectedFile(e.target.files[0]);
                    setFieldValue("profilePicture", e.target.files[0]);
                  }}
                  className="w-full border border-gray rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-light outline-none transition"
                />

                {user.profilePicture && (
                  <div className="mt-4 flex justify-center">
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border border-gray"
                    />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="mt-8 flex flex-col items-center md:items-start space-y-3">
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>

                {/* Change Password Link */}
                <p className="text-sm text-gray-dark text-center md:text-left">
                  Want to change your password?{" "}
                  <Link
                    to="/teacher/change-password"
                    className="text-primary font-medium hover:underline"
                  >
                    Change Password
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

export default UpdateProfile;
