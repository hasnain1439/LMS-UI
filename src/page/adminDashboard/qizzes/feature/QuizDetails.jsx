import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Clock,
  Award,
  Calendar,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  LayoutList,
} from "lucide-react";

export default function QuizDetails() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/quizzes/${quizId}`,
          {
            withCredentials: true,
          }
        );
        setQuiz(res.data.quiz);
      } catch (err) {
        console.error("Error fetching quiz details:", err);
        setError("Failed to load quiz details.");
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      fetchQuizDetails();
    }
  }, [quizId]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
        Loading details...
      </div>
    );

  if (error)
    return (
      <div className="p-10 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline"
        >
          Go Back
        </button>
      </div>
    );

  if (!quiz) return null;

  // Status Badge Color Helper
  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "draft":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "closed":
        return "bg-rose-100 text-rose-700 border-rose-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-800">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-sm text-gray-600"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                {quiz.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <span className="font-medium text-blue-600">
                  {quiz.courseName}
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span>
                  Created on {new Date(quiz.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(
              quiz.status
            )}`}
          >
            {quiz.status}
          </div>
        </div>

        {/* --- Info Cards Grid --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">
                Time Limit
              </p>
              <p className="font-semibold text-gray-900">
                {quiz.timeLimitMinutes} Mins
              </p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Award size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">
                Total Marks
              </p>
              <p className="font-semibold text-gray-900">{quiz.totalMarks}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <BookOpen size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">
                Questions
              </p>
              <p className="font-semibold text-gray-900">
                {quiz.totalQuestions}
              </p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">
                Deadline
              </p>
              <p className="font-semibold text-gray-900">
                {new Date(quiz.deadline).toLocaleDateString()}{" "}
                <span className="text-xs text-gray-400">
                  {new Date(quiz.deadline).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* --- Questions Preview --- */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm">
              <LayoutList className="text-blue-600" size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Quiz Preview</h2>
          </div>

          {quiz.questions && quiz.questions.length > 0 ? (
            quiz.questions.map((q, i) => (
              <div
                key={q.id}
                className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm"
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 font-bold rounded-lg text-sm">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-4">
                      {q.questionText}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {q.options.map((opt, idx) => {
                        const isCorrect = idx === q.correctOptionIndex;
                        return (
                          <div
                            key={idx}
                            className={`text-sm px-4 py-3 rounded-xl border flex items-center gap-3 ${
                              isCorrect
                                ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-medium"
                                : "bg-white border-gray-100 text-gray-600"
                            }`}
                          >
                            {isCorrect ? (
                              <CheckCircle2
                                size={18}
                                className="text-emerald-500 flex-shrink-0"
                              />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"></div>
                            )}
                            <span>{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-10 bg-white rounded-2xl border border-gray-200 border-dashed text-gray-500">
              <HelpCircle size={32} className="mx-auto mb-2 text-gray-300" />
              No questions available for this quiz.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
