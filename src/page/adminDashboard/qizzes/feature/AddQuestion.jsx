import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Save, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle, 
  HelpCircle 
} from "lucide-react";

export default function AddQuestion() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  
  // Initial State: Empty question, 4 empty options, 1st option correct
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(0);

  // --- Handlers ---

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
      
      // Adjust correct index if the removed option affects it
      if (correctOptionIndex === index) {
        setCorrectOptionIndex(0); // Reset to first if correct one is deleted
      } else if (correctOptionIndex > index) {
        setCorrectOptionIndex(correctOptionIndex - 1);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    // Frontend Validation
    if (!questionText.trim()) {
      setError("Question text cannot be empty.");
      setSaving(false);
      return;
    }
    if (options.some(opt => !opt.trim())) {
      setError("All answer options must be filled.");
      setSaving(false);
      return;
    }

    try {
      const payload = {
        questionText,
        options,
        correctOptionIndex
      };

      // POST request to add question
      await axios.post(
        `http://localhost:5000/api/quizzes/${quizId}/add-question`,
        payload,
        { withCredentials: true }
      );

      // On success, go back to Edit Quiz page
      navigate(-1); 
    } catch (err) {
      console.error("Add question error:", err);
      if (err.response?.status === 400) {
        // Handle specific backend validation (e.g., max questions reached, existing submissions)
        setError(err.response.data.error);
      } else {
        setError("Failed to add question. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className=" p-6 bg-white rounded-xl shadow-md border border-gray-100 font-sans">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-gray-100 rounded-full transition text-gray-600"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add New Question</h2>
            <p className="text-sm text-gray-500">Create a multiple choice question</p>
          </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-2 rounded-r animate-fadeIn">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Question Text Section */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wider">
            <HelpCircle size={16} className="text-blue-600"/> Question Text
          </label>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition min-h-[120px] text-lg placeholder-gray-400"
            placeholder="e.g. What is the output of console.log(typeof null)?"
            autoFocus
          />
        </div>

        {/* Options Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wider">
               <CheckCircle size={16} className="text-emerald-600"/> Answer Options
            </label>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Select the correct answer
            </span>
          </div>

          <div className="space-y-3">
            {options.map((option, index) => (
              <div 
                key={index} 
                className={`flex items-center gap-3 p-2 rounded-xl transition-all border ${
                  correctOptionIndex === index 
                  ? 'bg-emerald-50/50 border-emerald-200 shadow-sm' 
                  : 'border-transparent hover:bg-gray-50'
                }`}
              >
                {/* Radio Button for Correct Answer */}
                <div className="relative flex items-center justify-center w-8 h-8">
                  <input
                    type="radio"
                    name="correctOption"
                    checked={correctOptionIndex === index}
                    onChange={() => setCorrectOptionIndex(index)}
                    className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-emerald-500 checked:bg-emerald-500 cursor-pointer transition-all"
                    title="Mark as correct answer"
                  />
                  <div className="absolute w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"></div>
                </div>

                {/* Option Input */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 transition ${
                      correctOptionIndex === index 
                        ? "border-emerald-400 bg-white focus:ring-emerald-200 text-gray-900" 
                        : "border-gray-300 focus:ring-blue-100 focus:border-blue-500 text-gray-700"
                    }`}
                    placeholder={`Option ${index + 1}`}
                  />
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  disabled={options.length <= 2}
                  className={`p-2.5 rounded-lg transition ${
                    options.length <= 2 
                      ? "text-gray-200 cursor-not-allowed" 
                      : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                  }`}
                  title="Remove option"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Add Option Button */}
          {options.length < 6 && (
            <button
              type="button"
              onClick={addOption}
              className="mt-2 text-sm font-bold flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition border border-transparent hover:border-blue-100"
            >
              <Plus size={16} /> Add Another Option
            </button>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={saving}
            className={`flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition transform active:scale-95 ${
              saving ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {saving ? (
              <>Saving...</>
            ) : (
              <>
                <Save size={18} /> Create Question
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}