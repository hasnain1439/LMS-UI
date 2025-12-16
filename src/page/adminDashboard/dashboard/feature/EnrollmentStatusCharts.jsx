import React from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
} from "recharts";

const EnrollmentCharts = ({ data }) => {
  const COLORS = ["#2563EB", "#10B981", "#EF4444"]; // Blue, Green, Red

  // ✅ Transform Backend Data: [{status: 'active', count: 5}] -> [{name: 'Active', value: 5}]
  const processData = (rawData) => {
    if (!rawData) return [];
    return rawData.map(item => ({
      name: item.status.charAt(0).toUpperCase() + item.status.slice(1), 
      value: Number(item.count)
    }));
  };

  const pieData = processData(data);

  if (pieData.length === 0) return <div className="h-64 flex items-center justify-center text-gray-400">No status data available.</div>;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-700">
        Enrollment Status Distribution
      </h3>

      <div className="w-full h-64 flex justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={90}
              dataKey="value"
              label={({ name, value }) => `${name} (${value})`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" height={36} />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EnrollmentCharts;