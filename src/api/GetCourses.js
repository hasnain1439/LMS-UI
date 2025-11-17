import axios from "axios";

export const GetCourses = async (filters = {}) => {
  try {
    const params = {};

    // Only add filters if they exist
    if (filters.category) params.category = filters.category;
    if (filters.teacherName) params.teacherName = filters.teacherName;
    if (filters.dayOfWeek) params.dayOfWeek = filters.dayOfWeek;
    if (filters.startTimeAfter) params.startTimeAfter = filters.startTimeAfter;
    if (filters.endTimeBefore) params.endTimeBefore = filters.endTimeBefore;
    if (filters.search) params.search = filters.search;

    const res = await axios.get("http://localhost:5000/api/courses/getAllCourses", {
      params,
      withCredentials: true,
    });

    return res.data.courses;
  } catch (error) {
    console.error("Get courses API error:", error.response?.data || error);
    throw error;
  }
};
