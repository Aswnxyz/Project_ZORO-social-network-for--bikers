import React, { useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { VscDeviceCamera } from "react-icons/vsc";
import { useSearchUsersMutation } from "../../utils/slices/userApiSlice";
import { useSelector } from "react-redux";
import { useCreateCommunityMutation } from "../../utils/slices/communityApiSlice";

const CreateClubModal = ({ onClose }) => {
  const [inviteFollowers, setInviteFollowers] = useState(false);
  const [communityName, setCommunityName] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [image, setImage] = useState(null);
  const [createCommunity] = useCreateCommunityMutation();

  const [searchUser] = useSearchUsersMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImage = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
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

  console.log();

  const handleCreateCommunity = async () => {
    console.log("issue is here");

    if (!communityName) return;
    try {
      const selectedUsersIds = selectedUsers.map((user) => user._id);
      console.log("request sended");
      const res =await createCommunity({
        communityName,
        image, 
        selectedUsersIds,
      }).unwrap();
      console.log("request success");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      onClick={onClose}
      className="fixed inset-0  bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center overflow-auto z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="h-auto w-[700px]  fixed top-16 transition-transform translate-y-6 px-5 pt-2 pb-10 bg-gray-800  rounded-xl  "
      >
        <div className="flex justify-between py-2 ">
          <div className="flex items-center  space-x-4">
            <p onClick={onClose}>
              <IoMdClose size={25} />
            </p>
            <h1 className="text-lg font-semibold">Create community</h1>
          </div>

          <button
            onClick={handleCreateCommunity}
            className=" font-semibold px-5 py-1 text-black bg-white rounded-2xl"
          >
            Create
          </button>
        </div>
        <div>
          <div className="h-52 w-auto flex justify-center items-center bg-black">
            {!image ? (
              <span
                onClick={handleImageClick}
                className="p-4 rounded-full bg-gray-800"
              >
                <VscDeviceCamera size={27} />
              </span>
            ) : (
              <img className="w-full h-full" src={image} />
            )}

            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleImage}
            />
          </div>
          <div className="">
            <input
              onClick={() => setInviteFollowers(false)}
              type="text"
              name=""
              value={communityName}
              onChange={(e) => setCommunityName(e.target.value)}
              className="p-3 w-full my-4 bg-black"
              placeholder="Community name"
              id=""
            />
            <div
              onClick={() => setInviteFollowers(true)}
              className={` bg-black ${inviteFollowers ? "border" : ""}`}
            >
              <p
                className={`px-3 text-gray-400 ${
                  inviteFollowers ? "text-sm " : "py-4"
                }`}
              >
                Invite followers {inviteFollowers ? "" : "(optional)"}
              </p>
              {inviteFollowers && (
                <input
                  type="text"
                  value={searchInput}
                  className="p-3 w-full bg-transparent outline-none"
                  placeholder="Enter name or username"
                  onChange={handleChange}
                />
              )}
            </div>
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
    </div>
  );
};

export default CreateClubModal;
