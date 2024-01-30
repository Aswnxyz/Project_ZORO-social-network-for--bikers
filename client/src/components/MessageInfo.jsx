import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { IoMdClose } from "react-icons/io";
import {
  useAddUserToGroupMutation,
  useLeaveFromGroupMutation,
  useRemoveUserFromGroupMutation,
  useRenameGroupNameMutation,
} from "../utils/slices/messageApiSlice";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BsSearch } from "react-icons/bs";
import { useSearchUsersMutation } from "../utils/slices/userApiSlice";
import {
  getSenderFull,
  getSenderImage,
  getSenderName,
  getSenderUserName,
} from "../config/ChatLogics";

const MessageInfo = ({ fetchagain, setFetchAgain, setMessagesInfo }) => {
  const { selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const [renameModal, setRenameModal] = useState(false);
  const [removeUser, setRemoveUser] = useState(false);
  const [addPeopleModal, setAddPeopleModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [renameGroupName] = useRenameGroupNameMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [addUserToTheGroup] = useAddUserToGroupMutation();
  const [removeUserFromGroup] = useRemoveUserFromGroupMutation();
  const [leaveGroup] = useLeaveFromGroupMutation();

  const [searchInput, setSearchInput] = useState("");
  const [searchUser] = useSearchUsersMutation();

  const handleRename = async () => {
    try {
      const res = await renameGroupName({
        chatId: selectedChat._id,
        chatName: groupName,
      }).unwrap();
      setSelectedChat(res);
      setFetchAgain(!fetchagain);
      setGroupName("");
      setRenameModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const selectUser = (user) => {
    // Check if the user is already in the selectedUsers array
    const isUserSelected = selectedUsers.some(
      (selectedUser) => selectedUser._id === user._id
    );

    if (isUserSelected) {
      // If the user is already selected, remove them
      setSelectedUsers((prev) =>
        prev.filter((selectedUser) => selectedUser._id !== user._id)
      );
    } else {
      // If the user is not selected, add them
      setSelectedUsers((prev) => [...prev, user]);
    }
  };
  const handleSearch = async (value) => {
    try {
      const res = await searchUser({ searchInput: value }).unwrap();
      const filteredUsers = res.filter(
        (user) =>
          !selectedChat.users.some(
            (selectedUser) => selectedUser._id === user._id
          )
      );
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

  const handleAddUser = async () => {
    try {
      const selectedUserIds = selectedUsers.map((user) => user._id);
      const res = await addUserToTheGroup({
        chatId: selectedChat._id,
        selectedUsers: selectedUserIds,
      }).unwrap();
      setSelectedChat(res);
      setFetchAgain(!fetchagain);
      setSelectedUsers([]);
      setAddPeopleModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveUser = async () => {
    try {
      if (selectedChat.groupAdmin !== userInfo.id) {
        toast.error("Only admin can remove someone.!");
        return;
      }
      const res = await removeUserFromGroup({
        chatId: selectedChat._id,
        userId: removeUser._id,
      }).unwrap();
      setSelectedChat(res);
      setFetchAgain(!fetchagain);
      setRemoveUser(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      const res = await leaveGroup({ chatId: selectedChat._id }).unwrap();
      setMessagesInfo(false);
      setSelectedChat();
      setFetchAgain(!fetchagain);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setGroupName(selectedChat.chatName);
  }, []);
  return (
    <>
      <ToastContainer />
      <div className="w-96  p-4 flex flex-col min-h-screen">
        <h1 className="text-2xl font-medium">Details</h1>
        {selectedChat?.isGroupChat && (
          <div className="flex justify-between items-center my-4 py-4 border-b border-gray-600 w-full">
            <p className="text-base">Change group name </p>
            <button
              onClick={() => setRenameModal(!renameModal)}
              className="bg-gray-800 px-3 py-1 rounded-2xl"
            >
              Change
            </button>
          </div>
        )}

        {!selectedChat?.isGroupChat && (
          <hr className="h-px border-none bg-gray-600 my-6" />
        )}

        <div>
          <div className="flex justify-between">
            <p className="font-semibold text-lg">Members</p>
            {selectedChat?.isGroupChat && (
              <span
                onClick={() => setAddPeopleModal(true)}
                className="text-blue-400 "
              >
                Add people
              </span>
            )}
          </div>
          <div>
            <ul className="">
              {selectedChat?.isGroupChat ? (
                selectedChat.users.map((user) => (
                  <li key={user._id}>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex">
                        <img
                          className="h-12 rounded-full"
                          src={
                            user?.profilePic
                              ? user?.profilePic?.url
                              : "/img/profile_icon.jpeg"
                          }
                          alt=""
                        />
                        <div className="px-3">
                          <div className="">
                            <p className="text-white font-semibold">
                              {user?.userName}
                            </p>
                            <p className="text-base dark:text-gray-500 font-normal ">
                              {user?.fullName}
                            </p>
                          </div>
                        </div>
                      </div>

                      {userInfo.id !== user._id && (
                        <PiDotsThreeVerticalBold
                          onClick={() => setRemoveUser(user)}
                          size={24}
                        />
                      )}
                    </div>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex">
                        <img
                          className="h-12 rounded-full"
                          src={
                            !selectedChat.isGroupChat &&
                            getSenderImage(userInfo, selectedChat.users)
                          }
                          alt=""
                        />
                        <div className="px-3">
                          <div className="">
                            <p className="text-white font-semibold">
                              {!selectedChat.isGroupChat &&
                                getSenderUserName(userInfo, selectedChat.users)}
                            </p>
                            <p className="text-base dark:text-gray-500 font-normal ">
                              {!selectedChat.isGroupChat &&
                                getSenderName(userInfo, selectedChat.users)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
        <div className="border-t font-semibold text-red-400  mt-auto border-gray-600 p-4 ext-red space-y-4">
          {selectedChat.isGroupChat ? (
            <p onClick={handleLeaveGroup}>Leave chat </p>
          ) : (
            <p >Delete chat</p>
          )}
        </div>
      </div>
      {renameModal && (
        <div
          onClick={() => setRenameModal(false)}
          className="fixed  inset-0  bg-black  bg-opacity-25 backdrop-blur-sm flex justify-center items-center overflow-auto z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="h-auto w-[350px] text-white fixed top-32 transition-transform translate-y-6   bg-gray-800 rounded-xl "
          >
            <div className="flex justify-between items-center px-4 py-2 border-b border-gray-600">
              <h1 className="font-semibold">Change group name</h1>
              <p onClick={() => setRenameModal(false)} className=" text-end">
                <IoMdClose size={24} />
              </p>
            </div>
            <div className="p-4">
              <p className="text-sm">
                Changing the name of a group chat changes it for everyone.
              </p>
              <input
                type="text"
                className=" bg-transparent w-full my-4 p-2"
                name=""
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Add a name "
                id=""
              />
              <button
                onClick={handleRename}
                className="p-3 bg-blue-400 w-full rounded-xl"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {addPeopleModal && (
        <div
          onClick={() => setAddPeopleModal(false)}
          className="fixed  inset-0  bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center overflow-auto z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="h-auto w-[500px] text-white fixed top-16 transition-transform translate-y-6   bg-gray-800 rounded-xl "
          >
            <div className="px-2">
              <div className="flex justify-between items-center py-2">
                <div
                  onClick={() => setAddPeopleModal(false)}
                  className="flex items-center space-x-4"
                >
                  <IoMdClose size={25} />
                </div>
                <h1 className="text-xl font-semibold">Add people</h1>

                <button
                  onClick={handleAddUser}
                  className={`text-lg ${
                    selectedUsers.length > 0 ? "bg-white" : "bg-gray-600"
                  }  px-3 text-black font-semibold  rounded-2xl`}
                >
                  Next
                </button>
              </div>
              <div className="m-4">
                <div className="flex items-center space-x-3">
                  <BsSearch size={20} color="gray" />
                  <input
                    className="w-full bg-transparent focus:outline-none"
                    value={searchInput}
                    type="text"
                    placeholder="Search people"
                    onChange={handleChange}
                  />
                </div>
              </div>
              {selectedUsers.length > 0 && (
                <div className="flex">
                  {selectedUsers.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center p-1  border border-gray-600 mx-2 rounded-full bg-black"
                    >
                      <img
                        className="h-6 rounded-full"
                        src={
                          user.profilePic
                            ? user.profilePic?.url
                            : "/img/profile_icon.jpeg"
                        }
                        alt=""
                      />
                      <p className="mx-2">{user.userName}</p>

                      <IoMdClose
                        onClick={() => selectUser(user)}
                        className=""
                        size={20}
                        color="gray"
                      />
                    </div>
                  ))}
                </div>
              )}
              <hr className="border-0 h-px my-2 bg-gray-600" />

              <div className="h-96 overflow-y-auto">
                {searchInput &&
                  searchResults.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => selectUser(user)}
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
                          <p className="text-white font-semibold">
                            {user.userName}
                          </p>
                          <p className="text-base dark:text-gray-500 font-normal ">
                            {user.fullName}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {removeUser && (
        <div
          onClick={() => setRemoveUser(false)}
          className="fixed  inset-0  bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center overflow-auto z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="h-auto w-[400px] text-white fixed top-32 transition-transform translate-y-6   bg-gray-900 rounded-xl "
          >
            <div className="flex flex-col">
              <>
                <button
                  onClick={handleRemoveUser}
                  className="border-b border-gray-600 py-3 text-red-600 font-bold"
                >
                  Remove from group
                </button>
                <button onClick={() => setRemoveUser(false)} className=" py-3 ">
                  Cancel
                </button>
              </>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageInfo;
