import { CiSearch } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { LuUsers } from "react-icons/lu";
import { MdOutlineDeleteOutline, MdOutlineRemoveRedEye } from "react-icons/md";
import { CoursesData } from "../../../../data/CoursesData";

export default function AboutCourses() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-5 sm:gap-0 w-full">
        {/* Search Field */}
        <div className="w-full sm:w-1/3 border flex items-center gap-2 rounded-md px-2 focus-within:border-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-200 transition">
          <CiSearch className="text-gray-500" />
          <input
            type="search"
            className="py-2 px-3 outline-none border-none bg-transparent w-full"
            placeholder="Search Course..."
          />
        </div>

        {/* Dropdown & Button */}
        <div className="flex items-center flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <select
            name="Category"
            id="category"
            className="px-3 py-2 w-full sm:w-48 border bg-white outline-none rounded-md focus:border-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition"
          >
            <option value="All Categories" className="bg-white">
              All Categories
            </option>
            <option value="Web Development" className="bg-white">
              Web Development
            </option>
            <option value="UI/UX Design" className="bg-white">
              UI/UX Design
            </option>
            <option value="Database" className="bg-white">
              Database
            </option>
          </select>
          <button className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors duration-300">
            <FaPlus /> Add Course
          </button>
        </div>
      </div>
      <div className="grid md:grid-cols-2 w-full gap-4 mt-4">
        {CoursesData.map((coursesInfo, idx) => (
          <div className="p-4 sm:p-6 bg-white rounded-xl shadow-soft hover:shadow-card transition-shadow duration-300" key={idx}>
            {/* courses detail */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold">{coursesInfo.title}</h2>
                <span className="text-sm text-gray-500">{coursesInfo.category}</span>
              </div>
              {
                coursesInfo.status === "active" &&
              <span className="px-2 py-1 bg-green-100 text-success rounded-lg">
                {coursesInfo.status}
              </span>
              }
              {
                coursesInfo.status === "completed" &&
              <span className="px-2 py-1 bg-blue-100 text-success rounded-lg">
                {coursesInfo.status}
              </span>
              }
              {
                coursesInfo.status === "draft" &&
              <span className="px-2 py-1 bg-yellow  text-success rounded-lg">
                {coursesInfo.status}
              </span>
              }
            </div>
            {/* student and week */}
            <div className="flex justify-between items-center mt-7">
              <div className="flex items-center gap-3">
                <LuUsers className="text-gray text-xl" />
                <span className="text-gray text-lg">{coursesInfo.students}</span>
              </div>
              <span className="text-gray text-lg">{coursesInfo.duration}</span>
            </div>
            {/* progress detail */}
            <div className="flex justify-between items-center mt-4">
              <span className="text-gray font-semibold text-lg">Progress</span>
              <span className="font-regular text-lg">{coursesInfo.progress + "%"}</span>
            </div>
            {/* progress bar */}
            <div className="w-full rounded-lg bg-gray-light my-2">
              <div
                className="bg-primary h-3 rounded-lg"
                style={{ width: coursesInfo.progress + "%" }}
              ></div>
            </div>
            {/* view details button */}
            <div className="grid sm:grid-cols-[43%_43%_auto] gap-2 items-center mt-4">
              <button className="flex items-center justify-center gap-2 rounded-lg px-4 py-2 whitespace-nowrap border border-gray hover:bg-gray-light transition-colors duration-300">
                <MdOutlineRemoveRedEye />
                View Details
              </button>
              <button className="flex items-center justify-center gap-2 rounded-lg px-4 py-2 whitespace-nowrap border border-gray hover:bg-gray-light transition-colors duration-300">
                <FiEdit />
                View Details
              </button>
              <button className="text-error flex items-center justify-center gap-2 rounded-lg px-2 py-2 whitespace-nowrap border border-gray hover:bg-red-100 transition-colors duration-300">
                <MdOutlineDeleteOutline className="text-xl" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
