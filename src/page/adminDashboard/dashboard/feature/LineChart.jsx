import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const LineCharts = () => {
  // 📊 Bar chart data
  const barData = [
    { month: "Jan", students: 45 },
    { month: "Feb", students: 52 },
    { month: "Mar", students: 48 },
    { month: "Apr", students: 61 },
    { month: "May", students: 72 },
    { month: "Jun", students: 68 },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-700">
        Student Enrollment Trend
      </h3>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip />
            <Bar dataKey="students" fill="#2563EB" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineCharts;
