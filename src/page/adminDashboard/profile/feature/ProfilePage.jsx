import React, { useContext } from "react";
import { UserContext } from "../../../../context/ContextApi";
import { useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaIdBadge,
  FaUserCheck,
  FaCalendarAlt,
  FaPen,       // ✅ Added Icon for Edit
  FaKey,
  FaSignOutAlt,
} from "react-icons/fa";
import { logout } from "../../../../component/LogoutButton";

const ProfilePage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // ✅ FIX 1: Helper to force image refresh (avoids showing old cached image)
  const getProfileImage = (url) => {
    if (!url) return "/default-avatar.png"; // Default if URL is empty
    if (url.startsWith("http") || url.startsWith("blob")) return url;
    return `${url}?t=${new Date().getTime()}`; // Add timestamp to force reload
  };

  if (!user) return <p className="text-center mt-10">Loading profile...</p>;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-6">
        
        {/* --- BLUE HEADER CARD --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Blue Banner */}
          <div className="h-32 bg-blue-600"></div>
          
          <div className="px-6 sm:px-10 pb-8">
            <div className="relative flex flex-col sm:flex-row items-center sm:items-end -mt-12 mb-6">
              
              {/* ✅ FIX 2: Image with Error Handling */}
              <img
                src={getProfileImage(user.profilePicture)}
                onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; }} // Fallback if image fails
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover bg-white"
              />
              
              {/* Name & Role */}
              <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                   <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium capitalize">
                     {user.role}
                   </span>
                   {user.designation && (
                     <span className="text-gray-500 text-sm border-l pl-2 border-gray-300">
                       {user.designation}
                     </span>
                   )}
                </div>
              </div>
            </div>
            
            {/* --- BUTTONS ROW --- */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6 border-t pt-6">
              
              <div className="flex gap-3">
                {/* ✅ NEW: Edit Profile Button */}
                <button
                  onClick={() => navigate("/teacher/update-profile")}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-gray-800 transition shadow-sm text-sm font-medium"
                >
                  <FaPen size={12} /> Edit Profile
                </button>

                {/* Change Password Button */}
                <button
                  onClick={() => navigate("/teacher/change-password")}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-sm text-sm font-medium"
                >
                  <FaKey size={12} /> Change Password
                </button>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 transition shadow-sm text-sm font-medium"
              >
                <FaSignOutAlt size={14} /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* --- DETAILS SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Contact Info Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><FaEnvelope size={18} /></div>
                <div>
                   <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Email Address</p>
                   <p className="text-gray-900 font-medium">{user.email}</p>
                </div>
              </div>
              
              {user.rollNumber && (
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><FaIdBadge size={18} /></div>
                  <div>
                     <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">ID / Roll No</p>
                     <p className="text-gray-900 font-medium">{user.rollNumber}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Details Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">Account Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${user.isActive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                  <FaUserCheck size={18} />
                </div>
                <div>
                   <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Current Status</p>
                   <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                     {user.isActive ? "Active Account" : "Inactive"}
                   </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><FaCalendarAlt size={18} /></div>
                <div>
                   <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Member Since</p>
                   <p className="text-gray-900 font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* --- ABOUT SECTION (Shows data from your form screenshot) --- */}
          {(user.careerObjective || user.skills) && (
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 md:col-span-2">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Professional Profile</h3>
                
                {user.careerObjective && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Career Objective</p>
                    <p className="text-gray-700 leading-relaxed">{user.careerObjective}</p>
                  </div>
                )}

                {user.skills && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-2">Key Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.split(',').map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm border border-gray-200">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;