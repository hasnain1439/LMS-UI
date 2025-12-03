import { createBrowserRouter, RouterProvider } from "react-router-dom";

// ---- Auth Pages ----
import Registeration from "../page/auth/register/Registeration";
import Login from "../page/auth/login/Login";
import VerifyEmail from "../page/auth/verifyEmail/VerifyEmail";
import ResendVerification from "../page/auth/resendEmaill/ResendVerification";
import ForgotPassword from "../page/auth/forgetPassword/ForgetPassword";
import ResetPassword from "../page/auth/resetPassword/ResetPassword";

// ---- Teacher Dashboard Pages ----
import DashboardHome from "../page/adminDashboard/dashboard/feature/DashboardHome";
import QuizzesPage from "../page/adminDashboard/qizzes/index";
import EnrollmentsPage from "../page/adminDashboard/enrollment/feature/EnrollmentsPage";
import CoursesPage from "../page/adminDashboard/courses";
import ProfilePage from "../page/adminDashboard/profile/feature/ProfilePage";
import UpdateProfile from "../page/adminDashboard/profile/feature/UpdateProfile";
import TeacherDashboard from "../page/adminDashboard/dashboard";
import ChangePassword from "../page/adminDashboard/profile/feature/ChangePassword";
import CourseDetail from "../page/adminDashboard/courses/feature/CourseDetail";
import CreateQuiz from "../page/adminDashboard/qizzes/feature/CreateQuiz"; // Keep import
import EditQuiz from "../page/adminDashboard/qizzes/feature/EditQuiz";
import EditQuestion from "../page/adminDashboard/qizzes/feature/EditQuestion";
import AddQuestion from "../page/adminDashboard/qizzes/feature/AddQuestion";
import QuizDetails from "../page/adminDashboard/qizzes/feature/QuizDetails";

function FypRoutes() {
  const router = createBrowserRouter([
    // ---- Public Routes ----
    {
      path: "/",
      element: (
        <h1 className="text-center text-2xl font-bold mt-10">Home Page</h1>
      ),
    },
    { path: "/register", element: <Registeration /> },
    { path: "/login", element: <Login /> },
    { path: "/verify-email/:token", element: <VerifyEmail /> },
    { path: "/resend-verification", element: <ResendVerification /> },
    { path: "/forget-password", element: <ForgotPassword /> },
    { path: "/reset-password/:token", element: <ResetPassword /> },

    // ---- Teacher Dashboard Routes ----
    {
      path: "/teacher",
      element: <TeacherDashboard />, // Layout with <Outlet />
      children: [
        { index: true, element: <DashboardHome /> },
        { path: "courses", element: <CoursesPage /> },
        // ✅ Corrected: Quizzes is now a parent path with children
        {
          path: "quizzes",
          children: [
            { index: true, element: <QuizzesPage /> }, // Full path: /teacher/quizzes
            { path: "create-quizzes", element: <CreateQuiz /> }, // Full path: /teacher/quizzes/create
            {
              path: "edit-quiz/:quizId",
              element: <EditQuiz />,
            },
            {
              path: "edit-quiz/:quizId/questions/:questionId",
              element: <EditQuestion />,
            },
            {
              path: "edit-quiz/:quizId/add-question",
              element: <AddQuestion />,
            },
            {
              path: "view-quiz/:quizId",
              element: <QuizDetails />,
            },
          ],
        },
        { path: "enrollments", element: <EnrollmentsPage /> },
        { path: "profile", element: <ProfilePage /> },
        { path: "update-profile", element: <UpdateProfile /> },
        { path: "change-password", element: <ChangePassword /> },
        { path: "course/:courseId", element: <CourseDetail /> },
      ],
    },

    // Optional: fallback route for 404
    {
      path: "*",
      element: (
        <h1 className="text-center text-2xl font-bold mt-10 text-red-500">
          404 | Page Not Found
        </h1>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default FypRoutes;
