import React from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
} from "recharts";

const EnrollmentCharts = ({ data }) => {
  const COLORS = ["#3B82F6", "#10B981", "#EF4444"]; // Blue, Emerald, Red

  // ✅ Transform Backend Data logic remains unchanged
  const processData = (rawData) => {
    if (!rawData) return [];
    return rawData.map(item => ({
      name: item.status.charAt(0).toUpperCase() + item.status.slice(1), 
      value: Number(item.count)
    }));
  };

  const pieData = processData(data);

  if (pieData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-80 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
        <p className="text-gray-400 font-medium">No status data available</p>
      </div>
    );
  }

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-2 border border-gray-100 shadow-xl rounded-xl flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].payload.fill }}></div>
          <span className="text-sm font-semibold text-gray-700">{payload[0].name}:</span>
          <span className="text-sm font-bold text-gray-900">{payload[0].value}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-md h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-800 mb-2">Enrollment Status</h3>
      <div className="flex-1 w-full min-h-[250px] flex justify-center items-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60} // Donut style
              outerRadius={85}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              formatter={(value) => <span className="text-sm text-gray-600 ml-1">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EnrollmentCharts;