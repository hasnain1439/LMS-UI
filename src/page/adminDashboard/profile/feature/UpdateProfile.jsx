import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaArrowLeft, FaSave, FaUser } from "react-icons/fa";

const UpdateProfile = () => {
  const navigate = useNavigate();
  
  // Local state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [message, setMessage] = useState("");

  // --- 1. Fetch Current User Data ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const response = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Handle response structure based on your previous controllers
        const userData = response.data.user || response.data;
        setUser(userData);
        
        // Set existing image preview
        if (userData.profilePicture) {
          setPreviewImage(userData.profilePicture);
        }
      } catch (err) {
        console.error("Failed to load profile", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  // --- 2. Validation Schema (Only firstName & lastName) ---
  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
  });

  // --- 3. Handle Submit (Matches your Backend Logic) ---
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const token = localStorage.getItem("token");
      
      // ✅ Create FormData object to match backend 'req.body' and 'req.file'
      const formData = new FormData();
      
      // Backend expects: const { firstName, lastName } = req.body;
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);

      // Backend expects: if (req.file) ...
      if (selectedFile) {
        formData.append("profilePicture", selectedFile); 
      }

      // ✅ Send Request
      const res = await axios.put(
        "http://localhost:5000/api/auth/profile",
        formData,
        {
          headers: { 
            "Content-Type": "multipart/form-data", // Crucial for req.file
            Authorization: `Bearer ${token}`
          },
        }
      );

      setMessage("Profile updated successfully!");
      
      // Update Local Storage to reflect name/image changes immediately
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...currentUser, ...res.data.user }));

      // Redirect back
      setTimeout(() => navigate("/teacher/profile"), 1000);

    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.error || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-600 px-6 py-4 flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="text-blue-100 hover:text-white transition"
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
                
                {/* 1. Profile Picture (req.file) */}
                <div className="flex flex-col items-center mb-8">
                  <div className="relative cursor-pointer group">
                    <img 
                      src={previewImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
                      alt="Profile Preview" 
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 shadow-sm bg-gray-50" 
                    />
                    <label 
                      htmlFor="file-upload" 
                      className="absolute bottom-1 right-1 bg-blue-600 p-2.5 rounded-full text-white cursor-pointer hover:bg-blue-700 shadow-md transition border-2 border-white"
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
                  <p className="text-xs text-gray-400 mt-2">Update Profile Picture</p>
                </div>

                {/* 2. First Name (req.body.firstName) */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">First Name</label>
                    <div className="relative">
                      <Field 
                        type="text" name="firstName" 
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition" 
                      />
                      <FaUser className="absolute top-3.5 left-3.5 text-gray-400" size={14} />
                    </div>
                    <ErrorMessage name="firstName" component="p" className="text-red-500 text-xs mt-1" />
                </div>

                {/* 3. Last Name (req.body.lastName) */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name</label>
                    <div className="relative">
                      <Field 
                        type="text" name="lastName" 
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition" 
                      />
                      <FaUser className="absolute top-3.5 left-3.5 text-gray-400" size={14} />
                    </div>
                    <ErrorMessage name="lastName" component="p" className="text-red-500 text-xs mt-1" />
                </div>

                {/* Submit Buttons */}
                <div className="border-t border-gray-100 pt-6 flex justify-end gap-3 mt-4">
                  <button 
                    type="button" 
                    onClick={() => navigate(-1)} 
                    className="px-6 py-2.5 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition font-medium border border-gray-200"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="px-8 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-200 transition font-medium disabled:opacity-70"
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