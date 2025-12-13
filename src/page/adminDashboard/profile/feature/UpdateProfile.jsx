import React, { useContext, useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../../context/ContextApi"; 
import { FaCamera, FaArrowLeft, FaSave, FaUser } from "react-icons/fa";

const UpdateProfile = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [message, setMessage] = useState("");

  // Load current user data
  useEffect(() => {
    if (user?.profilePicture) {
      setPreviewImage(user.profilePicture);
    }
  }, [user]);

  // ✅ Validation: Only First & Last Name
  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      
      // ✅ 1. Append Only the Fields from your Controller
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);

      // 2. Append Profile Picture (if changed)
      if (selectedFile) {
        formData.append("profilePicture", selectedFile);
      }

      // 3. Send Request
      const res = await axios.put(
        "http://localhost:5000/api/auth/profile",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // 4. Update Context & Local Storage
      setUser(res.data.user);
      const currentStorage = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...currentStorage, ...res.data.user }));

      setMessage("Profile updated successfully!");
      
      // Redirect back after 1 second
      setTimeout(() => navigate("/teacher/profile"), 1000);

    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.error || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        
        {/* --- Header --- */}
        <div className="bg-gray-900 px-6 py-4 flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="text-gray-400 hover:text-white transition"
            type="button"
          >
            <FaArrowLeft />
          </button>
          <h2 className="text-lg font-bold text-white">Update Profile</h2>
        </div>

        <div className="p-8">
          {message && (
            <div className={`mb-6 p-3 rounded-lg text-center font-medium border ${message.includes("success") ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
              {message}
            </div>
          )}

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
              <Form className="space-y-6">
                
                {/* --- 1. Profile Picture --- */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative cursor-pointer group">
                    <img 
                      src={previewImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
                      alt="Profile Preview" 
                      className="w-28 h-28 rounded-full object-cover border-4 border-gray-100 shadow-sm" 
                    />
                    <label 
                      htmlFor="file-upload" 
                      className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white cursor-pointer hover:bg-blue-700 shadow-md transition"
                    >
                      <FaCamera size={14} />
                    </label>
                    <input 
                      id="file-upload" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if(file) {
                          setSelectedFile(file);
                          setFieldValue("profilePicture", file);
                          setPreviewImage(URL.createObjectURL(file));
                        }
                      }} 
                    />
                  </div>
                </div>

                {/* --- 2. First Name --- */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <div className="relative">
                    <Field 
                      type="text" 
                      name="firstName" 
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" 
                      placeholder="Enter first name"
                    />
                    <FaUser className="absolute top-3 left-3 text-gray-400" size={14} />
                  </div>
                  <ErrorMessage name="firstName" component="p" className="text-red-500 text-xs mt-1" />
                </div>

                {/* --- 3. Last Name --- */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <div className="relative">
                    <Field 
                      type="text" 
                      name="lastName" 
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" 
                      placeholder="Enter last name"
                    />
                    <FaUser className="absolute top-3 left-3 text-gray-400" size={14} />
                  </div>
                  <ErrorMessage name="lastName" component="p" className="text-red-500 text-xs mt-1" />
                </div>

                {/* --- 4. Action Buttons --- */}
                <div className="border-t pt-6 flex justify-end gap-3 mt-4">
                  <button 
                    type="button" 
                    onClick={() => navigate(-1)} 
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-md transition font-medium"
                  >
                    <FaSave /> {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>

              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;