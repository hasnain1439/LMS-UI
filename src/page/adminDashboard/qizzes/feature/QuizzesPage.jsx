import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

export default function QuizzesPage() {
  const quizzes = [
    { title: "HTML Basics", course: "Web Development", questions: 10 },
    { title: "Database Design", course: "Database Systems", questions: 8 },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Quizzes</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700">
          <FaPlus /> Add Quiz
        </button>
      </div>

      <table className="w-full bg-white rounded-lg shadow-sm">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="py-2 px-4 text-left">Quiz Title</th>
            <th className="py-2 px-4 text-left">Course</th>
            <th className="py-2 px-4 text-left">Questions</th>
            <th className="py-2 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((q, i) => (
            <tr key={i} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{q.title}</td>
              <td className="py-2 px-4">{q.course}</td>
              <td className="py-2 px-4">{q.questions}</td>
              <td className="py-2 px-4 text-center flex justify-center gap-3">
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
