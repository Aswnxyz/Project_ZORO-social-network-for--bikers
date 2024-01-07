import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { BsSearch } from "react-icons/bs";
import {
  useFollowUserMutation,
  useGetUsersMutation,
} from "../../utils/slices/userApiSlice";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

function filterData(usersList, searchInput) {
  const filteredData = usersList.filter(
    (user) =>
      user &&
      (user.userName?.toLowerCase()?.includes(searchInput.toLowerCase()) ||
        user.fullName?.toLowerCase()?.includes(searchInput.toLowerCase()))
  );
  return filteredData;
}

const FollowersModal = ({ state, onClose, user, updateProfile }) => {
      const [hoverStates, setHoverStates] = useState({});

      // Function to handle hover state changes
      const handleHover = (userId, isHovered) => {
        setHoverStates((prevHoverStates) => ({
          ...prevHoverStates,
          [userId]: isHovered,
        }));
      };

  const [getUsers] = useGetUsersMutation();
  const [followUser] = useFollowUserMutation();
  const [usersList, setUsersList] = useState([]);
  const [filteredUsersList, setFilteredUsersList] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const { userName } = useParams();


  const { userInfo } = useSelector((state) => state.auth);

  //Follow Users
  const handleFollowing = async (selectedUserName, state) => {
    try {
      const res = await followUser({ userName:selectedUserName, state }).unwrap();
      if (userName === userInfo.userName) {
        const updatedFollowersList = user.followers.includes(res._id)
          ? [...user.followers]
          : [...user.followers, res.id];

        const updatedFollowingList =
          state === "follow"
            ? [...user.following, res._id]
            : user.following.filter((id) => id !== res._id);

        updateProfile(updatedFollowersList, updatedFollowingList);
      }

      const updatedUsersList = usersList.map((user) =>
        user.userName === selectedUserName ? res : user
      );

      setUsersList(updatedUsersList);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      if (state === "Following") {
        const res = await getUsers([...user.following]).unwrap();
        setUsersList(res);
        setFilteredUsersList(res);
      } else {
        const res = await getUsers([...user.followers]).unwrap();
        setUsersList(res);
        setFilteredUsersList(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filteredData = filterData(usersList, searchInput);
    setFilteredUsersList(filteredData);
  }, [searchInput, usersList]);

  return (
    <div
      onClick={onClose}
      className="fixed  inset-0  bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center overflow-auto z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="h-96 w-[400px] text-white  fixed top-32 transition-transform translate-y-6 px-5 pt-2 bg-gray-800 rounded-xl "
      >
        <div className="">
          <div className="flex justify-center items-center">
            <p className="text-lg font-semibold">{state}</p>
            <IoMdClose onClick={onClose} className="fixed right-3" size={27} />
          </div>
          <hr className="border-gray-600 my-2" />
          <div className="flex items-center space-x-2 fixed">
            <BsSearch size={20} color="gray" />
            <input
              type="text"
              className="bg-transparent p-2 w-full text-base focus:outline-none"
              placeholder="Search"
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
            />
          </div>
          <div className="absolute top-24 start-0 px-3 end-0 overflow-y-auto max-h-[280px]">
            {filteredUsersList.map((user) => (
              <div key={user._id} className="flex justify-between">
                <Link to={`/${user.userName}`}>
                  {" "}
                  <div onClick={onClose} className="flex my-2">
                    <img
                      className="h-12 rounded-full"
                      src={
                        user.profilePic?.url
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
                        <p class="text-base dark:text-gray-500 font-normal ">
                          {user.fullName}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
                {user._id !== userInfo.id && (
                  <button
                    onClick={() =>
                      handleFollowing(
                        user.userName,
                        user.followers?.includes(userInfo.id)
                          ? "unfollow"
                          : "follow"
                      )
                    }
                    onMouseEnter={() => handleHover(user._id, true)}
                    onMouseLeave={() => handleHover(user._id, false)}
                    className={`${
                      user.followers.includes(userInfo.id)
                        ?hoverStates[user._id]
                        ? "bg-gray-400 text-red-600":"bg-gray-600"
                        : "bg-blue-400"
                    } m-4 px-4 rounded-lg font-medium`}
                  >
                    {user.followers.includes(userInfo.id)
                      ? hoverStates[user._id]
                        ? "Unfollow"
                        : "Following"
                      : "Follow"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowersModal;
