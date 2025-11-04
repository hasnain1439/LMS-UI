import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useEffect } from "react";

export default function AddCourses({ onClose, setNewCourse, currentCourses }) {
  // ✅ Validation Schema
  const validationSchema = Yup.object({
    title: Yup.string().required("Course title is required"),
    description: Yup.string().required("Description is required"),
    category: Yup.string().required("Category is required"),
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

  // ✅ Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  // ✅ Form Submit Handler
  const handleSubmit = (values, { resetForm }) => {
    const newCourse = {
      title: values.title,
      category: values.category,
      students: Math.floor(Math.random() * 40) + 10, // Random 10–50
      duration: `${values.duration} weeks`,
      progress: 0,
      status: "active",
      description: values.description,
      courseCurriculum: values.courseCurriculum,
      schedules: values.schedules,
    };

    setNewCourse([...currentCourses, newCourse]);
    console.log("✅ Course Added:", newCourse);
    resetForm();
    onClose?.();
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

        {/* Formik Form */}
        <Formik
          initialValues={{
            title: "",
            description: "",
            category: "",
            duration: "",
            courseCurriculum: "",
            schedules: [{ dayOfWeek: "", startTime: "", endTime: "" }],
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values }) => (
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
                  placeholder="Enter course name"
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

              {/* Category */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Category
                </label>
                <Field
                  as="select"
                  name="category"
                  className="w-full border border-gray-light rounded-md p-2 bg-white focus:ring-2 focus:ring-blue-400 outline-none"
                >
                  <option value="">Select category</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Programming">Programming</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Design">Design</option>
                  <option value="Business">Business</option>
                </Field>
                <ErrorMessage
                  name="category"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Course Curriculum */}
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
                          <Field
                            as="select"
                            name={`schedules[${index}].dayOfWeek`}
                            className="border border-gray-light rounded-md p-2 w-full sm:w-1/3 focus:ring-2 focus:ring-blue-400 outline-none"
                          >
                            <option value="">Select Day</option>
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                            <option value="Saturday">Saturday</option>
                            <option value="Sunday">Sunday</option>
                          </Field>

                          <Field
                            type="time"
                            name={`schedules[${index}].startTime`}
                            className="border border-gray-light rounded-md p-2 w-full sm:w-1/4 focus:ring-2 focus:ring-blue-400 outline-none"
                          />
                          <Field
                            type="time"
                            name={`schedules[${index}].endTime`}
                            className="border border-gray-light rounded-md p-2 w-full sm:w-1/4 focus:ring-2 focus:ring-blue-400 outline-none"
                          />

                          {values.schedules.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <FaTrash />
                            </button>
                          )}
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
                  className="px-4 py-2 bg-gray-light hover:bg-gray text-gray-dark rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Create Course
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
