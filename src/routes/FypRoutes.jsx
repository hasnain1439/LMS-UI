import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";

// ---- Auth Pages ----
import Registeration from "../page/register/Registeration";
import Login from "../page/login/Login";
// ---- Teacher Dashboard Pages ----
import DashboardHome from "../page/adminDashboard/dashboard/feature/DashboardHome";
import QuizzesPage from "../page/adminDashboard/qizzes/feature/QuizzesPage";
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
