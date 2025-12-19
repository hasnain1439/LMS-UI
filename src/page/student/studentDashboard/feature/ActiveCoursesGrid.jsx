import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// 👇 Ensure this path is correct for your project
import CourseCard from "./CourseCard"; 
import { FaBookReader, FaSync, FaExclamationCircle } from "react-icons/fa";

const ActiveCoursesGrid = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchStudentCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Get Token
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("auth"); // No token found
        setLoading(false);
        return;
      }

      // 2. API Call
      // Ensure this URL matches your server's route exactly
      const response = await axios.get(
        "http://localhost:5000/api/courses/student/my-courses", 
        {
          headers: { 
            Authorization: `Bearer ${token}` // Send token in header
          },
        }
      );

      // 3. Set Data
      if (response.data && response.data.courses) {
        setCourses(response.data.courses);
      } else {
        setCourses([]);
      }

    } catch (err) {
      console.error("Fetch Error:", err);
      
      // Handle Specific Errors
      if (err.response) {
        if (err.response.status === 401) {
            setError("auth"); // Token invalid/expired
        } else if (err.response.status === 404) {
            setError("404"); // Route not found
        } else {
            setError("server"); // Other server error
        }
      } else {
        setError("network"); // Server down/No internet
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentCourses();
  }, []);

  const handleContinue = (courseId) => {
    navigate(`/student/my-course/${courseId}`);
  };

  // --- RENDER STATES ---

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10 text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
        Loading courses...
      </div>
    );
  }

  // Auth Error (401)
  if (error === "auth") {
    return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <FaExclamationCircle className="text-3xl text-red-500 mx-auto mb-3" />
            <h3 className="text-red-800 font-bold">Session Expired</h3>
            <p className="text-gray-600 mb-4 text-sm">Please log in again to continue.</p>
            <button 
                onClick={() => navigate('/login')}
                className="bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-red-700"
            >
                Log In
            </button>
        </div>
    );
  }

  // Network/Server Error
  if (error === "network" || error === "server" || error === "404") {
    return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
            <h3 className="text-yellow-800 font-bold mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-4 text-sm">
                {error === "404" ? "Server route not found." : "Could not connect to the server."}
            </p>
            <button 
                onClick={fetchStudentCourses}
                className="flex items-center justify-center gap-2 mx-auto bg-yellow-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-700"
            >
                <FaSync /> Retry
            </button>
        </div>
    );
  }

  // Empty State
  if (courses.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl border border-dashed border-gray-300 text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <FaBookReader className="text-gray-400 text-xl" />
        </div>
        <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
        <button
          onClick={() => navigate("/student/courses")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm text-sm font-medium"
        >
          Browse Catalog
        </button>
      </div>
    );
  }

  // Success State (Grid)
  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">My Active Courses</h2>
        <button
          onClick={() => navigate("/student/my-courses")}
          className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
        >
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            type="student"
            onAction={handleContinue}
          />
        ))}
      </div>
    </section>
  );
};

export default ActiveCoursesGrid;