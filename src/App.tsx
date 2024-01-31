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
          path: "/admin/courses",
          element: <Dashboard />
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