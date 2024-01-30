import React, { useRef, useState } from "react";
import { BsCloudSnowFill, BsSearch } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useSearchUsersMutation } from "../../utils/slices/userApiSlice";
import { VscDeviceCamera } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { useCreateGroupMutation } from "../../utils/slices/messageApiSlice";
import { ChatState } from "../../Context/ChatProvider";

const CreateGroup = ({ onClose, setGroup }) => {
  const [searchInput, setSearchInput] = useState("");
  const [secondPage, setSecondPage] = useState(false);
  const [searchUser] = useSearchUsersMutation();
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);
  const [image, setImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [createGroup, { isLoading }] = useCreateGroupMutation();
  const [groupName, setGroupName] = useState("");
  const fileInputRef = useRef(null);
  const { selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

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

  const handleImage = (event) => {
    const file = event.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleCreateGroup = async () => {
    try {
      const formData = new FormData();
      // formData.append("image", image);
      // formData.append("name", groupName);
      const selectedUsersIds = selectedUsers.map((user) => user._id);
      // selectedUsersIds.forEach((userId, index) => {
      //   formData.append(`selectedUsers[${index}]`, userId);
      // });
      // formData.append("users", JSON.stringify(selectedUsers.map((u) => u._id)));
      const res = await createGroup({name:groupName,users:selectedUsersIds}).unwrap();
      console.log(res);
      setChats((prev) => [res, ...prev]);
      onClose();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed  inset-0  bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center overflow-auto z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="h-auto w-[500px] text-white fixed top-16 transition-transform translate-y-6   bg-gray-800 rounded-xl "
      >
        <div className="px-2">
          <div className="flex justify-between items-center py-2">
            <div onClick={onClose} className="flex items-center space-x-4">
              <IoMdClose size={25} />
            </div>
            <h1 className="text-xl font-semibold">New group</h1>

            <button
              onClick={() =>
                selectedUsers.length > 1
                  ? !secondPage
                    ? setSecondPage(true)
                    : handleCreateGroup()
                  : ""
              }
              className={`text-lg ${
                selectedUsers.length > 1 ? "bg-white" : "bg-gray-600"
              }  px-3 text-black font-semibold  rounded-2xl`}
            >
              {!secondPage ? "next" : "Create"}
            </button>
          </div>

          {!secondPage && (
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
          )}
          {selectedUsers.length > 0 && (
            <div className="flex">
              {selectedUsers.map((user) => (
                <div className="flex items-center p-1  border border-gray-600 mx-2 rounded-full bg-black">
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
                  {!secondPage && (
                    <IoMdClose
                      onClick={() => selectUser(user)}
                      className=""
                      size={20}
                      color="gray"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
          <hr className="border-0 h-px my-2 bg-gray-600" />

          {!secondPage && (
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
          )}
          {secondPage && (
            <div className="h-96 pt-2">
              <div className="flex items-center space-x-3">
                {!selectedImage ? (
                  <div
                    onClick={handleImageClick}
                    className="p-4 border border-gray-600 rounded-full bg-gray-900"
                  >
                    <VscDeviceCamera size={20} />
                  </div>
                ) : (
                  <img
                    onClick={handleImageClick}
                    className="rounded-full"
                    src={selectedImage}
                    ull
                    alt="Selected"
                    style={{ width: "50px", height: "50px" }}
                  />
                )}
                <p>
                  add group icon{" "}
                  <span className="text-gray-400">(optional)</span>
                </p>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleImage}
                />
              </div>
              <div className="my-4">
                <p>Provide a group name </p>
                <input
                  type="text"
                  value={groupName}
                  className="w-64 px-3 h-10 mt-3 rounded-lg outline-gray-700 bg-gray-900"
                  placeholder="Group name"
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;
