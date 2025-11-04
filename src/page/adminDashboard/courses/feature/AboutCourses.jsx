import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { LuUsers } from "react-icons/lu";
import { MdOutlineDeleteOutline, MdOutlineRemoveRedEye } from "react-icons/md";
import { CoursesData as CurrentCourses } from "../../../../data/data";
import ViewCoursesData from "./ViewCoursesData";
import EditCourses from "./EditCourses";
import AddCourses from "./AddCourses";

export default function AboutCourses() {
  const [courses, setCourses] = useState(CurrentCourses);
  const [viewCourseDetail, setViewCourseDetail] = useState(null);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [editCourse, setEditCourse] = useState(null);
  const [addCourses, setAddCourses] = useState(false);

  // View Details
  const courseDetailHandler = (courseData) => setViewCourseDetail(courseData);

  // Delete
  const deleteHandler = (index) => {
    setDeleteIndex(index);
    setDeletePopup(true);
  };

  const confirmationHandler = () => {
    if (deleteIndex !== null) {
      const updatedCourses = courses.filter((_, idx) => idx !== deleteIndex);
      setCourses(updatedCourses);
    }
    setDeletePopup(false);
    setDeleteIndex(null);
  };

  // Edit
  const editHandler = (course, index) => setEditCourse({ ...course, index });

  const handleSaveEdit = (updatedData, index) => {
    const updatedCourses = courses.map((c, idx) =>
      idx === index ? updatedData : c
    );
    setCourses(updatedCourses);
    setEditCourse(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-5">
        <div className="w-full sm:w-1/3 flex items-center gap-2 rounded-md px-2 focus-within:border-gray-500 focus-within:ring-2 focus-within:ring-gray transition">
          <CiSearch className="text-gray" />
          <input
            type="search"
            placeholder="Search Course..."
            className="py-2 px-3 outline-none border-none bg-transparent w-full text-gray-dark"
          />
        </div>

        <div className="flex items-center flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <select className="px-3 py-2 w-full sm:w-48 border border-gray-light bg-white rounded-md outline-none text-gray-dark focus:border-primary focus:ring-1 focus:ring-primary">
            <option value="All">All Categories</option>
            <option value="Programming">Programming</option>
            <option value="Design">Design</option>
            <option value="Database">Database</option>
          </select>

          <button
            onClick={() => setAddCourses(true)}
            className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 shadow-card transition"
          >
            <FaPlus /> Add Course
          </button>
        </div>
      </div>

      {/* Course Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {courses.map((course, idx) => (
          <div
            key={idx}
            className="p-5 bg-white rounded-xl shadow-card hover:shadow-md transition-shadow"
          >
            {/* Title + Status */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-gray-dark">
                  {course.title}
                </h2>
                <span className="text-sm text-gray">{course.category}</span>
              </div>

              {course.status && (
                <span
                  className={`px-2 py-1 rounded-lg capitalize text-sm font-medium border
                    ${
                      course.status === "active"
                        ? "bg-success/10 text-success border-success/30"
                        : course.status === "completed"
                        ? "bg-primary/10 text-primary border-primary/30"
                        : course.status === "draft"
                        ? "bg-warning/10 text-warning border-warning/30"
                        : "bg-error/10 text-error border-error/30"
                    }`}
                >
                  {course.status}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex justify-between items-center mt-6">
              <div className="flex items-center gap-2 text-gray-dark">
                <LuUsers className="text-gray text-lg" />
                <span>{course.students}</span>
              </div>
              <span className="text-gray">{course.duration}</span>
            </div>

            {/* Progress */}
            <div className="flex justify-between items-center mt-4 text-gray-dark">
              <span className="font-semibold">Progress</span>
              <span>{course.progress}%</span>
            </div>
            <div className="w-full bg-gray-light rounded-full h-3 mt-1">
              <div
                className="bg-primary h-3 rounded-full transition-all"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>

            {/* Buttons */}
            <div className="grid sm:grid-cols-[43%_43%_auto] gap-2 mt-4">
              <button
                onClick={() => courseDetailHandler(course)}
                className="flex items-center justify-center gap-2 border border-gray-light px-4 py-2 rounded-lg text-gray-dark hover:bg-gray-light transition"
              >
                <MdOutlineRemoveRedEye /> View
              </button>
              <button
                onClick={() => editHandler(course, idx)}
                className="flex items-center justify-center gap-2 border border-primary px-4 py-2 rounded-lg text-primary hover:bg-primary/10 transition"
              >
                <FiEdit /> Edit
              </button>
              <button
                onClick={() => deleteHandler(idx)}
                className="flex items-center justify-center gap-2 border border-error text-error px-3 py-2 rounded-lg hover:bg-error/10 transition"
              >
                <MdOutlineDeleteOutline className="text-lg" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Popup */}
      {deletePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-card max-w-[420px] w-full">
            <h2 className="text-lg font-semibold text-gray-dark mb-3">
              Confirm Deletion
            </h2>
            <p className="text-gray mb-6">
              Are you sure you want to delete this course? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeletePopup(false)}
                className="px-4 py-2 bg-gray-light hover:bg-gray text-gray-dark rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmationHandler}
                className="px-4 py-2 bg-error hover:bg-red-700 text-white rounded-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Popup */}
      {editCourse && (
        <EditCourses
          course={editCourse}
          onClose={() => setEditCourse(null)}
          onSave={handleSaveEdit}
        />
      )}

      {/* View Details */}
      {viewCourseDetail && (
        <ViewCoursesData
          viewData={viewCourseDetail}
          closePopup={() => setViewCourseDetail(null)}
        />
      )}

      {/* Add Courses */}
      {addCourses && (
        <AddCourses
          onClose={setAddCourses}
          currentCourses={courses}
          setNewCourse={setCourses}
        />
      )}
    </div>
  );
}
