import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const LineCharts = ({ data }) => {
  // If no data, show empty state
  if (!data || data.length === 0) return <p className="text-center py-10 text-gray-400">No enrollment data available.</p>;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-700">
        Student Enrollment Trend
      </h3>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip />
            <Bar dataKey="count" name="Students" fill="#2563EB" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineCharts;