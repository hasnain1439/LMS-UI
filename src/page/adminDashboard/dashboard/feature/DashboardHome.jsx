import React, { useEffect, useState } from "react";
import axios from "axios";
import { LuBookOpen, LuFileQuestion, LuUserCheck, LuUsers } from "react-icons/lu";
import StatCard from "../../../../component/StatCard";
import LineCharts from "./LineChart";
import EnrollmentCharts from "./EnrollmentStatusCharts";
import RecentActiveStudent from "./RecentActiveStudent";

export default function DashboardHome() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // ✅ FIX: Use 'withCredentials: true' to send the HttpOnly Cookie
        // Removed manual 'Authorization' header because your auth uses cookies
        const response = await axios.get("http://localhost:5000/api/dashboard/stats", {
          withCredentials: true, 
        });
        
        setDashboardData(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        // Optional: Redirect to login if unauthorized
        // if (error.response && error.response.status === 401) window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Dashboard...</div>;
  
  if (!dashboardData) {
    return (
      <div className="p-10 text-center flex flex-col items-center justify-center text-red-500">
        <p className="text-xl font-semibold">Failed to load data.</p>
        <p className="text-sm text-gray-500 mt-2">Please check if you are logged in.</p>
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
    <div>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <StatCard key={i} title={s.title} value={s.value} status={s.status} icon={s.icon} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <LineCharts data={charts.enrollmentTrend} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <EnrollmentCharts data={charts.enrollmentStatus} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="w-full bg-white p-3 sm:p-5 rounded-lg shadow my-4">
        <RecentActiveStudent data={recentActivity} />
      </div>
    </div>
  );
}