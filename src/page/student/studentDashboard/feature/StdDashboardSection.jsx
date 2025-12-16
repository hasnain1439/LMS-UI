import React from "react";
import { FaBookOpen, FaCheckCircle, FaChartBar } from "react-icons/fa";
import StatCard from "../../../../component/StatCard";
import LiveSchedule from "./LiveSchedule";
import ActiveCoursesGrid from "./ActiveCoursesGrid";
import UpcomingDeadlines from "./UpcomingDeadlines";

function StdDashboardSection  () {
  // Mock data for the student
  const stats = [
    {
      title: "Courses in Progress",
      value: "3",
      icon: <FaBookOpen />,
    },
    {
      title: "Completed Courses",
      value: "1",
      icon: <FaCheckCircle />,
    },
    {
      title: "Average Grade",
      value: "85%",
      icon: <FaChartBar />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Welcome Section */}
      <div className="">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, Ayesha! 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Here is your daily progress overview.
        </p>
      </div>

      {/* 2. Stats Grid using your reusable component */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            status="Overview" // You can change this text based on logic if needed
            icon={stat.icon}
          />
        ))}
      </div>
      <LiveSchedule/>
      <ActiveCoursesGrid/>
      <UpcomingDeadlines/>
    </div>
  );
}

export default StdDashboardSection;