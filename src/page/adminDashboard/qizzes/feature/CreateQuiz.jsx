import React, { useState, useEffect } from "react";
import { Plus, Trash2, XCircle } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

// Helper function to create a fresh empty question object
const createEmptyQuestion = () => ({
  questionText: "",
  options: ["", "", "", ""],
  correctOptionIndex: 0,
});

const QuizSchema = Yup.object().shape({
  courseId: Yup.string().required("Selecting a course is required."),
  timeLimitMinutes: Yup.number()
    .required("Time limit is required.")
    .min(1, "Must be at least 1 minute."),
  marksPerQuestion: Yup.number()
    .required("Marks per question is required.")
    .min(0.5, "Must be at least 0.5 marks."),
  deadline: Yup.string().required("A deadline is required."),
  questions: Yup.array()
    .of(
      Yup.object().shape({
        questionText: Yup.string().required("Question text is required."),
        options: Yup.array()
          .of(Yup.string().required("Option cannot be empty."))
          .min(4, "Must have at least four options."),
        correctOptionIndex: Yup.number().min(0).max(3).required(),
      })
    )
    .min(1, "You must create at least one question."),
});

export default function CreateQuiz() {
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/courses/getAllCourses",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setCourses(res.data.courses || []);
      } catch (err) {
        console.error("Failed to fetch courses", err);
        setStatus("Failed to load courses.");
      }
    };
    fetchCourses();
  }, []);

  const formik = useFormik({
    initialValues: {
      courseId: "",
      timeLimitMinutes: "",
      marksPerQuestion: "",
      deadline: "",
      questions: [createEmptyQuestion()], // Initialize directly in Formik
    },
    validationSchema: QuizSchema,
    // Removed enableReinitialize to prevent form state resets on keystrokes
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      setStatus("");
      try {
        const token = localStorage.getItem("token");
        const payload = {
          ...values,
          timeLimitMinutes: Number(values.timeLimitMinutes),
          marksPerQuestion: Number(values.marksPerQuestion),
          deadline: new Date(values.deadline).toISOString(),
        };
        await axios.post(
          "http://localhost:5000/api/quizzes/create-quiz",
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        alert("Quiz created successfully!");
        resetForm();
      } catch (err) {
        console.error(err);
        setStatus(err.response?.data?.error || "Failed to create quiz");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleAddQuestion = () => {
    const newQuestions = [...formik.values.questions, createEmptyQuestion()];
    formik.setFieldValue("questions", newQuestions);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = formik.values.questions.filter((_, i) => i !== index);
    formik.setFieldValue("questions", newQuestions);
  };

  const handleQuestionChange = (qIndex, field, value) => {
    // Create shallow copies to avoid mutation
    const newQuestions = formik.values.questions.map((q, i) => {
      if (i === qIndex) {
        if (field === "questionText") {
          return { ...q, questionText: value };
        } else {
          const newOptions = [...q.options];
          newOptions[field] = value;
          return { ...q, options: newOptions };
        }
      }
      return q;
    });
    
    formik.setFieldValue("questions", newQuestions);
  };

  const handleCorrectOptionChange = (qIndex, value) => {
    const newQuestions = formik.values.questions.map((q, i) => 
      i === qIndex ? { ...q, correctOptionIndex: Number(value) } : q
    );
    formik.setFieldValue("questions", newQuestions);
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="max-w-5xl mx-auto p-6 md:p-10 bg-white rounded-2xl shadow-xl space-y-8"
    >
      <h2 className="text-3xl font-bold text-gray-800 border-b pb-3">
        📝 Create New Quiz
      </h2>

      {/* Quiz Basic Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col">
          <label className="font-medium mb-1">Select Course</label>
          <select
            name="courseId"
            value={formik.values.courseId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300 ${
              formik.touched.courseId && formik.errors.courseId
                ? "border-red-400"
                : "border-gray-300"
            }`}
          >
            <option value="" disabled>
              {courses.length ? "Select course..." : "Loading courses..."}
            </option>
            {courses.map((c) => (
              <option key={c.id || c._id} value={c.id || c._id}>
                {c.name}
              </option>
            ))}
          </select>
          {formik.touched.courseId && formik.errors.courseId && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <XCircle size={14} /> {formik.errors.courseId}
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="font-medium mb-1">Time Limit (minutes)</label>
          <input
            type="number"
            name="timeLimitMinutes"
            value={formik.values.timeLimitMinutes}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300 ${
              formik.touched.timeLimitMinutes && formik.errors.timeLimitMinutes
                ? "border-red-400"
                : "border-gray-300"
            }`}
            placeholder="60"
          />
          {formik.touched.timeLimitMinutes && formik.errors.timeLimitMinutes && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <XCircle size={14} /> {formik.errors.timeLimitMinutes}
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="font-medium mb-1">Marks per Question</label>
          <input
            type="number"
            step="0.1"
            name="marksPerQuestion"
            value={formik.values.marksPerQuestion}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300 ${
              formik.touched.marksPerQuestion && formik.errors.marksPerQuestion
                ? "border-red-400"
                : "border-gray-300"
            }`}
            placeholder="1.0"
          />
          {formik.touched.marksPerQuestion && formik.errors.marksPerQuestion && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <XCircle size={14} /> {formik.errors.marksPerQuestion}
            </p>
          )}
        </div>

        <div className="flex flex-col md:col-span-3">
          <label className="font-medium mb-1">Deadline</label>
          <input
            type="datetime-local"
            name="deadline"
            value={formik.values.deadline}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300 ${
              formik.touched.deadline && formik.errors.deadline
                ? "border-red-400"
                : "border-gray-300"
            }`}
          />
          {formik.touched.deadline && formik.errors.deadline && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <XCircle size={14} /> {formik.errors.deadline}
            </p>
          )}
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-700">
          Quiz Questions ({formik.values.questions.length})
        </h3>
        {formik.values.questions.map((q, i) => (
          <div
            key={i}
            className="p-4 border rounded-xl bg-gray-50 relative space-y-3"
          >
            {formik.values.questions.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveQuestion(i)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            )}

            <input
              type="text"
              placeholder="Enter question text..."
              value={q.questionText}
              onChange={(e) =>
                handleQuestionChange(i, "questionText", e.target.value)
              }
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-blue-300"
            />
            {formik.errors.questions?.[i]?.questionText && (
              <p className="text-red-500 text-sm">
                {formik.errors.questions[i].questionText}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {q.options.map((opt, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={opt}
                  placeholder={`Option ${idx + 1}`}
                  onChange={(e) => handleQuestionChange(i, idx, e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-blue-300"
                />
              ))}
            </div>

            <select
              value={q.correctOptionIndex}
              onChange={(e) => handleCorrectOptionChange(i, e.target.value)}
              className="border rounded-lg px-3 py-2 w-full sm:w-1/2 outline-none focus:ring-1 focus:ring-green-300"
            >
              {q.options.map((_, idx) => (
                <option key={idx} value={idx}>
                  Correct Option: {idx + 1}
                </option>
              ))}
            </select>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddQuestion}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-2 shadow-md transition"
        >
          <Plus size={18} /> Add Question
        </button>
      </div>

      <button
        type="submit"
        disabled={formik.isSubmitting}
        className={`w-full py-3 rounded-lg text-lg font-semibold shadow-md transition ${
          formik.isSubmitting 
            ? "bg-gray-400 cursor-not-allowed" 
            : "bg-green-600 hover:bg-green-700 text-white"
        }`}
      >
        {formik.isSubmitting ? "Creating Quiz..." : "Create Quiz"}
      </button>

      {status && <p className="text-red-500 text-center mt-2">{status}</p>}
    </form>
  );
}