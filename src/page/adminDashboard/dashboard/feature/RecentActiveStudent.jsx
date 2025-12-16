import React from "react";
import { LuUsers } from "react-icons/lu";

function RecentActiveStudent({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="p-5 text-center text-gray-500">
        <h3 className="text-[1rem] font-semibold mb-2">Recent Activity</h3>
        <p>No recent activity found.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-[1rem] font-semibold">Recent Activity</h3>
      <div className="flex flex-col gap-3 sm:gap-4 my-4">
        {data.map((activity, index) => (
          <div key={index} className="flex items-start sm:items-center gap-2 border-b border-gray-100 last:border-0 pb-2 last:pb-0">
            <div className="p-3 bg-blue-600 text-white rounded-full flex items-center justify-center min-w-[44px]">
              <LuUsers className="text-[20px]" />
            </div>
            <div className="ms-3">
              <h3 className="text-[1rem] font-medium text-gray-800">
                {activity.message}
              </h3>
              <p className="text-sm text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentActiveStudent;