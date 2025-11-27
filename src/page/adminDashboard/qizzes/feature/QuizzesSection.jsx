import { useEffect, useState } from "react";
import { FaPlus, FaPencilAlt, FaTrash, FaRegEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCourses } from "../../../../api/UseCourses";

// Status badge styles
const getStatusStyles = (status) => {
  switch (status?.toLowerCase()) {
    case "published":
    case "active":
      return "bg-success text-white";
    case "draft":
      return "bg-warning text-white";
    case "archived":
    case "closed":
      return "bg-error text-white";
    default:
      return "bg-gray text-white";
  }
};

export default function QuizzesSection() {
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { courses, waiting, error: courseError } = useCourses();

  // Fetch quizzes when courseId or status changes
  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to view quizzes.");
        setLoading(false);
        return;
      }

      const params = {};
      if (courseId) params.courseId = courseId;
      if (status) params.status = status;

      try {
        const res = await axios.get(
          "http://localhost:5000/api/quizzes/teacher-quizzes",
          {
            params,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setQuizzes(res.data.quizzes || []);
      } catch (err) {
        console.error("Error loading quizzes:", err);
        if (err.response?.status === 401) {
          setError("Unauthorized. Please login again.");
          navigate("/login"); // redirect to login if token invalid
        } else {
          setError("Failed to load quizzes. Please try again.");
        }
        setQuizzes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [courseId, status]);

  return (
    <div className="w-full space-y-6">
      {/* Header: Filters + Add Button */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-5">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {/* Filter by Course */}
          <div className="flex flex-col">
            {waiting && (
              <p className="text-gray-dark mb-1">Loading courses...</p>
            )}
            {courseError && <p className="text-error mb-1">{courseError}</p>}
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="px-3 py-2 w-full sm:w-48 border border-gray bg-white rounded-xl text-gray-dark"
            >
              <option value="">All Courses</option>
              {courses?.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Status */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 w-full sm:w-40 border border-gray bg-white rounded-xl text-gray-dark"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="closed">Closed</option>
          </select>

          {/* Add Quiz Button */}
          <button
            onClick={() => navigate("create-quizzes")}
            className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-xl flex items-center justify-center gap-2"
          >
            <FaPlus /> Add Quiz
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto w-full bg-white rounded-2xl shadow-card border border-gray-light">
        {loading ? (
          <p className="text-center py-4">Loading quizzes...</p>
        ) : error ? (
          <p className="text-center py-4 text-error">{error}</p>
        ) : (
          <table className="min-w-[900px] w-full text-sm sm:text-base">
            <thead className="text-gray-dark uppercase text-xs sm:text-sm font-semibold tracking-wider border-b border-gray">
              <tr>
                <th className="py-3 px-4 text-left">Quiz Title</th>
                <th className="py-3 px-4 text-left">Course</th>
                <th className="py-3 px-4 text-left">Questions</th>
                <th className="py-3 px-4 text-left whitespace-nowrap">
                  Total Marks
                </th>
                <th className="py-3 px-4 text-left">Attempts</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-dark divide-y divide-gray-light">
              {quizzes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    No quizzes found
                  </td>
                </tr>
              ) : (
                quizzes.map((q, i) => (
                  <tr
                    key={i}
                    className="hover:bg-gray-100 transition duration-150"
                  >
                    <td className="py-3 px-4 whitespace-nowrap">{q.title}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {q.courseName}
                    </td>
                    <td className="py-3 px-4">{q.totalQuestions}</td>
                    <td className="py-3 px-4">{q.totalMarks}</td>
                    <td className="py-3 px-4">{q.submissionCount}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusStyles(
                          q.status
                        )}`}
                      >
                        {q.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 flex justify-center items-center gap-3">
                      <FaRegEye
                        className="text-gray hover:text-primary cursor-pointer transition"
                        title="View"
                      />
                      <FaPencilAlt
                        className="text-gray hover:text-primary cursor-pointer transition"
                        title="Edit"
                      />
                      <FaTrash
                        className="text-error hover:text-error/80 cursor-pointer transition"
                        title="Delete"
                      />
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
