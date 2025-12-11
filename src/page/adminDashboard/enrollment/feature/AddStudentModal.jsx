import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

// ✅ Now accepts 'onSubmitAPI' prop instead of importing service
export default function AddStudentModal({ isOpen, onClose, onSubmitAPI }) {
  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Call the function passed from the Parent
      await onSubmitAPI(studentId, courseId);
      
      setStudentId("");
      setCourseId("");
      onClose();
      alert("Student enrolled successfully!");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 409) {
        setError("Student is already enrolled in this course.");
      } else {
        setError("Failed to enroll. Check IDs.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800">Enroll New Student</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student ID (UUID)</label>
            <input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="e.g. 550e8400..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course ID (UUID)</label>
            <input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={courseId} onChange={(e) => setCourseId(e.target.value)} placeholder="e.g. 123e4567..." />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="w-1/3 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
            <button type="submit" disabled={loading} className="w-2/3 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {loading ? "Enrolling..." : "Enroll Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}