import React from "react";
import { FaBookOpen, FaChalkboardTeacher, FaLayerGroup, FaCalendarAlt } from "react-icons/fa";

const CourseCard = ({ course, type = "catalog", onAction }) => {
  // --- 1. Data Normalization ---
  
  // Safe access to basic fields
  const courseName = course?.name || "Untitled Course";
  const description = course?.description || "";
  const categories = course?.categories || [];
  const totalSessions = course?.totalSessions || 0;
  
  // LOGIC: Handle Teacher Name 
  // 'getCourses' returns nested { teacher: { firstName... } }
  // 'getStudentCourses' returns flat { teacherFirstName... }
  let teacherName = "Unknown Instructor";
  
  if (course.teacher && course.teacher.firstName) {
    teacherName = `${course.teacher.firstName} ${course.teacher.lastName}`;
  } else if (course.teacherFirstName) {
    teacherName = `${course.teacherFirstName} ${course.teacherLastName}`;
  }

  // LOGIC: Handle Date (Only exists for student courses)
  const enrolledDate = course.enrolledAt 
    ? new Date(course.enrolledAt).toLocaleDateString() 
    : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col h-full group">
      
      {/* --- Top Section: Gradient Cover --- */}
      <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-400 relative p-4">
        {/* Category Tag */}
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/30">
          {categories[0] || "General"}
        </div>
        
        {/* Icon Box */}
        <div className="absolute -bottom-6 left-6 w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center text-blue-600 text-xl group-hover:scale-110 transition-transform duration-200">
          <FaBookOpen />
        </div>
      </div>

      {/* --- Content Section --- */}
      <div className="pt-8 pb-5 px-6 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1" title={courseName}>
          {courseName}
        </h3>
        
        {/* Teacher */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <FaChalkboardTeacher className="text-blue-500" />
          <span className="truncate">{teacherName}</span>
        </div>

        {/* Description (Truncated) */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1 min-h-[40px]">
          {description || "No description provided for this course."}
        </p>

        {/* Course Stats / Meta Info */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 mb-4 text-xs text-gray-500 font-medium">
          <div className="flex items-center gap-1.5">
            <FaLayerGroup className="text-gray-400" />
            <span>{totalSessions} Sessions</span>
          </div>
          
          {enrolledDate && (
            <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              <FaCalendarAlt />
              <span>Joined {enrolledDate}</span>
            </div>
          )}
        </div>

        {/* --- Action Button --- */}
        <div className="mt-auto">
            {type === "student" ? (
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onAction && onAction(course.id);
                }}
                className="w-full py-2.5 rounded-xl bg-blue-50 text-blue-600 font-semibold text-sm hover:bg-blue-100 transition-colors border border-blue-100 flex items-center justify-center gap-2"
            >
                Continue Learning
            </button>
            ) : (
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onAction && onAction(course.id);
                }}
                className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors shadow-blue-100 shadow-lg"
            >
                View Details
            </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;