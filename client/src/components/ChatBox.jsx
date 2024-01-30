import React, { useEffect, useState } from "react";

import { ChatState } from "../Context/ChatProvider";

import { useSelector } from "react-redux";
import MessageInfo from "./MessageInfo";

import SingleChat from "./SingleChat";

const ChatBox = ({
  fetchagain,
  setFetchAgain,
  messageInfo,
  setMessagesInfo,
}) => {
  const { selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <>
      <div className="w-3/4 py-2 flex flex-col border-gray-800 dark:border-gray-700 border-r relative z-10">
        {/* {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
          <ImSpinner2 className="animate-spin" size={27} />
        </div>
      )} */}
        {selectedChat ? (
          <SingleChat
            messageInfo={messageInfo}
            setMessagesInfo={setMessagesInfo}
            fetchagain={fetchagain}
            setFetchAgain={setFetchAgain}
          />
        ) : (
          <div className="flex justify-center items-center h-screen">
            <h1 className="text-3xl font-bold">Select a message</h1>
          </div>
        )}
      </div>
      {messageInfo && (
        <MessageInfo
          setMessagesInfo={setMessagesInfo}
          fetchagain={fetchagain}
          setFetchAgain={setFetchAgain}
        />
      )}
    </>
  );
};

export default ChatBox;
