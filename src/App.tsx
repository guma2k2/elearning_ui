import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/home";
import AdminPage from "./pages/admin";
import Dashboard from "./pages/admin/dashboard";
import Courses from "./pages/courses";
import Blog from "./pages/blog";
import User from "./pages/admin/user";
import Category from "./pages/admin/category";
import Topic from "./pages/admin/topic";
import Course from "./pages/admin/course";
import CourseCreate from "./pages/admin/course/CourseCreate";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      children: [
        {
          path: "/",
          element: <Courses />,
        },
        {
          path: "/blog",
          element: <Blog />,
        }
      ]
    },
    {
      path: "/admin",
      element: <AdminPage />,
      children: [
        {
          index: true,
          element: <Dashboard />
        },
        {
          path: "/admin/users",
          element: <User />
        },
        {
          path: "/admin/categories",
          element: <Category />
        },
        {
          path: "/admin/topics",
          element: <Topic />
        },
        {
          path: "/admin/courses",
          element: <Course />,
        },
        {
          path: "/admin/courses/create",
          element: <CourseCreate />

        },
        {
          path: "/admin/promotions",
          element: <Dashboard />
        },
      ]
    },
  ]);
  return (
    <RouterProvider router={router} />
  )
}

export default App