"use client";

import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaPlus, FaRegEye, FaEdit, FaTrash } from "react-icons/fa";

export default function EnrollmentsSection() {
  // --- STATE ---
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // --- MOCK DATA (Static - No API) ---
  const [enrollments, setEnrollments] = useState([
    {
      id: "1",
      studentName: "Sarah Johnson",
      studentEmail: "sarah.j@email.com",
      courseName: "Web Development Basics",
      enrolledAt: "2025-09-15",
      progress: 75,
      status: "active",
    },
    {
      id: "2",
      studentName: "Mike Chen",
      studentEmail: "mike.chen@email.com",
      courseName: "JavaScript Fundamentals",
      enrolledAt: "2025-09-20",
      progress: 45,
      status: "dropped",
    },
    {
      id: "3",
      studentName: "Emily Davis",
      studentEmail: "emily.d@email.com",
      courseName: "UI/UX Design Masterclass",
      enrolledAt: "2025-10-01",
      progress: 100,
      status: "completed",
    },
  ]);

  // --- HANDLERS (Just Alerts for now) ---
  const handleDropStudent = (id) => {
    if (confirm("Are you sure you want to drop this student?")) {
      // Logic to remove from list locally for UI demo
      setEnrollments(enrollments.filter((student) => student.id !== id));
      alert("Student dropped (UI Demo)");
    }
  };

  // Helper for Status Colors
  const getStatusStyles = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "dropped":
        return "bg-red-100 text-red-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* --- TOP HEADER (Search & Filter) --- */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-5">
        
        {/* Search Box */}
        <div className="w-full sm:w-1/3 flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition bg-white">
          <CiSearch className="text-gray-500 text-lg" />
          <input
            type="search"
            placeholder="Search Student..."
            className="py-1 px-2 outline-none border-none bg-transparent w-full text-gray-700 placeholder-gray-400"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {/* Filters & Actions */}
        <div className="flex items-center flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 w-full sm:w-48 border border-gray-300 bg-white rounded-xl outline-none text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="active">Active</option>
            <option value="dropped">Dropped</option>
            <option value="completed">Completed</option>
          </select>

          <button
            onClick={() => alert("Open Add Student Modal")}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <FaPlus />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="overflow-x-auto w-full bg-white rounded-xl shadow-md">
        <table className="min-w-[900px] w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="py-5 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">Student Name</th>
              <th className="py-5 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
              <th className="py-5 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider">Course</th>
              <th className="py-5 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
              <th className="py-5 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider">Progress</th>
              <th className="py-5 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="py-5 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-100">
            {enrollments.length === 0 ? (
              <tr><td colSpan="7" className="text-center py-10 text-gray-500">No enrollments found.</td></tr>
            ) : (
              enrollments.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition duration-150">
                  {/* Name */}
                  <td className="py-4 px-6 text-sm font-semibold text-gray-800 whitespace-nowrap">
                    {item.studentName}
                  </td>

                  {/* Email */}
                  <td className="py-4 px-6 text-sm text-gray-600 whitespace-nowrap">
                    {item.studentEmail}
                  </td>

                  {/* Course */}
                  <td className="py-4 px-6 text-sm font-medium text-blue-600 whitespace-nowrap">
                    {item.courseName}
                  </td>

                  {/* Date */}
                  <td className="py-4 px-6 text-sm text-gray-600 whitespace-nowrap">
                    {item.enrolledAt}
                  </td>

                  {/* Progress Bar */}
                  <td className="py-4 px-6 text-sm text-gray-600 w-48">
                    <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${item.progress}%` }}
                            ></div>
                        </div>
                        <span className="text-xs">{item.progress}%</span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs capitalize ${getStatusStyles(item.status)}`}>
                      {item.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-center">
                    <div className="flex justify-center items-center gap-3">
                      <button className="text-gray-400 hover:text-blue-600 transition" title="View Details">
                        <FaRegEye size={16} />
                      </button>
                      <button className="text-gray-400 hover:text-green-600 transition" title="Edit">
                        <FaEdit size={16} />
                      </button>
                      <button 
                        className="text-gray-400 hover:text-red-600 transition" 
                        title="Drop Student"
                        onClick={() => handleDropStudent(item.id)}
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}