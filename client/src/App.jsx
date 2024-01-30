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
import ChatProvider from "./Context/ChatProvider";
import Clubs from "./pages/users/Clubs";
import YourCommunities from "./components/YourCommunities";
import ClubBox from "./components/ClubBox";
import DiscoverCommunities from "./components/DiscoverCommunities";
import Events from "./pages/users/Events";
import EventsHome from "./components/EventsHome";
import EventBox from "./components/EventBox";
import YourEvents from "./components/YourEvents";
import VideoCall from "./pages/users/VideoCall";
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
          // {
          //   path: "/messages/:userId",
          //   element: <Messages />,
          // },
          {
            path: "/clubs",
            element: <Clubs />,
            children: [
              {
                path: "joins",
                element: <YourCommunities />,
              },
              {
                path: ":communityId",
                element: <ClubBox />,
              },
              {
                path: "discover",
                element: <DiscoverCommunities />,
              },
            ],
          },
          {
            path: "/events",
            element: <Events />,
            children: [
              { path: "", element: <EventsHome /> },
              { path: ":eventId", element: <EventBox /> },
              {path:"going",element:<YourEvents/>},
              {path:"interested",element:<YourEvents/>},
              {path:"invites",element:<YourEvents/>},
              {path:"hosting",element:<YourEvents/>},
            ],
          },
          {
            path:"/call/:roomId",
            element:<VideoCall/>
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
                element: <AccountPrivacy />,
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
        <ChatProvider>
          <RouterProvider router={router} />
        </ChatProvider>
      </Provider>
    </GoogleOAuthProvider>
  );
};

export default App;
