import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useFollowUserMutation, useGetUsersMutation } from "../../utils/slices/userApiSlice";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const LikedUsersList = ({onClose,likes}) => {
  const [hoverStates, setHoverStates] = useState({});

  // Function to handle hover state changes
  const handleHover = (userId, isHovered) => {
    setHoverStates((prevHoverStates) => ({
      ...prevHoverStates,
      [userId]: isHovered,
    }));
  };

  const [usersList, setUsersList] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);

  const [getUsers] = useGetUsersMutation();
    const [followUser] = useFollowUserMutation();


  //Follow Users
  const handleFollowing = async (selectedUserName, state) => {
    try {
      const res = await followUser({
        userName: selectedUserName,
        state,
      }).unwrap();
     

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
      const res = await getUsers([...likes]).unwrap();
      setUsersList(res);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div
      onClick={onClose}
      className="fixed  inset-0  bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center overflow-auto z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="h-96 w-[400px] text-white  fixed top-32 transition-transform translate-y-6 px-5 pt-2 bg-gray-800 rounded-xl "
      >
        <div>
          <div className="flex justify-center items-center">
            <p className="text-lg font-semibold">Likes</p>
            <IoMdClose onClick={onClose} className="fixed right-3" size={27} />
          </div>
          <hr className="border-gray-600 my-2" />
          <div className="absolute  top-18 start-0 px-3 end-0 overflow-y-auto max-h-[280px]">
            {usersList.map((user) => (
              <div key={user._id} className="flex justify-between">
                <Link to={`/${user.userName}`}>
                  {" "}
                  <div className="flex my-2">
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
                        ? hoverStates[user._id]
                          ? "bg-gray-400 text-red-600"
                          : "bg-gray-600"
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

export default LikedUsersList;
