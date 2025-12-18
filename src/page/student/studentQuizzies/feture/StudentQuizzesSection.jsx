import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Loader2,
  Calendar,
} from "lucide-react";

export default function StudentQuizzesSection() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // --- Fetch Quizzes ---
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/quizzes/student-quizzes",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setQuizzes(response.data.quizzes || []);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setError("Failed to load quizzes.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  // --- Filtering Logic (FIXED & SAFE) ---
  const filteredQuizzes = quizzes.filter((quiz) => {
    // ✅ FIX: Use "" if title or courseName is missing
    const title = quiz.title || "";
    const courseName = quiz.courseName || "";

    const searchLower = searchTerm.toLowerCase();

    // ✅ Now this is safe and won't crash
    const matchesSearch =
      title.toLowerCase().includes(searchLower) ||
      courseName.toLowerCase().includes(searchLower);

    if (!matchesSearch) return false;

    if (filter === "todo") return !quiz.isSubmitted;
    if (filter === "completed") return quiz.isSubmitted;
    return true;
  });

  // --- Action Handler ---
  const handleQuizAction = (quiz) => {
    const now = new Date();
    const deadline = new Date(quiz.deadline);

    if (quiz.isSubmitted) {
      alert(`You scored ${quiz.submissionScore} / ${quiz.totalMarks}`);
    } else if (now > deadline) {
      alert("This quiz is overdue and cannot be attempted.");
    } else {
      navigate(`/student/take-quiz/${quiz.id}`);
    }
  };

  // --- Helper: Format Date ---
  const formatDate = (dateString) => {
    if (!dateString) return "No Date";
    return new Date(dateString).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // --- Helper: Get Status Badge ---
  const getStatusBadge = (quiz) => {
    const now = new Date();
    const deadline = new Date(quiz.deadline);

    if (quiz.isSubmitted) {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
          <CheckCircle size={12} /> Completed
        </span>
      );
    }
    if (now > deadline) {
      return (
        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold flex items-center gap-1">
          <AlertCircle size={12} /> Missed
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold flex items-center gap-1">
        <Clock size={12} /> Pending
      </span>
    );
  };

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 py-8">
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="text-blue-600" size={28} />
              My Quizzes
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Manage your upcoming assessments and view results.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex p-1 bg-white border border-gray-200 rounded-xl">
              {["all", "todo", "completed"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                    filter === f
                      ? "bg-blue-50 text-blue-600 shadow-sm"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {f === "todo" ? "To Do" : f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- Quiz List --- */}
        {filteredQuizzes.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <FileText className="text-gray-300" size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              No quizzes found
            </h3>
            <p className="text-gray-500">
              You're all caught up! Check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => {
              const isOverdue =
                new Date() > new Date(quiz.deadline) && !quiz.isSubmitted;

              return (
                <div
                  key={quiz.id}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col"
                >
                  {/* Top Row: Course & Status */}
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wide">
                      {quiz.courseName || "General"}
                    </span>
                    {getStatusBadge(quiz)}
                  </div>

                  {/* Title & Info */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                    {quiz.title || "Untitled Quiz"}
                  </h3>
                  <div className="text-sm text-gray-500 space-y-2 mb-6">
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>
                        {quiz.timeLimitMinutes} Mins • {quiz.totalQuestions}{" "}
                        Questions
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span
                        className={isOverdue ? "text-red-500 font-medium" : ""}
                      >
                        Due: {formatDate(quiz.deadline)}
                      </span>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400 block uppercase tracking-wider">
                        Total Marks
                      </span>
                      <span className="font-bold text-gray-900">
                        {quiz.totalMarks}
                      </span>
                    </div>

                    {quiz.isSubmitted ? (
                      <div className="text-right">
                        <span className="text-xs text-gray-400 block uppercase tracking-wider">
                          Your Score
                        </span>
                        <span className="font-bold text-green-600 text-lg">
                          {quiz.submissionScore ?? "Grading..."}
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleQuizAction(quiz)}
                        disabled={isOverdue}
                        className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                          isOverdue
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200"
                        }`}
                      >
                        {isOverdue ? "Closed" : "Start Quiz"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
