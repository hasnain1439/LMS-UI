import { FaEnvelope, FaIdBadge, FaLock } from "react-icons/fa";

export default function ProfilePage() {
  const profile = {
    name: "Hasnain Iqbal",
    email: "hasnain@example.com",
    role: "Teacher",
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">My Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm w-full md:w-2/3 lg:w-1/2">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <FaIdBadge className="text-indigo-600" />
            <span className="font-medium text-gray-700">{profile.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <FaEnvelope className="text-indigo-600" />
            <span className="text-gray-700">{profile.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <FaLock className="text-indigo-600" />
            <span className="text-gray-700">{profile.role}</span>
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 mt-4">
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}
