import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useState, useEffect } from "react";

// Map day names to numbers (backend expects numbers)
const dayMap = [
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
  { label: "Sunday", value: 7 },
];

export default function UpdateCourses({ course, onClose, onSave }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

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
        dayOfWeek: Yup.number()
          .typeError("Day is required")
          .required("Day is required"),
        startTime: Yup.string().required("Start time is required"),
        endTime: Yup.string()
          .required("End time is required")
          .test("is-after-start", "End must be after start", function (value) {
            const { startTime } = this.parent;
            if (!startTime || !value) return true;
            const [sH, sM] = startTime.split(":").map(Number);
            const [eH, eM] = value.split(":").map(Number);
            return eH > sH || (eH === sH && eM > sM);
          }),
      })
    ),
  });

  const initialValues = {
    id: course.id,
    title: course.name || "",
    description: course.description || "",
    categories: course.categories || [],
    duration: course.totalSessions || 0,
    courseCurriculum: course.courseCurriculum || "",
    schedules: course.schedules.map((s) => ({
      dayOfWeek: Number(s.dayOfWeek) || "", // convert to number
      startTime: s.startTime.slice(0, 5), // remove seconds if any
      endTime: s.endTime.slice(0, 5),
    })),
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const updatedData = {
        id: course.id,
        name: values.title,
        description: values.description,
        categories: values.categories,
        totalSessions: values.duration,
        courseCurriculum: values.courseCurriculum,
        schedules: values.schedules.map((s) => ({
          dayOfWeek: Number(s.dayOfWeek), // ensure number
          startTime: s.startTime,
          endTime: s.endTime,
        })),
      };
      await onSave(updatedData);
      onClose();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Failed to update course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed -inset-10 bg-black/50 flex items-start justify-center z-50 overflow-auto pt-20 pb-10">
      <div className="bg-white max-w-[310px] sm:max-w-[640px] w-full mx-auto px-6 pt-8 pb-6 rounded-xl shadow-card relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Update Course
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-lg font-bold"
          >
            ×
          </button>
        </div>

        <Formik
          initialValues={initialValues}
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
                  {["Web Development", "Programming", "Data Science", "Design", "Business"].map((cat) => (
                    <label
                      key={cat}
                      className="inline-flex items-center gap-1 border px-2 py-1 rounded-md cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={cat}
                        checked={values.categories.includes(cat)}
                        onChange={(e) => {
                          if (e.target.checked)
                            setFieldValue("categories", [...values.categories, cat]);
                          else
                            setFieldValue(
                              "categories",
                              values.categories.filter((c) => c !== cat)
                            );
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
                            onChange={(e) => {
                              const value = e.target.value;
                              setFieldValue(
                                `schedules[${index}].dayOfWeek`,
                                value === "" ? "" : Number(value)
                              );
                            }}
                          >
                            <option value="">Select Day</option>
                            {dayMap.map((d) => (
                              <option key={d.value} value={d.value}>
                                {d.label}
                              </option>
                            ))}
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
                        onClick={() => push({ dayOfWeek: "", startTime: "", endTime: "" })}
                        className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline mt-2"
                      >
                        <FaPlus size={12} /> Add Schedule
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>

              <div className="flex justify-end gap-3 pt-5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-light hover:bg-gray text-gray-dark rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  {loading ? "Updating..." : "Update Course"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
