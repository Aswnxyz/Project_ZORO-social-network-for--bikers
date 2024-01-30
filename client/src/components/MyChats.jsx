import React, { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { IoIosArrowRoundBack } from "react-icons/io";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { IoCreateOutline } from "react-icons/io5";
import { LuDot } from "react-icons/lu";
import { MdEmojiEmotions } from "react-icons/md";
import { useSelector } from "react-redux";
import { useActionData } from "react-router-dom";
import { useSearchUsersMutation } from "../utils/slices/userApiSlice";
import {
  useAccessChatMutation,
  useGetRecentChatsMutation,
} from "../utils/slices/messageApiSlice";
import { ChatState } from "../Context/ChatProvider";
import {  getSenderImage, getSenderName } from "../config/ChatLogics";
import CreateGroup from "./Modals/createGroup";

const MyChats = ({ fetchagain, setMessagesInfo }) => {
  const [searchClicked, setSearchClicked] = useState(false);
  const [createGroupModal, setCreateGroupModal] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [accessChat] = useAccessChatMutation();
  const [searchUser] = useSearchUsersMutation();
  const [getRecentChats, { isLoading }] = useGetRecentChatsMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const { selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const handleSearch = async (value) => {
    try {
      const res = await searchUser({ searchInput: value }).unwrap();
      const filteredUsers = res.filter((user) => userInfo.following.includes(user._id) );
      setSearchResults(filteredUsers);
    } catch (error) {
      console.error(error);
    }
  };
  const handleChange = (e) => {
    const { value } = e.target;
    setSearchInput(value);

    handleSearch(value); // Trigger search on each change
  };

  const handleAccessChat = async (userId) => {
    try {
      console.log(userId)
      const res = await accessChat({ userId }).unwrap();
      if (!chats.find((c) => c._id === res._id)) setChats([res, ...chats]);

      setSelectedChat(res);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchData = async () => {
    try {
      const res = await getRecentChats().unwrap();
      setChats(res);
    } catch (error) {}
  };
  useEffect(() => {
    fetchData();
  }, [fetchagain]);
  return (
    <>
      <div className="w-1/4 border-r  border-gray-800 dark:border-gray-700 p-4 z-0">
        <div className="flex justify-between ">
          <h1 className="text-xl mb-4 text-white font-semibold">Messages</h1>
          <IoCreateOutline
            onClick={() => setCreateGroupModal(true)}
            className="font-bold"
            size={24}
          />
        </div>
        <div className="flex">
          {searchClicked && (
            <IoIosArrowRoundBack
              onClick={() => {
                setSearchInput("");
                setSearchClicked(false);
                setSearchResults([]);
              }}
              className="mt-2 mr-2"
              size={27}
            />
          )}
          <div
            onClick={() => setSearchClicked(true)}
            className={`  p-2 rounded-full mb-4 ${
              searchClicked
                ? "border-blue-600 border-2"
                : "border-gray-400 border"
            }`}
          >
            <div className="flex items-center space-x-3">
              <BsSearch size={20} color="gray" />
              <input
                className="w-full bg-transparent focus:outline-none"
                value={searchInput}
                type="text"
                placeholder="Search"
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        {searchClicked ? (
          searchResults.length > 0 ? (
            searchResults.map((user) => (
              <div
                key={user._id}
                onClick={() => handleAccessChat(user._id)}
                className="flex m-4"
              >
                <img
                  className="h-12 rounded-full"
                  src={
                    user.profilePic
                      ? user.profilePic?.url
                      : "/img/profile_icon.jpeg"
                  }
                  alt=""
                />
                <div className="px-3">
                  <div className="">
                    <p className="text-white font-semibold">{user.userName}</p>
                    <p className="text-base dark:text-gray-500 font-normal ">
                      {user.fullName}
                    </p>
                  </div>
                </div>
              </div>
              // </Link>
            ))
          ) : (
            <p className="text-center mt-6  text-sm text-gray-500">
              Try searching for people, groups
            </p>
          )
        ) : chats ? (
          <ul className="mb-2">
            {chats.map((chat) => (
              <li key={chat._id} className="">
                <div
                  onClick={() => {
                    setSelectedChat(chat);
                    setMessagesInfo(false);
                  }}
                  className="flex items-center  p-2 "
                >
                  <img
                    className="h-12 rounded-full"
                    src={
                      !chat.isGroupChat
                        ? getSenderImage(userInfo, chat.users)
                        : "/img/profile_icon.jpeg"
                    }
                    alt=""
                  />
                  <div className="px-3">
                    <div className="">
                      <p className="text-white ">
                        {!chat.isGroupChat
                          ? getSenderName(userInfo, chat.users)
                          : chat.chatName}
                      </p>

                      <div className="flex">
                        {/* <p
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
                        </p> */}
                        <p className="text-sm">
                          {chat?.latestMessage?.sender === userInfo.id
                            ? "You: " + chat?.latestMessage?.content
                            : chat?.latestMessage?.content}
                        </p>
                        {/* <LuDot className="pr-2 text-gray-400" size={24} />
                        <span className="text-sm dark:text-gray-400 font-extralight ">
                          {formatRelativeTime(user?.lastMessage?.timestamp)}
                        </span> */}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <span className="flex justify-center items-center mr-6">
            <AiOutlineLoading3Quarters className=" animate-spin" size={24} />
          </span>
        )}
      </div>
      {createGroupModal && (
        <CreateGroup onClose={() => setCreateGroupModal(false)} />
      )}
    </>
  );
};

export default MyChats;
