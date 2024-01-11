// Sidebar.js

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { io } from "socket.io-client";
import { useLogoutMutation } from "../utils/slices/userApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../utils/slices/authSlice";
import {
  IoHomeSharp,
  IoLocationOutline,
  IoPeopleOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { FaBars } from "react-icons/fa";

import { BsSearch } from "react-icons/bs";
import { BsBell } from "react-icons/bs";
import { SlEnvolope } from "react-icons/sl";
import { CiSquarePlus } from "react-icons/ci";
import socket from "../utils/socket";
import messageSocket from "../utils/messageSocket";
import MoreModal from "./Modals/MoreModal";

const Sidebar = ({ setShowCreatePostModal }) => {
  const [openModal, setOpenModal] = useState(false);
  const [unreadNotifications, setunreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [logoutUser] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      const res = await logoutUser().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  messageSocket.on("connected", () =>
    console.log("connected to message socket")
  );
  messageSocket.on("message", () => setUnreadMessages(unreadMessages + 1));
  messageSocket.on("unreadMessages", (data) => {
    // console.log("unreadMessages")
    setUnreadMessages(data);
  });
  socket.on("connected", () => {
    console.log("connected");
  });
  socket.on("unreadNotifications", (data) => {
    setunreadNotifications(data);
  });
  socket.on("notification", () =>
    setunreadNotifications(unreadNotifications + 1)
  );
  socket.on("removeNotification", () => {
    setunreadNotifications(unreadNotifications - 1);
  });

  useEffect(() => {
    socket.emit("registerUser", userInfo.id);
    messageSocket.emit("registerUser", userInfo.id);
  }, []);
  return (
    <>
      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 border-r border-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-black">
          <div>
            <img
              src="/logo/zoro_official.png"
              className="h-28 pl-14"
              alt="Flowbite Logo"
            />
          </div>
          <ul className="space-y-2 font-medium">
            <li>
              <Link to="/">
                <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <IoHomeSharp
                    className=" text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    size={26}
                  />
                  <span className="ms-3 ">Home</span>
                </div>
              </Link>
            </li>
            <li>
              <Link to={"/search"}>
                <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <BsSearch
                    className=" text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    size={26}
                  />
                  <span className="flex-1 ms-3 whitespace-nowrap">Explore</span>
                </div>
              </Link>
            </li>
            <li>
              <Link to={"/notifications"}>
                <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <BsBell
                    className=" text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    size={26}
                  />
                  <span className="flex-1 ms-3 whitespace-nowrap">
                    Notifications
                  </span>
                  {unreadNotifications > 0 && (
                    <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                      {unreadNotifications}
                    </span>
                  )}
                </div>
              </Link>
            </li>
            <li>
              <Link to={"/messages"}>
                <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <SlEnvolope
                    className=" text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    size={26}
                  />
                  <span className="flex-1 ms-3 whitespace-nowrap">
                    Messages
                  </span>
                  {unreadMessages > 0 && (
                    <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                      {unreadMessages}
                    </span>
                  )}
                </div>
              </Link>
            </li>
            <li>
              <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <IoPeopleOutline
                  className=" text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  size={26}
                />
                <span className="flex-1 ms-3 whitespace-nowrap">Clubs</span>
              </div>
            </li>
            <li>
              <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <IoLocationOutline
                  className=" text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  size={26}
                />
                <span className="flex-1 ms-3 whitespace-nowrap">Events</span>
              </div>
            </li>
            <li>
              <div
                onClick={setShowCreatePostModal}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <CiSquarePlus
                  className=" text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  size={26}
                />
                <span className="flex-1 ms-3 whitespace-nowrap">Create</span>
              </div>
            </li>
            <li>
              <Link to={`/${userInfo.userName}`}>
                <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <IoPersonOutline
                    className=" text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    size={26}
                  />
                  <span className="flex-1 ms-3 whitespace-nowrap">Profile</span>
                </div>
              </Link>
            </li>
            {/* <li>
              <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <svg
                  className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z" />
                  <path d="M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18v-3.093l-1.546 1.546c-.413.413-.94.695-1.513.81l-3.4.679a2.947 2.947 0 0 1-1.85-.227 2.96 2.96 0 0 1-1.635-3.257l.681-3.397Z" />
                  <path d="M8.961 16a.93.93 0 0 0 .189-.019l3.4-.679a.961.961 0 0 0 .49-.263l6.118-6.117a2.884 2.884 0 0 0-4.079-4.078l-6.117 6.117a.96.96 0 0 0-.263.491l-.679 3.4A.961.961 0 0 0 8.961 16Zm7.477-9.8a.958.958 0 0 1 .68-.281.961.961 0 0 1 .682 1.644l-.315.315-1.36-1.36.313-.318Zm-5.911 5.911 4.236-4.236 1.359 1.359-4.236 4.237-1.7.339.341-1.699Z" />
                </svg>
                <span
                  onClick={handleLogout}
                  className="flex-1 ms-3 whitespace-nowrap"
                >
                  Logout
                </span>
              </div>
            </li> */}
          </ul>
          <div
            onClick={() => setOpenModal(!openModal)}
            className="flex absolute bottom-0 mb-4 space-x-4 items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <FaBars
              className=" text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
              size={26}
            />
            <span className="flex-1 ms-3 whitespace-nowrap">More</span>
          </div>
          {openModal && (
            <MoreModal
              logout={handleLogout}
              onClose={() => setOpenModal(false)}
            />
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
