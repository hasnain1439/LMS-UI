import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Save, ArrowLeft, Plus, Trash2, AlertCircle, 
  HelpCircle, CheckCircle2 
} from "lucide-react";

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

  // 1. Fetch Data
  useEffect(() => {
    const fetchQuestionDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        // Security Check
        if (!token) {
            navigate("/login");
            return;
        }

        // Fetch Quiz Data to find the question
        const res = await axios.get(
          `http://localhost:5000/api/quizzes/${quizId}`,
          { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
        );

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
  }, [quizId, questionId, navigate]);

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
      // Adjust correct index if needed
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
      const token = localStorage.getItem("token");
      const payload = {
        questionText,
        options,
        correctOptionIndex
      };

      await axios.put(
        `http://localhost:5000/api/quizzes/${quizId}/questions/${questionId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
        <div className="text-gray-400 text-sm">Loading question...</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4 font-sans">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gray-50/50 px-8 py-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition shadow-sm text-gray-600"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Edit Question</h2>
              <p className="text-sm text-gray-500">Update question details</p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={20} />
            <span className="font-medium text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* Question Text */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <HelpCircle size={14} className="text-blue-500" /> Question Text
            </label>
            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="w-full bg-gray-50 border border-transparent rounded-xl p-4 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none resize-none min-h-[120px]"
              placeholder="Enter the question here..."
            />
          </div>

          {/* Options */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 size={14} className="text-green-500" /> Answer Options
              </label>
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">
                Select Correct Answer
              </span>
            </div>

            <div className="space-y-3">
              {options.map((option, index) => (
                <div 
                  key={index} 
                  className={`flex items-center gap-3 p-1 rounded-xl transition-all ${
                    correctOptionIndex === index 
                      ? 'bg-green-50/50 ring-1 ring-green-100' 
                      : ''
                  }`}
                >
                  <div className="relative flex items-center justify-center pl-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={correctOptionIndex === index}
                      onChange={() => setCorrectOptionIndex(index)}
                      className="w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500 cursor-pointer accent-green-600"
                      title="Mark as correct answer"
                    />
                  </div>

                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className={`flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-gray-700 placeholder-gray-400 ${
                      correctOptionIndex === index 
                        ? 'border-green-300 ring-2 ring-green-50' 
                        : ''
                    }`}
                    placeholder={`Option ${index + 1}`}
                  />

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
                className="mt-4 text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-blue-50 transition"
              >
                <Plus size={16} /> Add Option
              </button>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`px-8 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition disabled:opacity-70 flex items-center gap-2 ${
                saving ? "cursor-not-allowed" : ""
              }`}
            >
              {saving ? "Saving..." : <><Save size={18} /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}