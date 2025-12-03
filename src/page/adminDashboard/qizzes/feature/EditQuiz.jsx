import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  Clock,
  Calendar,
  Settings,
  AlertCircle,
  CheckCircle2,
  LayoutList,
} from "lucide-react";

// Validation Schema
const QuizSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .required("Title is required"),
  timeLimit: Yup.number()
    .min(1, "Must be at least 1 minute")
    .required("Time limit is required"),
  marksPerQuestion: Yup.number()
    .min(0.5, "Must be at least 0.5 marks")
    .required("Marks are required"),
  deadline: Yup.date().required("Deadline is required"),
  status: Yup.string().oneOf(["draft", "published", "closed"]).required(),
});

export default function EditQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);

  // State for Formik initial values
  const [initialValues, setInitialValues] = useState({
    title: "",
    timeLimit: "",
    marksPerQuestion: "",
    deadline: "",
    status: "draft",
  });

  // 1. Fetch Quiz Data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/quizzes/${quizId}`,
          {
            withCredentials: true,
          }
        );

        const data = res.data.quiz;
        setQuestions(data.questions || []);

        setInitialValues({
          title: data.title || "",
          timeLimit: data.timeLimitMinutes || "",
          marksPerQuestion: data.marksPerQuestion || "",
          deadline: data.deadline
            ? new Date(data.deadline).toISOString().slice(0, 16)
            : "",
          status: data.status || "draft",
        });
      } catch (err) {
        console.error("Failed to load quiz", err);
        alert("Failed to load quiz details");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId, navigate]);

  // 2. Setup Formik
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: QuizSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await axios.put(
          `http://localhost:5000/api/quizzes/${quizId}`,
          {
            title: values.title,
            timeLimitMinutes: Number(values.timeLimit),
            marksPerQuestion: Number(values.marksPerQuestion),
            deadline: new Date(values.deadline).toISOString(),
            status: values.status,
          },
          { withCredentials: true }
        );
        alert("Quiz details updated successfully!");
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.error || "Update failed");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Handle Question Delete
  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;
    try {
      await axios.delete(
        `http://localhost:5000/api/quizzes/${quizId}/questions/${questionId}`,
        { withCredentials: true }
      );
      setQuestions((prev) => prev.filter((q) => q.id !== questionId));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete question");
    }
  };

  // Helper for Status Badge Color
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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
          <div className="text-gray-400 text-sm">Loading quiz details...</div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* --- Page Header --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl transition-all shadow-sm text-gray-600"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Edit Quiz
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <span>Manage settings</span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span>{questions.length} Questions</span>
              </div>
            </div>
          </div>

          <div
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-2 ${getStatusColor(
              formik.values.status
            )}`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                formik.values.status === "published"
                  ? "bg-emerald-500"
                  : formik.values.status === "draft"
                  ? "bg-amber-500"
                  : "bg-rose-500"
              }`}
            ></span>
            {formik.values.status}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* --- Left Column: Settings Panel (Sticky) --- */}
          <div className="lg:col-span-4 lg:sticky lg:top-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
                <Settings className="text-blue-600" size={18} />
                <h2 className="font-bold text-gray-900">Configuration</h2>
              </div>

              <form onSubmit={formik.handleSubmit} className="p-6 space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="e.g. Midterm Exam"
                    className={`w-full px-4 py-2.5 rounded-lg border bg-gray-50 focus:bg-white outline-none transition-all duration-200 ${
                      formik.touched.title && formik.errors.title
                        ? "border-red-300 focus:ring-4 focus:ring-red-100"
                        : "border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                    }`}
                  />
                  {formik.touched.title && formik.errors.title && (
                    <div className="text-red-500 text-xs mt-1.5 flex items-center gap-1.5 font-medium">
                      <AlertCircle size={12} /> {formik.errors.title}
                    </div>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      name="status"
                      value={formik.values.status}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all appearance-none cursor-pointer"
                    >
                      <option value="draft">Draft (Hidden)</option>
                      <option value="published">Published (Visible)</option>
                      <option value="closed">Closed (Ended)</option>
                    </select>
                    <div className="absolute right-4 top-3.5 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Time Limit */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      Time (Min)
                    </label>
                    <div className="relative group">
                      <Clock
                        className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                        size={16}
                      />
                      <input
                        type="number"
                        name="timeLimit"
                        value={formik.values.timeLimit}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full pl-10 pr-3 py-2.5 rounded-lg border bg-gray-50 focus:bg-white outline-none transition-all duration-200 ${
                          formik.touched.timeLimit && formik.errors.timeLimit
                            ? "border-red-300"
                            : "border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Marks */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      Marks/Q
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      name="marksPerQuestion"
                      value={formik.values.marksPerQuestion}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-4 py-2.5 rounded-lg border bg-gray-50 focus:bg-white outline-none transition-all duration-200 ${
                        formik.touched.marksPerQuestion &&
                        formik.errors.marksPerQuestion
                          ? "border-red-300"
                          : "border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                      }`}
                    />
                  </div>
                </div>

                {/* Deadline */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Deadline
                  </label>
                  <div className="relative group">
                    <Calendar
                      className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                      size={16}
                    />
                    <input
                      type="datetime-local"
                      name="deadline"
                      value={formik.values.deadline}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full pl-10 pr-3 py-2.5 rounded-lg border bg-gray-50 focus:bg-white outline-none transition-all duration-200 ${
                        formik.touched.deadline && formik.errors.deadline
                          ? "border-red-300"
                          : "border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                      }`}
                    />
                  </div>
                  {formik.touched.deadline && formik.errors.deadline && (
                    <div className="text-red-500 text-xs mt-1.5 font-medium">
                      {formik.errors.deadline}
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={formik.isSubmitting}
                    className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] ${
                      formik.isSubmitting
                        ? "bg-blue-400 text-white cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
                    }`}
                  >
                    <Save size={18} />
                    <span className="font-semibold">
                      {formik.isSubmitting ? "Saving..." : "Save Changes"}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* --- Right Column: Questions List --- */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <LayoutList className="text-blue-600" size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Questions</h2>
              </div>
              <button
                onClick={() => navigate(`add-question`)}
                className="group bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-lg shadow-gray-200 active:scale-95"
              >
                <Plus
                  size={16}
                  className="group-hover:rotate-90 transition-transform duration-300"
                />
                Add Question
              </button>
            </div>

            <div className="space-y-4">
              {questions.length === 0 ? (
                <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Plus className="text-gray-300" size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    No questions yet
                  </h3>
                  <p className="text-gray-500 max-w-xs mx-auto">
                    Start building your quiz by adding your first question
                    above.
                  </p>
                </div>
              ) : (
                questions.map((q, index) => (
                  <div
                    key={q.id}
                    className="group relative bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-600 font-bold rounded-lg text-sm border border-blue-100">
                        {index + 1}
                      </div>
                      <div className="flex-grow pt-1">
                        <h3 className="text-lg font-semibold text-gray-900 leading-snug">
                          {q.questionText}
                        </h3>
                      </div>

                      {/* Actions - visible on hover/focus, or always on mobile */}
                      <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 bg-white sm:shadow-sm sm:border sm:border-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => navigate(`questions/${q.id}`)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <div className="w-px h-4 bg-gray-200"></div>
                        <button
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-12">
                      {q.options.map((opt, i) => {
                        const isCorrect = i === q.correctOptionIndex;
                        return (
                          <div
                            key={i}
                            className={`text-sm px-4 py-2.5 rounded-lg border flex items-center gap-3 transition-colors ${
                              isCorrect
                                ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-medium"
                                : "bg-gray-50 border-gray-100 text-gray-600"
                            }`}
                          >
                            {isCorrect ? (
                              <CheckCircle2
                                size={16}
                                className="text-emerald-500 flex-shrink-0"
                              />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"></div>
                            )}
                            <span className="truncate">{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
