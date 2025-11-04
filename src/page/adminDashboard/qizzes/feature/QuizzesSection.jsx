import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import {QuizzesData as CurrentQuizzes } from

export default function QuizzesSection() {
  const [quizzes, setQuizzes] = useState(CurrentQuizzes)
  const quizzes = [
    { title: "HTML Basics", course: "Web Development", questions: 10 },
    { title: "Database Design", course: "Database Systems", questions: 8 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-5">
        <div className="w-full sm:w-1/3 flex items-center gap-2 rounded-md px-2 focus-within:border-gray-500 focus-within:ring-2 focus-within:ring-gray transition">
          <CiSearch className="text-gray" />
          <input
            type="search"
            placeholder="Search Course..."
            className="py-2 px-3 outline-none border-none bg-transparent w-full text-gray-dark"
          />
        </div>

        <div className="flex items-center flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <select className="px-3 py-2 w-full sm:w-48 border border-gray-light bg-white rounded-md outline-none text-gray-dark focus:border-primary focus:ring-1 focus:ring-primary">
            <option value="All">All Categories</option>
            <option value="Programming">Programming</option>
            <option value="Design">Design</option>
            <option value="Database">Database</option>
          </select>

          <button
            // onClick={() => setAddCourses(true)}
            className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 shadow-card transition"
          >
            <FaPlus /> Add Course
          </button>
        </div>
      </div>

      <table className="w-full bg-white rounded-lg shadow-sm">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="py-2 px-4 font-normal text-base text-left">Quiz Title</th>
            <th className="py-2 px-4 font-normal text-base text-left">Course</th>
            <th className="py-2 px-4 font-normal text-base text-left">Questions</th>
            <th className="py-2 px-4 font-normal text-base text-left">Total Marks</th>
            <th className="py-2 px-4 font-normal text-base text-left">Attempts</th>
            <th className="py-2 px-4 font-normal text-base text-left">Status</th>
            <th className="py-2 px-4 font-normal text-base text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((q, i) => (
            <tr key={i} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4 text-sm font-thin text-gray-900">{q.title}</td>
              <td className="py-2 px-4 text-sm font-thin text-gray-900">{q.course}</td>
              <td className="py-2 px-4 text-sm font-thin text-gray-900">{q.questions}</td>
              <td className="py-2 px-4 text-sm font-thin text-gray-900">{q.questions}</td>
              <td className="py-2 px-4 text-sm font-thin text-gray-900 text-center flex justify-center gap-3">
                <FaEdit className="text-indigo-600 cursor-pointer" />
                <FaTrash className="text-red-500 cursor-pointer" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
