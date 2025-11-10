import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { QuizzesData as CurrentQuizzes } from "../../../../data/data";

export default function QuizzesSection() {
  const [quizzes, setQuizzes] = useState(CurrentQuizzes);

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-5">
        {/* Search Input */}
        <div className="w-full sm:w-1/3 flex items-center gap-2 rounded-md border border-gray-300 px-2 focus-within:ring-2 focus-within:ring-primary transition">
          <CiSearch className="text-gray-500" />
          <input
            type="search"
            placeholder="Search Quiz..."
            className="py-2 px-3 outline-none border-none bg-transparent w-full text-gray-700 placeholder:text-gray-400"
          />
        </div>

        {/* Filter and Add Button */}
        <div className="flex items-center flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <select className="px-3 py-2 w-full sm:w-48 border border-gray-300 bg-white rounded-md outline-none text-gray-700 focus:border-primary focus:ring-1 focus:ring-primary">
            <option value="All">All Categories</option>
            <option value="Programming">Programming</option>
            <option value="Design">Design</option>
            <option value="Database">Database</option>
          </select>

          <button className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 shadow-card transition">
            <FaPlus /> Add Quiz
          </button>
        </div>
      </div>

      {/* ✅ Responsive Scrollable Table */}
      {/* ✅ Responsive Scrollable Table */}
      <div className="w-full overflow-x-auto rounded-lg shadow-sm bg-white">
        <table className="min-w-max w-full text-sm sm:text-base">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="py-2 px-4 font-normal text-left whitespace-nowrap">
                Quiz Title
              </th>
              <th className="py-2 px-4 font-normal text-left whitespace-nowrap">
                Course
              </th>
              <th className="py-2 px-4 font-normal text-left">Questions</th>
              <th className="py-2 px-4 font-normal text-left whitespace-nowrap">
                Total Marks
              </th>
              <th className="py-2 px-4 font-normal text-left">Attempts</th>
              <th className="py-2 px-4 font-normal text-left">Status</th>
              <th className="py-2 px-4 font-normal text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {quizzes.map((q, i) => (
              <tr
                key={i}
                className="border-b hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="py-2 px-4 text-gray-900 whitespace-nowrap">
                  {q.title}
                </td>
                <td className="py-2 px-4 text-gray-900 whitespace-nowrap">
                  {q.course}
                </td>
                <td className="py-2 px-4 text-gray-900">{q.questions}</td>
                <td className="py-2 px-4 text-gray-900">{q.totalMarks}</td>
                <td className="py-2 px-4 text-gray-900">{q.attempts}</td>
                <td className="py-2 px-4 text-gray-900">{q.status}</td>
                <td className="py-2 px-4 text-gray-900 text-center flex justify-center gap-3">
                  <FaEdit className="text-indigo-600 cursor-pointer" />
                  <FaTrash className="text-red-500 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
