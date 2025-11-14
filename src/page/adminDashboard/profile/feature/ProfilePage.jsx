import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEnvelope, FaUser, FaIdBadge, FaCalendarAlt, FaUserCheck } from "react-icons/fa";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/profile", {
          withCredentials: true, // include cookies for authentication
        });
        setUser(res.data.user);
      } catch (err) {
        console.error(
          "Error fetching profile:",
          err.response?.data || err.message
        );
        setError(err.response?.data?.error || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading)
    return <p className="text-center mt-20 text-gray-600">Loading profile...</p>;
  if (error)
    return <p className="text-center mt-20 text-red-500">{error}</p>;
  if (!user)
    return <p className="text-center mt-20 text-gray-600">No profile data found.</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center sm:p-4">
      <div className="w-full bg-white rounded-xl shadow-lg p-4 sm:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8 mb-8 border-b pb-6">
          <img
            src={user.profilePicture || "/default-avatar.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-primary mb-4 md:mb-0"
          />
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-gray-500 mt-1 capitalize">{user.role}</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-3">
            <FaEnvelope className="text-primary text-xl" />
            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="font-medium text-gray-800">{user.email}</p>
            </div>
          </div>

          {user.rollNumber && (
            <div className="flex items-center space-x-3">
              <FaIdBadge className="text-primary text-xl" />
              <div>
                <p className="text-gray-500 text-sm">Roll Number</p>
                <p className="font-medium text-gray-800">{user.rollNumber}</p>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3">
            <FaUserCheck className="text-primary text-xl" />
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
            <FaCalendarAlt className="text-primary text-xl" />
            <div>
              <p className="text-gray-500 text-sm">Joined</p>
              <p className="font-medium text-gray-800">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center md:text-left">
          <button className="px-6 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary-dark transition">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
