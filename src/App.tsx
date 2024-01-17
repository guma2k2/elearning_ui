import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/home";
import AdminPage from "./pages/admin";
import Dashboard from "./pages/admin/dashboard";
import Courses from "./pages/courses";
import Blog from "./pages/blog";
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
          path: "/admin",
          element: <Dashboard />
        },
        {
          path: "/admin/users",
          element: <Dashboard />
        },
        {
          path: "/admin/categories",
          element: <Dashboard />
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