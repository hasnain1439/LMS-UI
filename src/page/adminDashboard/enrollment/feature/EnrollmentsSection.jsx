"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { CiSearch } from "react-icons/ci";
import { FaPlus, FaRegEye, FaEdit, FaTrash, FaTimes, FaUserGraduate, FaBookOpen, FaCalendarAlt, FaChartLine, FaSave } from "react-icons/fa";
import { GetCourses } from "../../../../api/GetCourses"; 

// ✅ URLs
const API_URL = "http://localhost:5000/api/enrollments";

// ✅ HELPER: Sends Token + Cookies
const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    withCredentials: true 
  };
};

// Helper for status styling
const getStatusStyles = (status) => {
  switch (status?.toLowerCase()) {
    case "active": return "bg-green-100 text-green-700 font-bold";
    case "dropped": return "bg-red-100 text-red-700 font-bold";
    case "completed": return "bg-blue-100 text-blue-700 font-bold";
    default: return "bg-gray-100 text-gray-600 font-bold";
  }
};

export default function EnrollmentsSection() {
  // --- STATE ---
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showModal, setShowModal] = useState(false); // Add Student Modal
  const [viewModal, setViewModal] = useState(false); // View Modal
  const [editModal, setEditModal] = useState(false); // ✅ NEW: Edit Modal

  // Data States
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [studentEmail, setStudentEmail] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [coursesList, setCoursesList] = useState([]); 
  const [loadingCourses, setLoadingCourses] = useState(false);

  // ✅ NEW: Edit Form State
  const [editFormData, setEditFormData] = useState({
    id: "",
    status: "active",
    progress: 0
  });

  // --- 1. FETCH ENROLLMENTS ---
  useEffect(() => {
    fetchData();
  }, [searchText, filterStatus]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL, {
        ...getAuthConfig(),
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

  // --- 2. FETCH COURSES ---
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
      }, getAuthConfig());
      
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
        await axios.put(`${API_URL}/${id}`, { status: "dropped" }, getAuthConfig());
        fetchData();
      } catch (error) {
        const msg = error.response?.data?.message || "Failed to drop student";
        alert(msg);
      }
    }
  };

  // --- 5. VIEW HANDLER ---
  const handleView = (item) => {
    setSelectedEnrollment(item);
    setViewModal(true);
  };

  // --- 6. EDIT HANDLER (Open Modal) ---
  const handleEdit = (item) => {
    setEditFormData({
      id: item.id,
      status: item.status,
      progress: item.progress
    });
    setEditModal(true);
  };

  // --- 7. UPDATE HANDLER (Save Changes) ---
  const handleUpdateEnrollment = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/${editFormData.id}`, {
        status: editFormData.status,
        progress: Number(editFormData.progress)
      }, getAuthConfig());

      alert("Enrollment Updated Successfully!");
      setEditModal(false);
      fetchData(); // Refresh Table
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to update enrollment";
      alert(msg);
    }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* --- TOP BAR --- */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
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

      {/* --- TABLE --- */}
      <div className="overflow-x-auto w-full bg-white rounded-xl shadow-md">
        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading enrollments...</p>
        ) : (
          <table className="min-w-[900px] w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-white">
                <th className="py-5 px-6 text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">Student Name</th>
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
                  <td colSpan={7} className="text-center py-10 text-gray-500">No enrollments found.</td>
                </tr>
              ) : (
                enrollments.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-light transition duration-150 group">
                    <td className="py-4 px-6 text-sm font-semibold text-gray-text whitespace-nowrap">{item.studentName}</td>
                    <td className="py-4 px-6 text-sm text-gray-text">{item.studentEmail}</td>
                    <td className="py-4 px-6 text-sm font-medium text-blue-600 whitespace-nowrap">{item.courseName}</td>
                    <td className="py-4 px-6 text-sm text-gray-text">{new Date(item.enrolledAt).toLocaleDateString()}</td>
                    <td className="py-4 px-6 w-48">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${item.progress}%` }}></div>
                        </div>
                        <span className="text-xs font-medium text-gray-text">{item.progress}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs capitalize ${getStatusStyles(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center items-center gap-3">
                        <button onClick={() => handleView(item)} className="text-gray-text hover:text-blue-600 transition p-1" title="View Details">
                          <FaRegEye size={18} />
                        </button>
                        {/* ✅ EDIT BUTTON */}
                        <button onClick={() => handleEdit(item)} className="text-gray-text hover:text-green-600 transition p-1" title="Edit">
                          <FaEdit size={18} />
                        </button>
                        <button onClick={() => handleDropStudent(item.id)} className="text-gray-text hover:text-red-600 transition p-1" title="Drop Student">
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

      {/* --- ADD MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Enroll New Student</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 transition"><FaTimes size={20} /></button>
            </div>
            <form onSubmit={handleAddStudent} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Email</label>
                <input required type="email" className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none" 
                  value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} placeholder="student@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Course</label>
                <select required className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none"
                  value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)} disabled={loadingCourses}>
                  <option value="">{loadingCourses ? "Loading courses..." : "-- Choose a Course --"}</option>
                  {!loadingCourses && coursesList.map((course) => (
                      <option key={course.id} value={course.id}>{course.name || course.title}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md">Enroll Student</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- VIEW MODAL --- */}
      {viewModal && selectedEnrollment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
              <h3 className="text-white text-lg font-bold flex items-center gap-2"><FaUserGraduate /> Enrollment Details</h3>
              <button onClick={() => setViewModal(false)} className="text-white/80 hover:text-white transition"><FaTimes size={20} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-4 border-b pb-4">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
                  {selectedEnrollment.studentName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800">{selectedEnrollment.studentName}</h4>
                  <p className="text-gray-500 text-sm">{selectedEnrollment.studentEmail}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div><p className="text-xs font-bold text-gray-400 uppercase"><FaBookOpen className="inline mr-1" /> Course</p><p className="font-medium">{selectedEnrollment.courseName}</p></div>
                <div><p className="text-xs font-bold text-gray-400 uppercase"><FaCalendarAlt className="inline mr-1" /> Enrolled</p><p className="font-medium">{new Date(selectedEnrollment.enrolledAt).toLocaleDateString()}</p></div>
                <div><p className="text-xs font-bold text-gray-400 uppercase">Status</p><span className={`inline-block px-3 py-1 rounded-full text-xs font-bold capitalize ${getStatusStyles(selectedEnrollment.status)}`}>{selectedEnrollment.status}</span></div>
                <div><p className="text-xs font-bold text-gray-400 uppercase"><FaChartLine className="inline mr-1" /> Progress</p><p className="font-medium">{selectedEnrollment.progress}%</p></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ EDIT MODAL (New) */}
      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Update Enrollment</h2>
              <button onClick={() => setEditModal(false)} className="text-gray-400 hover:text-red-500 transition">
                <FaTimes size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateEnrollment} className="space-y-5">
              
              {/* Status Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none bg-white"
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                >
                  <option value="active">Active</option>
                  <option value="dropped">Dropped</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Progress Bar Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Progress ({editFormData.progress}%)
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  className="w-full cursor-pointer"
                  value={editFormData.progress} 
                  onChange={(e) => setEditFormData({...editFormData, progress: e.target.value})}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setEditModal(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md flex items-center gap-2">
                  <FaSave /> Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}