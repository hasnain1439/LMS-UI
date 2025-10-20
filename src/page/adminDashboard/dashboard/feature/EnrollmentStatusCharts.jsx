import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const EnrollmentCharts = () => {
  // 🥧 Pie chart data
  const pieData = [
    { name: "Active", value: 58 },
    { name: "Completed", value: 33 },
    { name: "Dropped", value: 9 },
  ];

  const COLORS = ["#2563EB", "#10B981", "#EF4444"]; // blue, green, red

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
              label={({ name, value }) => `${name} ${value}%`}
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
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
