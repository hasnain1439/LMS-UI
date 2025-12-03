import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Save, ArrowLeft, Plus, Trash2, AlertCircle, CheckCircle } from "lucide-react";

export default function EditQuestion() {
  const { quizId, questionId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  
  // Form State
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(0);

  // 1. Fetch Data (UPDATED LOGIC)
  useEffect(() => {
    const fetchQuestionDetails = async () => {
      try {
        setLoading(true);
        
        // 🟢 FIX: Fetch the Quiz, NOT the specific question endpoint
        const res = await axios.get(
          `http://localhost:5000/api/quizzes/${quizId}`,
          { withCredentials: true }
        );

        // 🟢 FIX: Find the specific question inside the quiz data
        const quizQuestions = res.data.quiz.questions || [];
        const foundQuestion = quizQuestions.find(q => q.id === questionId);

        if (foundQuestion) {
            setQuestionText(foundQuestion.questionText);
            setOptions(foundQuestion.options);
            setCorrectOptionIndex(foundQuestion.correctOptionIndex);
        } else {
            setError("Question not found in this quiz.");
        }

      } catch (err) {
        console.error("Error fetching question:", err);
        setError("Failed to load question details.");
      } finally {
        setLoading(false);
      }
    };

    if (quizId && questionId) {
      fetchQuestionDetails();
    }
  }, [quizId, questionId]);

  // 2. Handle Form Changes
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
      if (correctOptionIndex === index) setCorrectOptionIndex(0);
      else if (correctOptionIndex > index) setCorrectOptionIndex(correctOptionIndex - 1);
    }
  };

  // 3. Submit Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    if (!questionText.trim()) {
      setError("Question text cannot be empty.");
      setSaving(false);
      return;
    }
    if (options.some(opt => !opt.trim())) {
      setError("All options must be filled.");
      setSaving(false);
      return;
    }

    try {
      const payload = {
        questionText,
        options,
        correctOptionIndex
      };

      // The UPDATE endpoint exists, so this is fine
      await axios.put(
        `http://localhost:5000/api/quizzes/${quizId}/questions/${questionId}`,
        payload,
        { withCredentials: true }
      );

      alert("Question updated successfully!");
      navigate(-1);
    } catch (err) {
      console.error("Update error:", err);
      if (err.response?.status === 400) {
        setError(err.response.data.error || "Cannot modify question with existing submissions.");
      } else {
        setError("Failed to update question. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading question...</div>;

  return (
    <div className="p-6 bg-white rounded-xl shadow-md font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ArrowLeft className="text-gray-600" size={20} />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Edit Question</h2>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-2 rounded-r">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Question Text */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Question Text
          </label>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition min-h-[100px]"
            placeholder="Enter the question here..."
          />
        </div>

        {/* Options */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-semibold text-gray-700">
              Answer Options
            </label>
            <span className="text-xs text-gray-500">Select the radio button for the correct answer</span>
          </div>

          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-3 group">
                <input
                  type="radio"
                  name="correctOption"
                  checked={correctOptionIndex === index}
                  onChange={() => setCorrectOptionIndex(index)}
                  className="w-5 h-5 text-blue-600 cursor-pointer focus:ring-blue-500"
                />
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className={`w-full p-3 border rounded-lg outline-none focus:ring-2 transition ${
                      correctOptionIndex === index 
                        ? "border-green-400 bg-green-50 focus:ring-green-400" 
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    placeholder={`Option ${index + 1}`}
                  />
                  {correctOptionIndex === index && (
                    <CheckCircle className="absolute right-3 top-3 text-green-600" size={18} />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  disabled={options.length <= 2}
                  className={`p-2 rounded-lg transition ${
                    options.length <= 2 
                      ? "text-gray-300 cursor-not-allowed" 
                      : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                  }`}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {options.length < 6 && (
            <button
              type="button"
              onClick={addOption}
              className="mt-3 text-sm flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium px-2 py-1 rounded hover:bg-blue-50 transition"
            >
              <Plus size={16} /> Add Another Option
            </button>
          )}
        </div>

        {/* Submit Actions */}
        <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={saving}
            className={`flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium shadow-md transition ${
              saving ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700 hover:shadow-lg"
            }`}
          >
            {saving ? "Saving..." : <><Save size={18} /> Save Changes</>}
          </button>
        </div>
      </form>
    </div>
  );
}