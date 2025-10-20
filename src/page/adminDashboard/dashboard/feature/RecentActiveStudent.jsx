import { LuUsers } from "react-icons/lu";

function RecentActiveStudent() {
  return (
    <div>
      <h3 className="text-[1rem] font semibold">Recent Activity</h3>
      <div className="flex flex-col gap-3 sm:gap-4 my-4">
        <div className="flex items-start sm:items-center gap-2">
          <div className="p-3 bg-primary text-white rounded-full flex items-center justify-center">
            <LuUsers className="text-[20px]" />
          </div>
          <div className="ms-3">
            <h3 className="text-[1rem] ">
              Sarah Johnson enrolled in Web Development Basics
            </h3>
            <p>2 hours ago</p>
          </div>
        </div>
        <div className="flex items-start sm:items-center gap-2">
          <div className="p-3 bg-primary text-white rounded-full flex items-center justify-center">
            <LuUsers className="text-[20px]" />
          </div>
          <div className="ms-3">
            <h3 className="text-[1rem] ">
              Mike Chen completed quiz in JavaScript Fundamentals
            </h3>
            <p>5 hours ago</p>
          </div>
        </div>
        <div className="flex items-start sm:items-center gap-2">
          <div className="p-3 bg-primary text-white rounded-full flex items-center justify-center">
            <LuUsers className="text-[20px]" />
          </div>
          <div className="ms-3">
            <h3 className="text-[1rem] ">
              Emily Davis submitted assignment for React Advanced Patterns
            </h3>
            <p>1 Day ago</p>
          </div>
        </div>
        <div className="flex items-start sm:items-center gap-2">
          <div className="p-3 bg-primary text-white rounded-full flex items-center justify-center">
            <LuUsers className="text-[20px]" />
          </div>
          <div className="ms-3">
            <h3 className="text-[1rem] ">
              Emily Davis submitted assignment for React Advanced Patterns
            </h3>
            <p>1 Day ago</p>
          </div>
        </div>
        <div className="flex items-start sm:items-center gap-2">
          <div className="p-3 bg-primary text-white rounded-full flex items-center justify-center">
            <LuUsers className="text-[20px]" />
          </div>
          <div className="ms-3">
            <h3 className="text-[1rem] ">
              James Wilson enrolled in Database Design
            </h3>
            <p>2 Day ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default RecentActiveStudent;
