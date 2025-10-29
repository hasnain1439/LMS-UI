import { LuUsers } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";

export default function ViewCoursesData({ viewData, closePopup }) {
  return (
    <div className="fixed -inset-10 bg-black/50 flex items-center justify-center z-50">
      <div className="relative w-full max-w-[640px] px-6 pt-8 pb-6 bg-white rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 ">
          <h2 className="text-xl font-semi-bold text-gray-dark">
            View Course Details
          </h2>
          {/* Close Button */}
          <button
            onClick={() => closePopup(false)}
            className="text-gray hover:text-gray-dark transition"
          >
            <RxCross2 className="text-2xl" />
          </button>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold text-gray-dark">
              {viewData.title}
            </h2>
            <span className="text-sm text-gray">{viewData.category}</span>
          </div>

          {viewData.status && (
            <span
              className={`px-2 py-1 rounded-lg capitalize text-sm font-medium
                ${
                  viewData.status === "active"
                    ? "bg-green-100 text-green-700"
                    : viewData.status === "completed"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-red-100 text-red-700"
                }`}
            >
              {viewData.status}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-gray mt-4 leading-relaxed">{viewData.description}</p>

        {/* Students & Duration */}
        <div className="flex justify-between items-center mt-6">
          <div className="flex items-center gap-2 text-gray-dark">
            <LuUsers className="text-xl" />
            <span className="text-base font-medium">
              {viewData.students} Students
            </span>
          </div>
          <span className="text-base font-medium text-gray-dark">
            {viewData.duration}
          </span>
        </div>

        {/* Progress */}
        <div className="mt-5">
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-dark font-semibold text-base">
              Progress
            </span>
            <span className="text-gray-dark font-medium text-base">
              {viewData.progress}%
            </span>
          </div>

          <div className="w-full bg-gray-light rounded-lg h-3 overflow-hidden">
            <div
              className="bg-primary h-3 rounded-lg transition-all duration-300"
              style={{ width: `${viewData.progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
