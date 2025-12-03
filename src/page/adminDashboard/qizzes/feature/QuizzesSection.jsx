import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaRegEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GetCourses } from "../../../../api/GetCourses"; // Ensure this path is correct

// Helper for status styling (Green pill for published)
const getStatusStyles = (status) => {
  switch (status?.toLowerCase()) {
    case "published":
    case "active":
      return "bg-green-100 text-green-700 font-bold";
    case "draft":
      return "bg-yellow-100 text-yellow-700 font-bold";
    case "archived":
    case "closed":
      return "bg-red-100 text-red-700 font-bold";
    default:
      return "bg-gray-100 text-gray-600 font-bold";
  }
};

export default function QuizzesSection() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 👇 NEW: Local state to store courses
  const [courses, setCourses] = useState([]);

  // 👇 UPDATED: Fetch courses using useEffect instead of calling it directly
  useEffect(() => {
    const fetchCoursesData = async () => {
      try {
        const data = await GetCourses();
        setCourses(data || []);
      } catch (err) {
        console.error("Failed to load courses:", err);
      }
    };
    fetchCoursesData();
  }, []);

  // Fetch quizzes
  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await axios.get(
          "http://localhost:5000/api/quizzes/teacher-quizzes",
          {
            params: { courseId, status },
            withCredentials: true,
          }
        );
        setQuizzes(res.data.quizzes || []);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          navigate("/login", { replace: true });
        } else {
          setError("Failed to load quizzes. Please check backend connection.");
          setQuizzes([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [courseId, status, navigate]);

  // Handle Delete
  const handleDelete = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/quizzes/${quizId}`, {
        withCredentials: true,
      });
      setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
    } catch (err) {
      alert("Failed to delete quiz");
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Bar: Filters & Add Button */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          {/* 👇 UPDATED LOGIC: Mapping over the 'courses' state */}
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="px-4 py-2 w-full sm:w-56 border border-gray-300 bg-white rounded-lg outline-none text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-sm"
          >
            <option value="">All Courses</option>
            {Array.isArray(courses) &&
              courses.map((course) => (
                <option
                  key={course.id || course._id}
                  value={course.id || course._id}
                >
                  {course.name}
                </option>
              ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2 w-full sm:w-40 border border-gray-300 bg-white rounded-lg outline-none text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-sm"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Add Button */}
        <div className="w-full sm:w-auto">
          <button
            onClick={() => navigate("create-quizzes")}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 shadow-md transition font-medium"
          >
            <FaPlus size={14} /> Add Quiz
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto w-full bg-white rounded-xl shadow-md">
        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading quizzes...</p>
        ) : error ? (
          <p className="text-center py-10 text-red-500">{error}</p>
        ) : (
          <table className="min-w-[900px] w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-white">
                <th className="py-5 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Quiz Title
                </th>
                <th className="py-5 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Course
                </th>
                <th className="py-5 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Questions
                </th>
                <th className="py-5 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Total Marks
                </th>
                <th className="py-5 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Attempts
                </th>
                <th className="py-5 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-5 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {quizzes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-500">
                    No quizzes found.
                  </td>
                </tr>
              ) : (
                quizzes.map((q, i) => (
                  <tr
                    key={q.id || q._id || i}
                    className="hover:bg-gray-50 transition duration-150 group"
                  >
                    {/* Title */}
                    <td className="py-4 px-6 text-sm font-semibold text-gray-text">
                      {q.title || "Untitled Quiz"}
                    </td>

                    {/* Course */}
                    <td className="py-4 px-6 text-sm text-gray-text">
                      {q.courseName}
                    </td>

                    {/* Questions */}
                    <td className="py-4 px-6 text-sm font-bold text-gray-text">
                      {q.totalQuestions}
                    </td>

                    {/* Total Marks */}
                    <td className="py-4 px-6 text-sm text-gray-text font-medium">
                      {q.totalMarks}
                    </td>

                    {/* Attempts */}
                    <td className="py-4 px-6 text-sm text-gray-text">
                      {q.submissionCount || 0}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs capitalize ${getStatusStyles(
                          q.status
                        )}`}
                      >
                        {q.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6">
                      <div className="flex justify-center items-center gap-4">
                        <button
                          className="text-gray-text hover:text-blue-600 transition p-1"
                          title="View"
                          onClick={() => navigate(`view-quiz/${q.id}`)}
                        >
                          <FaRegEye size={18} />
                        </button>

                        <button
                          className="text-gray-text hover:text-blue-600 transition p-1"
                          title="Edit"
                          onClick={() => navigate(`edit-quiz/${q.id}`)}
                        >
                          <FaEdit size={18} />
                        </button>

                        <button
                          className="text-red-500 hover:text-red-700 transition p-1"
                          title="Delete"
                          onClick={() => handleDelete(q.id)}
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
