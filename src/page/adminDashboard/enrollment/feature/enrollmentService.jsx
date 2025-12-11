import axios from "axios";

const API_URL = "http://localhost:5000/api/enrollments";

export const enrollmentService = {
  // 1. GET ALL (Matches router.get "/")
  getAll: async (page = 1, limit = 10, search = "", status = "") => {
    const token = localStorage.getItem("token");
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        page,
        limit,
        search,
        status: status === "All" ? "" : status,
      },
    });
    return response.data;
  },

  // 2. CREATE (Matches router.post "/")
  create: async (studentId, courseId) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      API_URL,
      { studentId, courseId }, // Body must match createEnrollmentSchema
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // 3. UPDATE STATUS (Matches router.put "/:id")
  updateStatus: async (id, status) => {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_URL}/${id}`, // Matches /:id in router
      { status },         // Body matches updateEnrollmentSchema
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
};