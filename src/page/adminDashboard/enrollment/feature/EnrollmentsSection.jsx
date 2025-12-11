"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { CiSearch } from "react-icons/ci";
import { FaPlus, FaRegEye, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { GetCourses } from "../../../../api/GetCourses"; 

// ✅ URLs
const API_URL = "http://localhost:5000/api/enrollments";

// Helper to get token
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

// Helper for status styling (Matches Quiz Component)
const getStatusStyles = (status) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-700 font-bold";
    case "dropped":
      return "bg-red-100 text-red-700 font-bold";
    case "completed":
      return "bg-blue-100 text-blue-700 font-bold";
    default:
      return "bg-gray-100 text-gray-600 font-bold";
  }
};

export default function EnrollmentsSection() {
  // --- STATE ---
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [studentEmail, setStudentEmail] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [coursesList, setCoursesList] = useState([]); 
  const [loadingCourses, setLoadingCourses] = useState(false);

  // --- 1. FETCH ENROLLMENTS ---
  useEffect(() => {
    fetchData();
  }, [searchText, filterStatus]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL, {
        ...getAuthHeader(),
        params: { 
          page: 1, 
          limit: 10, 
          search: searchText, 
          status: filterStatus === "All" ? "" : filterStatus 
        },
      });
      setEnrollments(response.data.data || []);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. FETCH COURSES (For Modal Dropdown) ---
  useEffect(() => {
    if (showModal) {
      const fetchDataCourses = async () => {
        try {
          setLoadingCourses(true);
          const data = await GetCourses();
          setCoursesList(Array.isArray(data) ? data : (data.data || []));
        } catch (err) {
          console.error("Failed to load courses:", err);
        } finally {
          setLoadingCourses(false);
        }
      };
      fetchDataCourses();
    }
  }, [showModal]);

  // --- 3. CREATE ENROLLMENT ---
  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) return alert("Please select a course");

    try {
      await axios.post(API_URL, { 
        studentEmail: studentEmail, 
        courseId: selectedCourseId 
      }, getAuthHeader());
      
      alert("Student Enrolled Successfully!");
      setShowModal(false);
      setStudentEmail("");
      setSelectedCourseId("");
      fetchData(); 
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to enroll student.";
      alert(msg);
    }
  };

  // --- 4. DROP STUDENT ---
  const handleDropStudent = async (id) => {
    if (confirm("Are you sure you want to drop this student?")) {
      try {
        await axios.put(`${API_URL}/${id}`, { status: "dropped" }, getAuthHeader());
        fetchData();
      } catch (error) {
        alert("Failed to drop student");
      }
    }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* --- TOP BAR: Filters & Add Button --- */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-5">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
            <input
              type="search"
              placeholder="Search Student..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 bg-white rounded-lg outline-none text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-sm"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          {/* Status Dropdown */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 w-full sm:w-40 border border-gray-300 bg-white rounded-lg outline-none text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-sm cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="active">Active</option>
            <option value="dropped">Dropped</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Add Button */}
        <div className="w-full sm:w-auto">
          <button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 shadow-md transition font-medium"
          >
            <FaPlus size={14} /> 
            <span>Enroll Student</span>
          </button>
        </div>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="overflow-x-auto w-full bg-white rounded-xl shadow-md">
        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading enrollments...</p>
        ) : (
          <table className="min-w-[900px] w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-white">
                <th className="py-5 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider">Student Name</th>
                <th className="py-5 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider">Email</th>
                <th className="py-5 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider">Course</th>
                <th className="py-5 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider">Date</th>
                <th className="py-5 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider">Progress</th>
                <th className="py-5 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider">Status</th>
                <th className="py-5 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {enrollments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-500">
                    No enrollments found.
                  </td>
                </tr>
              ) : (
                enrollments.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition duration-150 group">
                    
                    {/* Name */}
                    <td className="py-4 px-6 text-sm font-semibold text-gray-800">
                      {item.studentName}
                    </td>

                    {/* Email */}
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {item.studentEmail}
                    </td>

                    {/* Course */}
                    <td className="py-4 px-6 text-sm font-medium text-blue-600">
                      {item.courseName}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {new Date(item.enrolledAt).toLocaleDateString()}
                    </td>

                    {/* Progress Bar */}
                    <td className="py-4 px-6 w-48">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${item.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-700">{item.progress}%</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs capitalize ${getStatusStyles(item.status)}`}>
                        {item.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center items-center gap-3">
                        <button className="text-gray-500 hover:text-blue-600 transition p-1" title="View Details">
                          <FaRegEye size={18} />
                        </button>
                        <button className="text-gray-500 hover:text-green-600 transition p-1" title="Edit">
                          <FaEdit size={18} />
                        </button>
                        <button 
                          className="text-gray-500 hover:text-red-600 transition p-1" 
                          title="Drop Student"
                          onClick={() => handleDropStudent(item.id)}
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* --- ADD STUDENT MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md transform transition-all scale-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Enroll New Student</h2>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-gray-400 hover:text-red-500 transition"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddStudent} className="space-y-5">
              {/* Input: Student Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Email</label>
                <input 
                  required
                  type="email" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="student@example.com"
                />
              </div>
              
              {/* Input: Course Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Course</label>
                <select 
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition"
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  disabled={loadingCourses}
                >
                  <option value="">
                    {loadingCourses ? "Loading courses..." : "-- Choose a Course --"}
                  </option>
                  
                  {!loadingCourses && coursesList.length > 0 ? (
                    coursesList.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name || course.title} 
                      </option>
                    ))
                  ) : (
                    !loadingCourses && <option disabled>No courses found</option>
                  )}
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
                >
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}