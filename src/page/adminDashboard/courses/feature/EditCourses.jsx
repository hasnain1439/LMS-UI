import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function EditCourses({ course, onClose, onSave }) {
  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    category: Yup.string().required("Category is required"),
    duration: Yup.string().required("Duration is required"),
    students: Yup.number().required("Students required").positive("Must be positive"),
    description: Yup.string().required("Description is required"),
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white max-w-[640px] w-full px-6 pt-8 pb-5 rounded-xl shadow-card">
        <h2 className="text-xl font-semibold text-gray-dark mb-4">
          Edit Course
        </h2>

        <Formik
          initialValues={{
            title: course.title,
            category: course.category,
            duration: course.duration,
            students: course.students,
            progress: course.progress,
            status: course.status,
            description: course.description,
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => onSave(values, course.index)}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-3">
              {/* Title */}
              <label className="text-sm font-medium text-gray-dark">Title</label>
              <Field
                name="title"
                className="border border-gray-light focus:border-primary focus:ring-1 focus:ring-primary outline-none p-2 rounded-md"
              />
              <ErrorMessage name="title" component="div" className="text-error text-sm" />

              {/* Category */}
              <label className="text-sm font-medium text-gray-dark">Category</label>
              <Field
                as="select"
                name="category"
                className="border border-gray-light focus:border-primary focus:ring-1 focus:ring-primary outline-none p-2 rounded-md"
              >
                <option value="">Select Category</option>
                <option value="Programming">Programming</option>
                <option value="Design">Design</option>
                <option value="Database">Database</option>
              </Field>
              <ErrorMessage name="category" component="div" className="text-error text-sm" />

              {/* Duration */}
              <label className="text-sm font-medium text-gray-dark">Duration</label>
              <Field
                name="duration"
                className="border border-gray-light focus:border-primary focus:ring-1 focus:ring-primary outline-none p-2 rounded-md"
              />

              {/* Students */}
              <label className="text-sm font-medium text-gray-dark">Students</label>
              <Field
                name="students"
                type="number"
                className="border border-gray-light focus:border-primary focus:ring-1 focus:ring-primary outline-none p-2 rounded-md"
              />

              {/* Description */}
              <label className="text-sm font-medium text-gray-dark">Description</label>
              <Field
                as="textarea"
                name="description"
                rows="3"
                className="border border-gray-light focus:border-primary focus:ring-1 focus:ring-primary outline-none p-2 rounded-md"
              />

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-5">
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
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
