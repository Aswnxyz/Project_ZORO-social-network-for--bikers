import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Home from "./pages/users/Home";
import Login from "./pages/users/Login";
import Register from "./pages/users/Register";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import store from "./utils/store";
import OTPVerificationPage from "./pages/users/OTPVerificationPage";
import AuthLayout from "./components/AuthLayout";
import Error from "./components/Error";
import AdminAppLayout from "./components/AdminAppLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import AdminAuthLayout from "./components/AdminAuthLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import Profile from "./pages/users/Profile";
import PostManagement from "./pages/admin/PostManagement";
import Explore from "./pages/users/Explore";
import Notifications from "./pages/users/Notifications";
import Messages from "./pages/users/Messages";
import Settings from "./components/Settings";
import YourAccount from "./components/YourAccount";
import AccountInformation from "./components/AccountInformation";
import ChangeYourPassword from "./components/ChangeYourPassword";
import AccountPrivacy from "./components/AccountPrivacy";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "otp-verification/:email",
        element: <OTPVerificationPage />,
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/",
            element: <Home />,
          },
          {
            path: "/search",
            element: <Explore />,
          },
          {
            path: "/:userName",
            element: <Profile />,
          },
          {
            path: "/notifications",
            element: <Notifications />,
          },
          {
            path: "/messages",
            element: <Messages />,
          },
          {
            path: "/messages/:userId",
            element: <Messages />,
          },
          {
            path: "/settings",
            element: <Settings />,
            children: [
              {
                path: "account",
                element: <YourAccount />,
              },
              {
                path: "your-zoro-account",
                element: <AccountInformation />,
              },
              {
                path: "password",
                element: <ChangeYourPassword />,
              },
              {
                path: "privacy-setting",
                element:<AccountPrivacy/>
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminAppLayout />,
    children: [
      {
        element: <AdminAuthLayout />,
        children: [
          {
            path: "",
            element: <AdminDashboard />,
          },
          {
            path: "users",
            element: <UserManagement />,
          },
          {
            path: "posts",
            element: <PostManagement />,
          },
        ],
      },
      {
        path: "login",
        element: <AdminLogin />,
      },
    ],
  },
]);

const App = () => {
  return (
    <GoogleOAuthProvider clientId="269741526603-9fhnome52gfetuagivuf2amaf8u1emar.apps.googleusercontent.com">
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </GoogleOAuthProvider>
  );
};

export default App;
