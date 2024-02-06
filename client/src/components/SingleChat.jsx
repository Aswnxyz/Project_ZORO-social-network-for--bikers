import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { IoIosArrowRoundBack, IoMdSend } from "react-icons/io";
import { ImInfo } from "react-icons/im";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { MdEmojiEmotions } from "react-icons/md";
import { ChatState } from "../Context/ChatProvider";
import {
  getSenderImage,
  getSenderName,
  getSenderUserName,
} from "../config/ChatLogics";
import { useSelector } from "react-redux";
import {
  useGetMessagesMutation,
  useSendMessageMutation,
} from "../utils/slices/messageApiSlice";
import io from "socket.io-client";
import { useFetcher, useNavigate } from "react-router-dom";
import { LuDot } from "react-icons/lu";
import { BsThreeDots } from "react-icons/bs";
import { IoCall, IoVideocamOutline } from "react-icons/io5";
import { PiVideoCameraBold } from "react-icons/pi";

const ENDPOINT = "http://localhost:8004";

let socket, selectedChatCompare;

const SingleChat = ({
  messageInfo,
  setMessagesInfo,
  fetchagain,
  setFetchAgain,
}) => {
  const {
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const { userInfo } = useSelector((state) => state.auth);
  const [videoCall, setVideoCall] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [sendMessage] = useSendMessageMutation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [getMessages] = useGetMessagesMutation();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef(null);
  const navigate = useNavigate();

  // //ADD EMOJI
  const addEmoji = (e) => {
    const sym = e.unified.split("_");
    const codeArray = [];
    sym.forEach((el) => codeArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codeArray);
    setNewMessage(newMessage + emoji);
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const handleSendMessage = async () => {
    try {
      socket.emit("stop typing", selectedChat._id);
      setNewMessage("");
      const res = await sendMessage({
        content: newMessage,
        chatId: selectedChat._id,
      }).unwrap();
      socket.emit("new message", res);
      setMessages([...messages, res]);
      setFetchAgain(!fetchagain);
    } catch (error) {}
  };
  const handleVideoCall = async () => {
    try {
      socket.emit("video_call", selectedChat._id);
      navigate(`/call/${selectedChat._id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMessages = async () => {
    try {
      if (!selectedChat) return;
      const res = await getMessages(selectedChat._id).unwrap();
      setMessages(res);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log(error);
    }
  };
  const renderMessageTimestamp = (currentTimestamp, nextTimestamp) => {
    if(!currentTimestamp || !nextTimestamp){
      return null
    }
    const currentTime = new Date(currentTimestamp);
    const nextTime = new Date(nextTimestamp);

    // Calculate the time difference in minutes
    const timeDifference = Math.floor((nextTime - currentTime) / (1000 * 60));

    if (timeDifference > 30) {
      // If the time difference is greater than 30 minutes, display the previous message timestamp
      return <span className="">{currentTime.toLocaleString()}</span>;
    }

    return null; // If the time difference is not greater than 30 minutes, don't display anything
  };
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", userInfo.id);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    socket.on("recieveVideoCall", (id) => {
      console.log("recieved");
      // navigate(`/call/${id}`);
      setVideoCall(id);
      setTimeout(() => {
        setVideoCall("");
      }, 10000);
    });
  }, []);
  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          // setNotification([newMessageRecieved, ...notification]);
        }
        setFetchAgain(!fetchagain);
      } else {
        setMessages([...messages, newMessageRecieved]);
        console.log(setFetchAgain);
        setFetchAgain(!fetchagain);
      }
    });
  });

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <div className=" rounded border-b  border-gray-800 dark:border-gray-700  p-2  ">
        <div className="flex justify-between items-center px-3">
          <div className="flex items-center">
            {" "}
            <img
              className="h-12 rounded-full"
              src={
                !selectedChat.isGroupChat
                  ? getSenderImage(userInfo, selectedChat.users)
                  : "/img/profile_icon.jpeg"
              }
              alt=""
            />
            <div className="px-3">
              <div className="">
                <p className="text-white font-semibold">
                  {!selectedChat.isGroupChat
                    ? getSenderName(userInfo, selectedChat.users)
                    : selectedChat.chatName}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {videoCall !== selectedChat._id ? (
              <IoVideocamOutline
                onClick={handleVideoCall}
                className=""
                size={32}
              />
            ) : (
              <div
                onClick={() => navigate(`/call/${selectedChat._id}`)}
                className="flex space-x-2 items-center px-4 py-1 bg-green-400 rounded-3xl"
              >
                <span className="">Join</span>
                <IoCall />
              </div>
            )}

            <ImInfo
              onClick={() => setMessagesInfo(!messageInfo)}
              className=""
              size={24}
            />
          </div>
        </div>
      </div>
      {/* MIDDLE SECTION */}
      <div ref={messagesContainerRef} className="flex-1  overflow-y-auto ">
        <div className="flex flex-col items-center my-10 justify-center">
          <img
            className="h-24 rounded-full"
            src={
              !selectedChat.isGroupChat
                ? getSenderImage(userInfo, selectedChat.users)
                : "/img/profile_icon.jpeg"
            }
            alt=""
          />

          <div className="py-3 text-center">
            <h1 className="font-bold">
              {!selectedChat.isGroupChat
                ? getSenderName(userInfo, selectedChat.users)
                : selectedChat.chatName}
            </h1>
            <p className="font-thin text-sm text-gray-400">
              {!selectedChat.isGroupChat &&
                "@" + getSenderUserName(userInfo, selectedChat.users)}
            </p>
          </div>
        </div>

        {messages &&
          messages.map((message, index) => (
            <>
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

                {/* {messages.length - 1 === index &&
              message.sender === userInfo.id &&
              message.read ? (
                <p className="text-sm text-gray-400 mr-4">Seen</p>
              ) : null} */}
              </div>
              <div className="text-center">
                <div className="text-center font-medium text-xs mb-2 text-gray-400">
                  {renderMessageTimestamp(
                    message?.createdAt,
                    messages[index + 1]?.createdAt
                  )}
                </div>
              </div>
            </>
          ))}
        {isTyping && (
          <p className="px-3 ">
            <BsThreeDots className="animate-pulse" size={27} />
          </p>
        )}
      </div>
      <div className=" mt-auto mx-4 flex px-4 py-2 rounded-full border items-center border-gray-800 dark:border-gray-700">
        <p onClick={() => setShowEmoji(!showEmoji)}>
          <MdEmojiEmotions size={24} />
        </p>
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
          className="flex-1 bg-transparent focus:outline-none rounded p-2"
          onChange={typingHandler}
        />
        <p
          onClick={handleSendMessage}
          className={`ml-2 px-4 py-2 ${
            !newMessage ? "text-red-400 cursor-not-allowed" : "text-red-600 "
          } rounded `}
        >
          <IoMdSend size={27} />
        </p>
      </div>
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
    </>
  );
};

export default SingleChat;
