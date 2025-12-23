import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../../../context/ContextApi";
import { useNavigate } from "react-router-dom";
import {
  LuBookOpen,
  LuFileQuestion,
  LuUserCheck,
  LuUsers,
} from "react-icons/lu";
import StatCard from "../../../../component/StatCard";
import LineCharts from "./LineChart";
import EnrollmentCharts from "./EnrollmentStatusCharts";
import RecentActiveStudent from "./RecentActiveStudent";
import TeacherLiveSchedule from "./TeacherLiveSchedule";

// ✅ Define Backend URL
const BACKEND_URL = "http://localhost:5000";

export default function DashboardHome() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Helper: Safe Image Handling
  const getProfileImage = (url) => {
    if (!url || url === "undefined" || url === "null") {
      return "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    }
    if (url.startsWith("http") || url.startsWith("blob")) return url;
    return `${BACKEND_URL}${url}?t=${new Date().getTime()}`;
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token || token === "undefined") {
          navigate("/login");
          return;
        }

        const response = await axios.get(`${BACKEND_URL}/api/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDashboardData(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!dashboardData) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-red-500">
        <p className="text-xl font-semibold">Failed to load data.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  const { stats, charts, recentActivity } = dashboardData;

  const statCards = [
    {
      title: "Total Courses",
      value: stats.totalCourses,
      status: "Overview",
      icon: <LuUsers size={20} />,
    },
    {
      title: "Total Quizzes",
      value: stats.totalQuizzes,
      status: "Overview",
      icon: <LuBookOpen size={20} />,
    },
    {
      title: "Students Enrolled",
      value: stats.totalStudents,
      status: "Overview",
      icon: <LuFileQuestion size={20} />,
    },
    {
      title: "Pending Grading",
      value: stats.pendingGrading,
      status: "Action needed",
      icon: <LuUserCheck size={20} />,
    },
  ];

  return (
    <div className="space-y-8 font-sans text-gray-800">
      {/* Welcome Header */}
      <div className="bg-white p-8 rounded-3xl shadow-md flex flex-col sm:flex-row items-center gap-6">
        <img
          src={getProfileImage(user?.profilePicture || user?.profile_picture)}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-lg"
          onError={(e) => {
            e.target.src =
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
          }}
        />
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Welcome back, {user?.firstName || "Teacher"}!
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            Here is an overview of your students' performance today.
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((s, i) => (
          <StatCard
            key={i}
            title={s.title}
            value={s.value}
            status={s.status}
            icon={s.icon}
          />
        ))}
      </div>
      <TeacherLiveSchedule data={dashboardData.schedule}/>
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trends */}
        <div className="flex-1 w-full min-h-[300px]">
          <LineCharts data={charts.enrollmentTrend} />
        </div>

        {/* Completion Status */}
        <div className="flex-1 w-full min-h-[300px]">
          <EnrollmentCharts data={charts.enrollmentStatus} />
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActiveStudent data={recentActivity} />
    </div>
  );
}
