import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { LuUsers } from "react-icons/lu";
import { MdOutlineDeleteOutline, MdOutlineRemoveRedEye } from "react-icons/md";
import { Link } from "react-router-dom";
import axios from "axios";

import UpdateCourses from "./UpdateCourses.jsx";
import AddCourses from "./AddCourses";
import { GetCourses } from "../../../../api/GetCourses";

export default function AboutCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filterCategory, setFilterCategory] = useState("All");
  const [searchText, setSearchText] = useState("");

  const [editCourse, setEditCourse] = useState(null);
  const [addCourses, setAddCourses] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deletePopup, setDeletePopup] = useState(false);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const filters = {
          category: filterCategory === "All" ? undefined : filterCategory,
          search: searchText || undefined,
        };
        const data = await GetCourses(filters);
        setCourses(data || []);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [filterCategory, searchText]);

  // Edit course
  const editHandler = (course) => setEditCourse({ ...course });

  const handleSaveEdit = async (updatedCourse) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `http://localhost:5000/api/courses/${updatedCourse.id}`,
        updatedCourse,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      setCourses((prev) =>
        prev.map((c) => (c.id === updatedCourse.id ? response.data.course : c))
      );
      setEditCourse(null);
    } catch (err) {
      console.error("Update course failed:", err.response?.data || err);
      alert(err.response?.data?.error || "Failed to update course.");
    }
  };

  // Delete course
  const deleteHandler = (index) => {
    setDeleteIndex(index);
    setDeletePopup(true);
  };
  // delete course
  const confirmationHandler = async () => {
    if (deleteIndex === null) return;
    const token = localStorage.getItem("token");
    const courseId = courses[deleteIndex].id;
    try {
      await axios.delete(`http://localhost:5000/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setCourses((prev) => prev.filter((_, idx) => idx !== deleteIndex));
    } catch (err) {
      console.error("Delete course failed:", err.response?.data || err);
      alert(err.response?.data?.error || "Failed to delete course.");
    } finally {
      setDeletePopup(false);
      setDeleteIndex(null);
    }
  };

  // Add course
  const handleAddCourse = (newCourse) => {
    setCourses((prev) => [newCourse, ...prev]);
    setAddCourses(false);
  };

  return (
    <div className="space-y-6">
      {/* Search + Add */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-5">
        {/* Search Box */}
        <div className="w-full sm:w-1/3 flex items-center gap-2 rounded-xl border border-gray px-3 py-2 focus-within:ring-2 focus-within:ring-primary transition bg-white">
          <CiSearch className="text-gray text-lg" />
          <input
            type="search"
            placeholder="Search Course..."
            className="py-1 px-2 outline-none border-none bg-transparent w-full text-gray-dark"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {/* Filter & Add Button */}
        <div className="flex items-center flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 w-full sm:w-48 border border-gray bg-white rounded-xl outline-none text-gray-dark focus:border-primary focus:ring-1 focus:ring-primary transition"
          >
            <option value="All">All Categories</option>
            <option value="Programming">Programming</option>
            <option value="Design">Design</option>
            <option value="Database">Database</option>
            <option value="Web Development">Web Development</option>
            <option value="Business">Business</option>
          </select>

          <button
            onClick={() => setAddCourses(true)}
            className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-xl flex items-center justify-center gap-2 shadow-soft transition"
          >
            <FaPlus /> Add Course
          </button>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid md:grid-cols-2 gap-4 min-h-[150px]">
        {loading ? (
          <div className="col-span-full text-center text-gray-dark py-10">
            Loading courses...
          </div>
        ) : error ? (
          <div className="col-span-full text-center text-red-500 py-10">
            {error}
          </div>
        ) : courses.length === 0 ? (
          <div className="col-span-full text-center text-gray-dark py-10">
            No courses found.
          </div>
        ) : (
          courses.map((course, idx) => (
            <div
              key={course.id}
              className="p-5 bg-white rounded-xl shadow-card hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-gray-dark">
                    {course.name}
                  </h2>
                  <span className="text-sm text-gray">
                    {(course.categories || []).join(", ")}
                  </span>
                </div>
                {course.status && (
                  <span
                    className={`px-2 py-1 rounded-lg capitalize text-sm font-medium border ${
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

              <div className="flex justify-between items-center mt-6">
                <div className="flex items-center gap-2 text-gray-dark">
                  <LuUsers className="text-gray text-lg" />
                  <span>{course.enrollmentCount || 0}</span>
                </div>
                <span className="text-gray">
                  {course.totalSessions || 0} weeks
                </span>
              </div>

              <div className="grid sm:grid-cols-[43%_43%_auto] gap-2 mt-4">
                <Link
                  to={`/teacher/course/${course.id}`}
                  className="flex items-center justify-center gap-2 border border-gray-light px-4 py-2 rounded-lg text-gray-dark hover:bg-gray-light transition"
                >
                  <MdOutlineRemoveRedEye /> View
                </Link>

                <button
                  onClick={() => editHandler(course)}
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
          ))
        )}
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

      {/* Edit Courses Popup */}
      {editCourse && (
        <UpdateCourses
          course={editCourse}
          onClose={() => setEditCourse(null)}
          onSave={handleSaveEdit}
        />
      )}

      {/* Add Course Popup */}
      {addCourses && (
        <AddCourses
          onClose={() => setAddCourses(false)}
          setNewCourse={handleAddCourse}
        />
      )}
    </div>
  );
}
