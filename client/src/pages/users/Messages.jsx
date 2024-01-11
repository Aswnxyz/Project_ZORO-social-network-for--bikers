import React, { useEffect, useRef, useState, useTransition } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useSelector } from "react-redux";
import { IoMdSend } from "react-icons/io";
import io from "socket.io-client";
import { Link, useParams } from "react-router-dom";
import { useGetUserDataMutation } from "../../utils/slices/userApiSlice";
import { useGetRecentChattedUsersMutation } from "../../utils/slices/messageApiSlice";
import { ImSpinner2 } from "react-icons/im";
import { LuDot } from "react-icons/lu";
import { MdEmojiEmotions } from "react-icons/md";

const Messages = () => {
  const [socket, setSocket] = useState(null);
  const { userInfo } = useSelector((state) => state.auth);
  const { userId } = useParams();
  const [getUserData, { isLoading }] = useGetUserDataMutation();
  const [recentChats] = useGetRecentChattedUsersMutation();
  const [userData, setUserData] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [recentChattedUsers, setRecentChattedUsers] = useState([]);
  const messagesContainerRef = useRef(null);
  const [showEmoji, setShowEmoji] = useState(false);

  const isSendButtonDisabled = inputMessage.trim() === "";

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

  const fetchRecentChattedUsers = async () => {
    try {
      const res = await recentChats().unwrap();
      setRecentChattedUsers(res);
    } catch (error) {
      console.log(error.data);
    }
  };

  const fetchData = async (userId) => {
    try {
      const res = await getUserData({ userId }).unwrap();
      setUserData(res.user);
      setMessages(res.messages);
    } catch (error) {
      console.log(error.data);
    }
  };

  const sendMessage = () => {
    if (socket && inputMessage.trim() !== "") {
      const messageData = {
        sender: userInfo.id,
        receiver: userId,
        content: inputMessage,
        timestamp: new Date(),
      };
      setRecentChattedUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user["0"]._id === userId) {
            return {
              ...user,
              lastMessage: messageData,
            };
          }
          return user;
        })
      );
      const userExists = recentChattedUsers.some(
        (user) => user["0"]._id === userId
      );

      // If the user is not in recentChattedUsers, add them
      if (!userExists) {
        setRecentChattedUsers((prevUsers) => [
          {
            0: userData, // Assuming userData is the user object
            lastMessage: messageData,
          },
          ...prevUsers,
        ]);
      }
      socket.emit("message", messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setInputMessage("");
    }
  };

  //ADD EMOJI
  const addEmoji = (e) => {
    const sym = e.unified.split("_");
    const codeArray = [];
    sym.forEach((el) => codeArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codeArray);
    setInputMessage(inputMessage + emoji);
  };

  const handleReadMessage = async (userId) => {
    try {
      socket.emit("readMessage", { sender: userId, receiver: userInfo.id });
      const updatedRecentChattedUsers = recentChattedUsers.map((user) => {
        if (user["0"]._id === userId) {
          return {
            ...user,
            lastMessage: {
              ...user.lastMessage,
              read: true,
            },
          };
        }
        return user;
      });

      setRecentChattedUsers(updatedRecentChattedUsers);
    } catch (error) {
      console.log(error.data);
    }
  };

  useEffect(() => {
    const newSocket = io("http://localhost:8004");

    newSocket.on("connected", () => console.log("connected to message socket"));

    setSocket(newSocket);
    newSocket.emit("registerUser", userInfo.id);
    newSocket.on("message", (message) => {
      if (message.sender === userData?._id) {
        setMessages((prevMessages) => [...prevMessages, message.text]);
      }
      // if (userId) {
      //       socket.emit("readMessage",{  
      //         sender: userId,
      //         receiver: userInfo.id,
      //       });

      // }

      // Update user data with the latest message
      const updatedRecentChattedUsers = recentChattedUsers.map((user) => {
        if (user["0"]._id === message.sender) {
          return {
            ...user,
            lastMessage: message.text,
          };
        }
        return user;
      });

      setRecentChattedUsers(updatedRecentChattedUsers);
    });

    newSocket.on("messageSeened", (userId) => {
      console.log("seened");
      if (userData?._id === userId) {
        const updatedMessages = messages.map((message) => {
          if (!message.read) {
            return {
              ...message,
              read: true,
            };
          }
          return message;
        });

        setMessages(updatedMessages);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [userInfo.id, userData, userId, recentChattedUsers]);

  useEffect(() => {
    if (userId) {
      fetchData(userId);
    }
    fetchRecentChattedUsers();
  }, [userId]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);
  return (
    <>
      <div className="flex  h-screen text-white">
        <div className="w-1/4 border-r  border-gray-800 dark:border-gray-700 p-4 z-0">
          <h1 className="text-xl mb-4 text-white font-semibold">Messages</h1>
          <ul className="mb-2">
            {recentChattedUsers.map((user) => (
              <Link
                onClick={() => handleReadMessage(user["0"]._id)}
                key={user["0"]._id}
                to={`/messages/${user["0"]._id}`}
              >
                <li key={user["0"]._id} className="">
                  <div className="flex items-center  p-2 ">
                    <img
                      className="h-14 rounded-full"
                      src={
                        user["0"].profilePic
                          ? user["0"].profilePic?.url
                          : "/img/profile_icon.jpeg"
                      }
                      alt=""
                    />
                    <div className="px-3">
                      <div className="">
                        <p className="text-white ">{user["0"].fullName}</p>

                        <div className="flex">
                          <p
                            className={`text-sm  ${
                              user?.lastMessage?.sender !== userInfo.id &&
                              !user?.lastMessage?.read
                                ? "text-white font-bold"
                                : "text-gray-400 font-extralight"
                            }  overflow-hidden overflow-ellipsis`}
                          >
                            {user?.lastMessage?.sender === userInfo.id
                              ? "You:" + user.lastMessage.content
                              : user?.lastMessage?.content}
                          </p>
                          <LuDot className="pr-2 text-gray-400" size={24} />
                          <span className="text-sm dark:text-gray-400 font-extralight ">
                            {formatRelativeTime(user?.lastMessage?.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </Link>
            ))}
          </ul>
        </div>

        <div className="w-3/4 py-2 flex flex-col border-gray-800 dark:border-gray-700 border-r relative z-10">
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
              <ImSpinner2 className="animate-spin" size={27} />
            </div>
          )}
          {userData ? (
            <>
              {" "}
              <div className=" rounded border-b  border-gray-800 dark:border-gray-700  p-2 ">
                <div className="flex items-center ">
                  <img
                    className="h-12 rounded-full"
                    src={
                      userData?.profilePic
                        ? userData.profilePic?.url
                        : "/img/profile_icon.jpeg"
                    }
                    alt=""
                  />
                  <div className="px-3">
                    <div className="">
                      <p className="text-white font-semibold">
                        {userData.fullName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* MIDDLE SECTION */}
              <div
                ref={messagesContainerRef}
                className="flex-1  overflow-y-auto "
              >
                <div className="flex flex-col items-center my-10 justify-center">
                  <img
                    className="h-24 rounded-full"
                    src={
                      userData?.profilePic
                        ? userData.profilePic?.url
                        : "/img/profile_icon.jpeg"
                    }
                    alt=""
                  />
                  <div className="py-3 text-center">
                    <h1 className="font-bold">{userData?.fullName}</h1>
                    <p className="font-thin text-sm text-gray-400">
                      @{userData?.userName}
                    </p>
                  </div>
                </div>

                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-2  ${
                      message.sender === userInfo.id ? "text-right" : ""
                    }`}
                  >
                    <div
                      className={`inline-block mx-3 px-4 py-2 rounded-full ${
                        message.sender === userInfo.id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-800 text-gray-200"
                      }`}
                    >
                      {message.content}
                    </div>
                    {messages.length - 1 === index &&
                    message.sender === userInfo.id &&
                    message.read ? (
                      <p className="text-sm text-gray-400 mr-4">Seen</p>
                    ) : null}
                  </div>
                ))}
              </div>
              <div className=" mt-auto mx-4 flex px-4 py-2 rounded-full border items-center border-gray-800 dark:border-gray-700">
                <p onClick={() => setShowEmoji(!showEmoji)}>
                  <MdEmojiEmotions size={24} />
                </p>
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={inputMessage}
                  className="flex-1 bg-transparent focus:outline-none rounded p-2"
                  onChange={(e) => setInputMessage(e.target.value)}
                />
                <p
                  onClick={isSendButtonDisabled ? null : sendMessage}
                  className={`ml-2 px-4 py-2 ${
                    isSendButtonDisabled
                      ? "text-red-400 cursor-not-allowed"
                      : "text-red-600 "
                  } rounded `}
                >
                  <IoMdSend size={27} />
                </p>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center h-screen">
              <h1 className="text-3xl font-bold">Select a message</h1>
            </div>
          )}
          {showEmoji && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-20 left-0"
            >
              <Picker
                data={data}
                onEmojiSelect={addEmoji}
                emojiSize={20}
                emojiButtonSize={30}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Messages;
