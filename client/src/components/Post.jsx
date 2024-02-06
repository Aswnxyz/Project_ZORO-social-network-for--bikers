import React, { useEffect, useState } from "react";
import {
  FaRegBookmark,
  FaRegCommentAlt,
  FaRegHeart,
  FaHeart,
  FaCloudShowersHeavy,
  FaBookmark,
} from "react-icons/fa";
import { RiShareBoxLine } from "react-icons/ri";
import { BsThreeDots, BsThreeDotsVertical } from "react-icons/bs";
import {
  useGetCommentsMutation,
  useLikePostMutation,
} from "../utils/slices/postApiSlice";

import { LuDot } from "react-icons/lu";
import { useSelector } from "react-redux";
import CommentModal from "./Modals/CommentModal";
import { Link } from "react-router-dom";
import { useSavePostMutation } from "../utils/slices/userApiSlice";
import MoreOptionsModal from "./Modals/MoreOptionsModal";
import LikedUsersList from "./Modals/LikedUsersList";

const Post = ({
  user,
  community,
  media,
  mediaUrl,
  des,
  isCommunityPost,
  likes,
  createdAt,
  _id,
  totalComments,
  savedPosts,
  setPosts,
}) => {
  const [likedUsers, setLikedUsers] = useState([]);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likedUsersList, setLikedUsersList] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);

  const [likePost] = useLikePostMutation();
  const [savePost] = useSavePostMutation();
  const [desc, setDesc] = useState("");
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [optionsModal, SetOptionsModal] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

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

  const formatNumber = (number) => {
    if (number < 1000) {
      return number.toString(); // Display as it is if less than 1000
    } else if (number < 1000000) {
      // Display as k (e.g., 1.2k)
      return (number / 1000).toFixed(1) + "k";
    } else {
      // Display as M (e.g., 5.4M)
      return (number / 1000000).toFixed(1) + "M";
    }
  };

  const handleLike = async (state) => {
    try {
      const res = await likePost({
        post_id: _id,
        user_id: userInfo.id,
        state,
      }).unwrap();
      setLiked(!liked);
      // state === "like"
      //   ? setTotalLikes(totalLikes + 1)
      //   : setTotalLikes(totalLikes - 1);
      setLikedUsers((prev) =>
        state === "like"
          ? [...prev, userInfo.id]
          : prev.filter((userId) => userId !== userInfo.id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleSavedPost = async () => {
    try {
      const res = await savePost({ postId: _id }).unwrap();
      setSaved(!saved);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setLikedUsers(likes);
    setDesc(des);
    setCommentsCount(totalComments);
  }, []);

  useEffect(() => {
    // Check if the user's ID is included in the likes array
    setLiked(likedUsers.includes(userInfo.id));
    setSaved(savedPosts?.includes(_id));
  }, [userInfo.id, likedUsers]);

  return (
    <>
      <div className=" px-10 mb-4 rounded bg-gray-50 dark:bg-black ">
        <div className="flex justify-between items-center">
          <div className="flex my-4">
            {isCommunityPost ? (
              <div className="flex">
                <div className=" relative  h-fit">
                  <img
                    className=" h-10 w-10 rounded-xl"
                    src={
                      community.image
                        ? community.image?.url
                        : "/img/profile_icon.jpeg"
                    }
                    alt=""
                  />
                  <img
                    className="h-6 border border-black rounded-full absolute -bottom-1 right-0"
                    src={
                      user.profilePic
                        ? user.profilePic?.url
                        : "/img/profile_icon.jpeg"
                    }
                    alt=""
                  />
                </div>
                <div className="px-4 text-white  ">
                  {" "}
                  <div className="flex">
                    <Link to={`/clubs/${community._id}`}>
                      <p className="text-lg text-white font-semibold">
                        {community.name}
                      </p>
                    </Link>
                    {/* <span className="mx-2 text-sm text-gray-400"> by </span> */}
                    <div className="flex">
                      <span className="px-2 dark:text-gray-500">
                        @{user.userName}
                      </span>{" "}
                      <LuDot className="pr-2 text-gray-400" size={28} />
                      <span className="dark:text-gray-500">
                        {formatRelativeTime(createdAt)}
                      </span>
                    </div>
                  </div>
                  <p className="text-white">{desc}</p>
                </div>
              </div>
            ) : (
              <>
                <img
                  className="h-10 rounded-full"
                  src={
                    user?.profilePic
                      ? user?.profilePic?.url
                      : "/img/profile_icon.jpeg"
                  }
                  alt=""
                />

                <div className="px-4">
                  <Link to={`/${user?.userName}`}>
                    {" "}
                    <div className="flex  text-center">
                      <p className="text-lg text-white font-semibold">
                        {user?.fullName}
                      </p>
                      <span className="px-2 dark:text-gray-500">
                        @{user?.userName}
                      </span>{" "}
                      <LuDot className="pr-2 text-gray-400" size={28} />
                      <span className="dark:text-gray-500">
                        {formatRelativeTime(createdAt)}
                      </span>
                    </div>
                  </Link>
                  <p className="text-white">{desc}</p>
                </div>
              </>
            )}
          </div>
          <BsThreeDots
            onClick={() => SetOptionsModal(true)}
            color="white"
            size={24}
          />
        </div>

        <div className="border border-gray-800 rounded flex justify-center items-center">
          <img src={mediaUrl} alt="" />
        </div>
        <div className="text-gray-400 flex justify-between pt-3 px-1">
          <div className="flex  items-center space-x-6">
            <span
              onClick={() => {
                handleLike(liked ? "dislike" : "like");
              }}
            >
              {liked ? (
                <FaHeart size={27} color="red" />
              ) : (
                <FaRegHeart size={27} />
              )}
            </span>
            {likedUsers.length > 0 && (
              <span onClick={() => setLikedUsersList(true)}>
                {formatNumber(likedUsers?.length)}
              </span>
            )}

            <FaRegCommentAlt
              onClick={() => setOpenCommentModal(!openCommentModal)}
              size={24}
            />
            {commentsCount > 0 && <span>{formatNumber(commentsCount)}</span>}
            <RiShareBoxLine size={27} />
          </div>
          <span onClick={handleSavedPost}>
            {saved ? <FaBookmark size={24} /> : <FaRegBookmark size={24} />}
          </span>
        </div>
        <hr className="h-px mt-4  bg-gray-200 border-0 dark:bg-gray-700" />
      </div>
      {openCommentModal && (
        <CommentModal
          src={mediaUrl}
          open={openCommentModal}
          onClose={() => setOpenCommentModal(false)}
          user={user}
          des={des}
          _id={_id}
          createdAt={createdAt}
          likes={likedUsers}
          handleLike={(state) => handleLike(state)}
          commentsCount={(action) =>
            setCommentsCount((prevCount) =>
              action === "+" ? prevCount + 1 : prevCount - 1
            )
          }
          savedPosts={savedPosts}
          handleSavedPost={handleSavedPost}
        />
      )}
      {optionsModal && (
        <MoreOptionsModal
          onClose={() => SetOptionsModal(false)}
          setPosts={setPosts}
          postId={_id}
          userName={user.userName}
          postDetails={{ media, des, _id }}
          updatePost={(newDes) => setDesc(newDes)}
        />
      )}
      {likedUsersList && (
        <LikedUsersList
          onClose={() => setLikedUsersList(false)}
          likes={likes}
        />
      )}
    </>
  );
};

export default Post;
