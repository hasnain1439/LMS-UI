import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useEffect } from "react";

export default function AddCourses({ onClose, onSave }) {
  // ✅ Validation Schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Course name is required"),
    description: Yup.string().required("Description is required"),
    categories: Yup.string().required("Category is required"),
    courseCurriculum: Yup.string().required("Curriculum is required"),
    totalSessions: Yup.number()
      .typeError("Must be a number")
      .required("Total sessions required"),
    schedules: Yup.array().of(
      Yup.object({
        dayOfWeek: Yup.string().required("Day is required"),
        startTime: Yup.string().required("Start time is required"),
        endTime: Yup.string().required("End time is required"),
      })
    ),
  });

  // ✅ Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSubmit = (values, { resetForm }) => {
    console.log("New Course Data:", values);
    onSave?.(values);
    resetForm();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 overflow-auto py-10">
      <div className="bg-white max-w-[640px] w-full mx-auto px-6 pt-8 pb-5 rounded-xl shadow-card">
        {/* Header */}
        <h2 className="text-xl font-semibold text-gray-dark mb-4">
          Create New Course
        </h2>

        <Formik
          initialValues={{
            name: "",
            description: "",
            categories: "",
            courseCurriculum: "",
            totalSessions: "",
            schedules: [
              {
                dayOfWeek: "",
                startTime: "",
                endTime: "",
              },
            ],
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, isSubmitting }) => (
            <Form className="flex flex-col gap-3">
              {/* Course Name */}
              <label className="text-sm font-medium text-gray-dark">
                Course Name
              </label>
              <Field
                name="name"
                type="text"
                placeholder="Enter course name"
                className="border border-gray-light focus:border-primary focus:ring-1 focus:ring-primary outline-none p-2 rounded-md"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-error text-sm"
              />

              {/* Description */}
              <label className="text-sm font-medium text-gray-dark">
                Description
              </label>
              <Field
                as="textarea"
                name="description"
                rows="3"
                placeholder="Write about this course..."
                className="border border-gray-light focus:border-primary focus:ring-1 focus:ring-primary outline-none p-2 rounded-md"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-error text-sm"
              />

              {/* Category */}
              <label className="text-sm font-medium text-gray-dark">
                Category
              </label>
              <Field
                as="select"
                name="categories"
                className="border border-gray-light focus:border-primary focus:ring-1 focus:ring-primary outline-none p-2 rounded-md bg-white"
              >
                <option value="">Select category</option>
                <option value="Web Development">Web Development</option>
                <option value="Data Science">Data Science</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
              </Field>
              <ErrorMessage
                name="categories"
                component="div"
                className="text-error text-sm"
              />

              {/* Curriculum */}
              <label className="text-sm font-medium text-gray-dark">
                Course Curriculum
              </label>
              <Field
                as="textarea"
                name="courseCurriculum"
                rows="3"
                placeholder="Write about course content..."
                className="border border-gray-light focus:border-primary focus:ring-1 focus:ring-primary outline-none p-2 rounded-md"
              />
              <ErrorMessage
                name="courseCurriculum"
                component="div"
                className="text-error text-sm"
              />

              {/* Total Sessions */}
              <label className="text-sm font-medium text-gray-dark">
                Total Sessions
              </label>
              <Field
                name="totalSessions"
                type="number"
                placeholder="e.g. 10"
                className="border border-gray-light focus:border-primary focus:ring-1 focus:ring-primary outline-none p-2 rounded-md"
              />
              <ErrorMessage
                name="totalSessions"
                component="div"
                className="text-error text-sm"
              />

              {/* Schedules */}
              <label className="text-sm font-medium text-gray-dark">
                Course Schedules
              </label>
              <FieldArray name="schedules">
                {({ push, remove }) => (
                  <div className="space-y-3">
                    {values.schedules.map((_, index) => (
                      <div
                        key={index}
                        className="flex flex-wrap items-center gap-3 border border-gray-light p-3 rounded-md"
                      >
                        <Field
                          as="select"
                          name={`schedules[${index}].dayOfWeek`}
                          className="border border-gray-light focus:border-primary focus:ring-1 focus:ring-primary outline-none p-2 rounded-md w-full sm:w-1/3 bg-white"
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
                          className="border border-gray-light focus:border-primary focus:ring-1 focus:ring-primary outline-none p-2 rounded-md w-full sm:w-1/4"
                        />
                        <Field
                          type="time"
                          name={`schedules[${index}].endTime`}
                          className="border border-gray-light focus:border-primary focus:ring-1 focus:ring-primary outline-none p-2 rounded-md w-full sm:w-1/4"
                        />

                        {values.schedules.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-error hover:text-red-600 mt-1"
                            title="Remove Schedule"
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
                      className="inline-flex items-center gap-2 text-primary font-medium hover:underline mt-2"
                    >
                      <FaPlus size={12} /> Add Schedule
                    </button>
                  </div>
                )}
              </FieldArray>

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-light hover:bg-gray text-gray-dark rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gradient-to-r from-primary to-primary-dark text-white rounded-md shadow-md hover:opacity-90 transition"
                >
                  {isSubmitting ? "Creating..." : "Create Course"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
