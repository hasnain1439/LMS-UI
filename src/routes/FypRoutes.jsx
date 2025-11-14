import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";

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
import TeacherDashboard from "../page/adminDashboard/dashboard";

// ---- Teacher Dashboard Components ----]




function FypRoutes() {
  const router = createBrowserRouter([
    // ---- Public Routes ----
    {
      path: "/",
      element: (
        <h1 className="text-center text-2xl font-bold mt-10">Home Page</h1>
      ),
    },
    {
      path: "/register",
      element: <Registeration />,
    },
    {
      path: "/verify-email/:token",
      element: <VerifyEmail/>
    },
     {
      path: "/forget-password",
      element: <ForgotPassword/>
    },
    {
      path: "/resend-verification",
      element: <ResendVerification/>
    },
      {
      path: "/reset-password/:token",
      element: <ResetPassword/>
    },
    {
      path: "/login",
      element: <Login />,
    },

    // ---- Teacher Dashboard Routes ----
    {
      path: "/teacher",
      element: <TeacherDashboard />,
      handle: { title: "Dashboard Overview" },
      children: [
        {
          index: true,
          element: <DashboardHome />,
          handle: { title: "Dashboard Overview 👋" },
        },
        {
          path: "courses",
          element: <CoursesPage />,
          handle: { title: "My Courses" },
        },
        {
          path: "quizzes",
          element: <QuizzesPage />,
          handle: { title: "My Quizzes" },
        },
        {
          path: "enrollments",
          element: <EnrollmentsPage />,
          handle: { title: "Enrollments" },
        },
        {
          path: "profile",
          element: <ProfilePage />,
          handle: { title: "My Profile" },
        },
      ],
    },
  ]);


  return <RouterProvider router={router} />;
}

export default FypRoutes;
