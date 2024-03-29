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
import CourseEdit from "./pages/admin/course/CourseEdit";
import { message } from "antd";
import { useAppSelector } from "./redux/hooks";
import { useEffect } from "react";
function App() {
  const [messageApi, contextHolder] = message.useMessage();
  const { isShow, content, type, duration } = useAppSelector((state) => state.messages);
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
          path: "/admin/courses/edit/:id",
          element: <CourseEdit />

        },
        {
          path: "/admin/promotions",
          element: <Dashboard />
        },
      ]
    },
  ]);

  useEffect(() => {
    if (content !== "") {
      messageApi.open({
        type: type,
        content,
        duration
      });
    }
  }, [isShow])

  return (
    <>
      {contextHolder}
      <RouterProvider router={router} ></RouterProvider>
    </>
  )


}

export default App