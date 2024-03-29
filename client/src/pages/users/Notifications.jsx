import React, { useEffect, useState } from "react";
import RightSidebar from "../../components/RightSidebar";
import { useSelector } from "react-redux";
import { useGetNoficationsMutation } from "../../utils/slices/notificationApiSlice";
import socket from "../../utils/socket";
import { useManageFollowRequestMutation } from "../../utils/slices/userApiSlice";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);
  const [getNotfications, { isLoading }] = useGetNoficationsMutation();
  const [manageFollowRequest] = useManageFollowRequestMutation();

  function formatRelativeTime(timestamp) {
    const now = new Date();
    const createdDate = new Date(timestamp);
    const timeDiff = now - createdDate;

    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return days === 1 ? "1d" : `${days}d`;
    } else if (hours > 0) {
      return hours === 1 ? "1h" : `${hours}h`;
    } else if (minutes > 0) {
      return minutes === 1 ? "1m" : `${minutes}m`;
    } else {
      return "now";
    }
  }

  const handleFollowRequest = async (senderId, action) => {
    try {
      const res = await manageFollowRequest({ senderId, action }).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      const res = await getNotfications().unwrap();
      setNotifications(res);
    } catch (error) {
      console.log(error.data);
    }
  };

  useEffect(() => {
    socket.emit("clearUnreadNotifications", userInfo.id);
    socket.on("notification", (newNotification) => {
      console.log('new notf')
      setNotifications((prev) => [newNotification, ...prev]);
    });
    socket.on("removeNotification", (_id) => {
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification._id !== _id)
      );
    });

    fetchData();
  }, []);
  return (
    <div className="w-[53rem] text-white px-28 py-3 z-10">
      {" "}
      <h1 className=" text-2xl font-semibold py-4">Notifications</h1>
      <div>
        {/* <p>Today</p> */}
        {!notifications.length && !isLoading && <h1 className="text-center mt-20 text-3xl font-semibold inset-0">No new notificatons</h1>}
        {notifications.map((notification, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex items-center  py-4">
              <img
                className="h-12 rounded-full mr-4"
                src={
                  notification.senderDetails?.profilePic
                    ? notification.senderDetails?.profilePic?.url
                    : "/img/profile_icon.jpeg"
                }
                alt=""
              />

              <p className="text-white font-bold">
                {notification.senderDetails?.userName}
              </p>
              <p className="px-3 text-sm">{notification.content}</p>
              <span className="text-gray-400">
                {formatRelativeTime(notification.timestamp)}
              </span>
            </div>
            {notification.type === "followRequest" && (
              <div className="space-x-4">
                <button
                  onClick={() => handleFollowRequest(notification.sender, true)}
                  className="bg-blue-600 px-2 py-1 rounded-3xl  text-gray-200"
                >
                  Confirm
                </button>
                <button
                  onClick={() =>
                    handleFollowRequest(notification.sender, false)
                  }
                  className="bg-gray-800 px-2 py-1 rounded-3xl text-gray-200"
                >
                  Delete
                </button>
              </div>
            )}
            <div>
              <img
                className="h-16"
                src={notification.postDetails?.mediaUrl}
                alt=""
              />
            </div>
          </div>
        ))}
      </div>
      <RightSidebar />
    </div>
  );
};

export default Notifications;
