import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GetCourseById } from "../../../../api/GetCourseById";

export default function CourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) {
        setError("Invalid course ID");
        setLoading(false);
        return;
      }

      try {
        const data = await GetCourseById(courseId);

        const normalizedCourse = {
          ...data,
          courseCurriculum: Array.isArray(data.courseCurriculum)
            ? data.courseCurriculum
            : data.courseCurriculum
            ? [data.courseCurriculum]
            : [],
          schedules: Array.isArray(data.schedules)
            ? data.schedules
            : data.schedules
            ? [data.schedules]
            : [],
        };

        setCourse(normalizedCourse);
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) return <p className="text-gray-dark text-center py-10">Loading course...</p>;
  if (error) return <p className="text-error text-center py-10">{error}</p>;
  if (!course) return <p className="text-gray-dark text-center py-10">Course not found</p>;

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-xl shadow-card border border-gray-light">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-dark">{course.name}</h1>
        <p className="text-gray mt-2">{course.description}</p>
        <div className="flex flex-wrap items-center mt-3 gap-3">
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            Category: {Array.isArray(course.categories) ? course.categories.join(", ") : course.categories}
          </span>
          <span className="bg-success/10 text-success px-3 py-1 rounded-full text-sm font-medium">
            Duration: {course.totalSessions || 0} weeks
          </span>
        </div>
      </div>

      {/* Curriculum */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-dark mb-3 border-b border-gray-light pb-2">Course Curriculum</h2>
        <ul className="space-y-2">
          {course.courseCurriculum.length > 0 ? (
            course.courseCurriculum.map((topic, index) => (
              <li
                key={index}
                className="flex items-start gap-3 p-3 bg-gray-light rounded-lg shadow-card hover:bg-gray-light/50 transition"
              >
                <span className="font-semibold text-gray-dark">{index + 1}.</span>
                <span className="text-gray-dark">{topic}</span>
              </li>
            ))
          ) : (
            <li className="text-gray">No curriculum available</li>
          )}
        </ul>
      </div>

      {/* Schedules */}
      <div>
        <h2 className="text-lg font-semibold text-gray-dark mb-3 border-b border-gray-light pb-2">Schedules</h2>
        <ul className="space-y-2">
          {course.schedules.length > 0 ? (
            course.schedules.map((s, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-3 bg-gray-light rounded-lg shadow-card hover:bg-gray-light/50 transition"
              >
                <span className="font-medium text-gray-dark">
                  {daysOfWeek[s.dayOfWeek] || "Unknown"}
                </span>
                <span className="text-gray">{s.startTime} - {s.endTime}</span>
              </li>
            ))
          ) : (
            <li className="text-gray">No schedules available</li>
          )}
        </ul>
      </div>
    </div>
  );
}
