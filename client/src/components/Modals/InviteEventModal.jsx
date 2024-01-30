import React, { useState } from "react";
import { useSearchUsersMutation } from "../../utils/slices/userApiSlice";
import { useSelector } from "react-redux";
import { IoMdClose } from "react-icons/io";
import { useInviteToEventMutation } from "../../utils/slices/EventApiSlice";

const InviteEventModal = ({ onClose, eventId }) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchUser] = useSearchUsersMutation();
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);
  const [inviteToEvent] = useInviteToEventMutation();

  const handleSearch = async (value) => {
    try {
      const res = await searchUser({ searchInput: value }).unwrap();
      const filteredUsers = res.filter((user) => user._id !== userInfo.id);
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
  const handleInviteFollowers = async () => {
    try {
      const selectedUsersIds = selectedUsers.map((user) => user._id);

      const res = await inviteToEvent({ selectedUsersIds,eventId }).unwrap();
      console.log(res);
      onClose()
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      onClick={() => {}}
      className="fixed  inset-0  bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center overflow-auto z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="h-[400px] w-[500px] text-white  fixed top-8 transition-transform translate-y-6 px-5 pt-2 bg-gray-800 rounded-xl "
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <IoMdClose onClick={onClose} size={24} />
            <h1 className="text-center text-xl font-semibold">Invite people</h1>
          </div>
          <button
            onClick={() =>
              selectedUsers.length > 0 ? handleInviteFollowers() : ""
            }
            className={`${
              selectedUsers.length > 0 ? "bg-blue-600" : "bg-gray-400"
            } px-3 py-1 text-sm rounded-3xl`}
          >
            Send invites
          </button>
        </div>
        <div>
          {" "}
          <input
            type="text"
            value={searchInput}
            className="p-3 w-full bg-transparent outline-none"
            placeholder="Enter name or username"
            onChange={handleChange}
          />
        </div>
        <div className="mt-2">
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
        </div>
        <div className="max-h-[175px] overflow-y-auto">
          {searchResults.map((user) => (
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
                  <p className="text-white font-semibold">{user.userName}</p>
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
  );
};

export default InviteEventModal;
