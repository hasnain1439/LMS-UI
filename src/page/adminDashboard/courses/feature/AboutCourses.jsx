import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

export default function AboutCourses() {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <select name="" id=""></select>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700">
          <FaPlus /> Add Course
        </button>
      </div>
    </div>
  );
}
