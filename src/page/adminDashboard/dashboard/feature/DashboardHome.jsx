import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../../../context/ContextApi";
import { useNavigate } from "react-router-dom"; // ✅ Import Navigate
import { LuBookOpen, LuFileQuestion, LuUserCheck, LuUsers } from "react-icons/lu";
import StatCard from "../../../../component/StatCard";
import LineCharts from "./LineChart";
import EnrollmentCharts from "./EnrollmentStatusCharts";
import RecentActiveStudent from "./RecentActiveStudent";

export default function DashboardHome() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate(); // ✅ Hook for redirection
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to fix broken images
  const getProfileImage = (url) => {
    if (!url) return "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    if (url.startsWith("http") || url.startsWith("blob")) return url;
    return `http://localhost:5000${url}`;
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        // ✅ SECURITY CHECK: If no token, stop immediately and go to login
        if (!token || token === "undefined") {
          console.warn("No valid token found. Redirecting to login...");
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setDashboardData(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        // ✅ If token is expired/invalid (401 or 403), force logout
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  if (loading) return (
    <div className="p-10 flex justify-center">
       <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  
  if (!dashboardData) {
    return (
      <div className="p-10 text-center flex flex-col items-center justify-center text-red-500">
        <p className="text-xl font-semibold">Failed to load data.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  const { stats, charts, recentActivity } = dashboardData;

  const statCards = [
    { title: "Total Courses", value: stats.totalCourses, status: "Overview", icon: <LuUsers /> },
    { title: "Total Quizzes", value: stats.totalQuizzes, status: "Overview", icon: <LuBookOpen /> },
    { title: "Students Enrolled", value: stats.totalStudents, status: "Overview", icon: <LuFileQuestion /> },
    { title: "Pending Grading", value: stats.pendingGrading, status: "Action needed", icon: <LuUserCheck /> }
  ];

  return (
    <div className="space-y-6">
      
      {/* Welcome Header */}
      <div className="bg-white p-6 rounded-2xl shadow-md  flex items-center gap-5">
        <img
          src={getProfileImage(user?.profilePicture || user?.profile_picture)}
          alt="Profile"
          className="w-16 h-16 rounded-full object-cover border-4 border-blue-50 bg-gray-100"
          onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; }}
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back, {user?.firstName || "Teacher"}!
          </h1>
          <p className="text-gray-500 text-sm">Here is an overview of your students' performance today.</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <StatCard key={i} title={s.title} value={s.value} status={s.status} icon={s.icon} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Enrollment Trends</h3>
          <LineCharts data={charts.enrollmentTrend} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Completion Status</h3>
          <EnrollmentCharts data={charts.enrollmentStatus} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="w-full bg-white p-3 sm:p-5 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 ml-2">Recent Student Activity</h3>
        <RecentActiveStudent data={recentActivity} />
      </div>
    </div>
  );
}