import React, { useContext } from "react";
import { UserContext } from "../../../../context/ContextApi";
import { useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaIdBadge,
  FaUserCheck,
  FaCalendarAlt,
} from "react-icons/fa";
import { logout } from "../../../../component/LogoutButton";

const ProfilePage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  if (!user) return <p className="text-center mt-10">Loading profile...</p>;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center sm:p-4">
      <div className="w-full bg-white rounded-xl shadow-lg p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:space-x-8 mb-8 border-b pb-6">
          <img
            src={user.profilePicture || "/default-avatar.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-blue-600 mb-4 md:mb-0"
          />
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-gray-500 mt-1 capitalize">{user.role}</p>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-3">
            <FaEnvelope className="text-blue-600 text-xl" />
            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="font-medium text-gray-800">{user.email}</p>
            </div>
          </div>

          {user.rollNumber && (
            <div className="flex items-center space-x-3">
              <FaIdBadge className="text-blue-600 text-xl" />
              <div>
                <p className="text-gray-500 text-sm">Roll Number</p>
                <p className="font-medium text-gray-800">{user.rollNumber}</p>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3">
            <FaUserCheck className="text-blue-600 text-xl" />
            <div>
              <p className="text-gray-500 text-sm">Status</p>
              <p
                className={`font-medium ${
                  user.isActive ? "text-green-600" : "text-red-600"
                }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <FaCalendarAlt className="text-blue-600 text-xl" />
            <div>
              <p className="text-gray-500 text-sm">Joined</p>
              <p className="font-medium text-gray-800">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start gap-4">
          {/* Edit Profile Button */}
          <button
            onClick={() => navigate("/teacher/update-profile")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Edit Profile
          </button>

          {/* Change Password Button */}
          <button
            onClick={() => navigate("/teacher/change-password")}
            className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
          >
            Change Password
          </button>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-green-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
