import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/home";
import AdminPage from "./pages/admin";
import Dashboard from "./pages/admin/dashboard";
import Courses from "./pages/courses";
import User from "./pages/admin/user";
import Category from "./pages/admin/category";
import Topic from "./pages/admin/topic";
import Course from "./pages/admin/course";
import CourseEdit from "./pages/admin/course/CourseEdit";
import { message } from "antd";
import { useAppSelector } from "./redux/hooks";
import { useEffect } from "react";
import Login from "./pages/login";
import Authenticate from "./pages/authenticate";
import Register from "./pages/register";
import Cart from "./pages/cart";
import CourseDetail from "./pages/course";
import Learning from "./pages/learning";
import Filter from "./pages/filter";
import './index.scss'
import MyLearning from "./pages/my-learning";
import ProtectedRoute from "./components/protected-route";
import NotFound from "./components/not-found";
import Profile from "./pages/profile";
import VnPayCallback from "./pages/vnpay-callback";
import Payment from "./pages/payment";
import CouponManagement from "./pages/admin/coupon";
import OrderManagement from "./pages/admin/order";
import StudentManagement from "./pages/admin/student";
import ReviewManagement from "./pages/admin/review";
import OrderHistory from "./pages/order-history";
import PaymentCourse from "./pages/payment/PaymentCourse";
import InstructorProfile from "./pages/instructor-profile";
import ForgotPassword from "./pages/forgotpassword";
import UpdatePassword from "./pages/forgotpassword/UpdatePassword";
import ProfileAdmin from "./pages/profile-admin";
function App() {
  const [messageApi, contextHolder] = message.useMessage();
  const { isShow, content, type, duration } = useAppSelector((state) => state.messages);
  const router = createBrowserRouter([
    {
      path: "/",
      errorElement: <NotFound />,
      element: <Home />,
      children: [
        {
          path: "/",
          element: <Courses />,
        },
        {
          path: "/purchase-history",
          element: <ProtectedRoute> <OrderHistory /></ProtectedRoute>,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/profile",
          element: <ProtectedRoute> <Profile /></ProtectedRoute>,
        },
        {
          path: "/user/:id",
          element: <InstructorProfile />,
        },
        {
          path: "/my-learning",
          element: <ProtectedRoute><MyLearning /></ProtectedRoute>,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/forgotpassword",
          element: <ForgotPassword />,
        },
        {
          path: "/password-confirm",
          element: <UpdatePassword />,
        },
        {
          path: "/cart",
          element: <ProtectedRoute><Cart /> </ProtectedRoute>,
        },
        {
          path: "/courses/:courseId",
          element: <CourseDetail />,
        },
        {
          path: "/courses/search",
          element: <Filter />,
        },
        {
          path: "/authenticate",
          element: <Authenticate />,
        },
        {
          path: "/vn-pay-callback",
          element: <VnPayCallback />,
        },
        {
          path: "/payment/checkout/",
          element: <ProtectedRoute><Payment /></ProtectedRoute>,
        }, {
          path: "/payment/checkout/course/:id",
          element: <ProtectedRoute> <PaymentCourse /></ProtectedRoute>,
        },
      ]
    },
    {
      path: "/admin",
      errorElement: <NotFound />,
      element: <ProtectedRoute><AdminPage /> </ProtectedRoute>,
      // element: <AdminPage />,
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
          path: "/admin/profile",
          element: <ProfileAdmin />
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
          path: "/admin/coupons",
          element: <CouponManagement />
        },
        {
          path: "/admin/orders",
          element: <OrderManagement />
        },
        {
          path: "/admin/reviews",
          element: <ReviewManagement />
        },
        {
          path: "/admin/students",
          element: <StudentManagement />
        },
      ]
    },
    {
      path: "/course/:slug/learning",
      errorElement: <NotFound />,
      element: <ProtectedRoute><Learning /></ProtectedRoute>
    }
  ]);

  useEffect(() => {
    // if (content !== "") {
    //   messageApi.open({
    //     type: type,
    //     content,
    //     duration
    //   });
    // }
  }, [isShow])

  return (
    <>
      {contextHolder}
      <RouterProvider router={router} ></RouterProvider>
    </>
  )


}

export default App