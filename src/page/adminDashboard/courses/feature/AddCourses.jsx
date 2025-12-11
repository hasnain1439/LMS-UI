import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
// ✅ Make sure this path is correct for your project structure
import { CreateCoursesApi } from "../../../../api/Courses"; 

export default function AddCourses({ onClose, setNewCourse }) {
  const [loading, setLoading] = useState(false);

  // Map days to numbers for the Backend (1=Monday...7=Sunday)
  const dayMap = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7,
  };

  // ✅ Validation Schema
  const validationSchema = Yup.object({
    title: Yup.string().required("Course title is required"),
    description: Yup.string().required("Description is required"),
    categories: Yup.array().min(1, "Select at least one category"),
    duration: Yup.number()
      .typeError("Must be a number")
      .required("Duration is required"),
    courseCurriculum: Yup.string().required("Curriculum is required"),
    schedules: Yup.array().of(
      Yup.object({
        dayOfWeek: Yup.string().required("Day is required"),
        startTime: Yup.string().required("Start time is required"),
        endTime: Yup.string().required("End time is required"),
      })
    ),
  });

  // Disable background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setLoading(true);

      // ✅ Prepare data for Backend
      const apiData = {
        name: values.title,
        description: values.description,
        categories: values.categories,
        totalSessions: Number(values.duration), // Ensure it sends a Number
        courseCurriculum: values.courseCurriculum,
        schedules: values.schedules.map((s) => ({
          dayOfWeek: dayMap[s.dayOfWeek], // Convert "Monday" -> 1
          startTime: s.startTime,
          endTime: s.endTime,
        })),
      };

      console.log("Sending Data:", apiData); // Debugging

      const res = await CreateCoursesApi(apiData);
      console.log("✅ Course Created:", res.course);
      
      // Update parent state if function is provided
      if (setNewCourse) {
        setNewCourse(res.course); 
      }

      resetForm();
      if (onClose) onClose(false);
      
    } catch (error) {
      console.error("Error creating course:", error);
      // specific backend error message or generic fallback
      const errorMsg = error.response?.data?.message || error.response?.data?.error || "Failed to create course.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed -inset-10 bg-black/50 flex items-start justify-center z-50 overflow-auto pt-20 pb-10">
      <div className="bg-white max-w-[310px] sm:max-w-[640px] w-full mx-auto px-6 pt-8 pb-6 rounded-xl shadow-card relative">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Create New Course
          </h2>
          <button
            onClick={() => onClose(false)}
            className="text-gray-500 hover:text-gray-700 text-lg font-bold"
          >
            ×
          </button>
        </div>

        <Formik
          initialValues={{
            title: "",
            description: "",
            categories: [],
            duration: "",
            courseCurriculum: "",
            schedules: [{ dayOfWeek: "", startTime: "", endTime: "" }],
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-5">
              
              {/* Title */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Course Title
                </label>
                <Field
                  name="title"
                  type="text"
                  className="w-full border border-gray-light rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="Enter course title"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Field
                  as="textarea"
                  name="description"
                  rows="3"
                  className="w-full border border-gray-light rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="Write about this course..."
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Categories */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Web Development",
                    "Programming",
                    "Data Science",
                    "Design",
                    "Business",
                  ].map((cat) => (
                    <label
                      key={cat}
                      className="inline-flex items-center gap-1 border px-2 py-1 rounded-md cursor-pointer hover:bg-gray-50 transition"
                    >
                      <input
                        type="checkbox"
                        value={cat}
                        checked={values.categories.includes(cat)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFieldValue("categories", [
                              ...values.categories,
                              cat,
                            ]);
                          } else {
                            setFieldValue(
                              "categories",
                              values.categories.filter((c) => c !== cat)
                            );
                          }
                        }}
                      />
                      <span className="text-gray-700">{cat}</span>
                    </label>
                  ))}
                </div>
                <ErrorMessage
                  name="categories"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Curriculum */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Course Curriculum
                </label>
                <Field
                  as="textarea"
                  name="courseCurriculum"
                  rows="3"
                  className="w-full border border-gray-light rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="Write about course content..."
                />
                <ErrorMessage
                  name="courseCurriculum"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Duration (in weeks)
                </label>
                <Field
                  name="duration"
                  type="number"
                  className="w-full border border-gray-light rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="e.g. 8"
                />
                <ErrorMessage
                  name="duration"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Schedules */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Course Schedules
                </label>
                <FieldArray name="schedules">
                  {({ push, remove }) => (
                    <div className="space-y-3">
                      {values.schedules.map((_, index) => (
                        <div
                          key={index}
                          className="flex flex-wrap items-center gap-3 border p-3 rounded-md bg-gray-50"
                        >
                          {/* Day Dropdown */}
                          <Field
                            as="select"
                            name={`schedules[${index}].dayOfWeek`}
                            className="border border-gray-light rounded-md p-2 w-full sm:w-1/3 focus:ring-2 focus:ring-blue-400 outline-none bg-white"
                          >
                            <option value="">Select Day</option>
                            {Object.keys(dayMap).map((day) => (
                              <option key={day} value={day}>
                                {day}
                              </option>
                            ))}
                          </Field>

                          {/* Start Time */}
                          <Field
                            type="time"
                            name={`schedules[${index}].startTime`}
                            className="border border-gray-light rounded-md p-2 w-full sm:w-1/4 focus:ring-2 focus:ring-blue-400 outline-none"
                          />

                          {/* End Time */}
                          <Field
                            type="time"
                            name={`schedules[${index}].endTime`}
                            className="border border-gray-light rounded-md p-2 w-full sm:w-1/4 focus:ring-2 focus:ring-blue-400 outline-none"
                          />

                          {/* Delete Button */}
                          {values.schedules.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-red-500 hover:text-red-600 ml-auto sm:ml-0"
                            >
                              <FaTrash />
                            </button>
                          )}
                          
                          {/* Individual Errors for Schedule items */}
                          <div className="w-full flex gap-4 text-red-500 text-xs">
                             <ErrorMessage name={`schedules[${index}].dayOfWeek`} component="div" />
                             <ErrorMessage name={`schedules[${index}].startTime`} component="div" />
                             <ErrorMessage name={`schedules[${index}].endTime`} component="div" />
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() =>
                          push({ dayOfWeek: "", startTime: "", endTime: "" })
                        }
                        className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline mt-2"
                      >
                        <FaPlus size={12} /> Add Schedule
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-5">
                <button
                  type="button"
                  onClick={() => onClose(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Course"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}