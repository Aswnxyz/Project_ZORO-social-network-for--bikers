import React, { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import {
  FaBookmark,
  FaHeart,
  FaRegBookmark,
  FaRegCommentAlt,
  FaRegHeart,
} from "react-icons/fa";
import { LuArrowUpWideNarrow, LuDot } from "react-icons/lu";
import { MdEmojiEmotions } from "react-icons/md";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
  useCommentPostMutation,
  useDeleteCommentMutation,
  useGetCommentsMutation,
  useLikeCommentMutation,
} from "../../utils/slices/postApiSlice";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RiShareBoxLine } from "react-icons/ri";

const CommentModal = ({
  open,
  src,
  onClose,
  user,
  des,
  _id,
  createdAt,
  likes,
  handleLike,
  commentsCount,
  savedPosts,
}) => {
  const [isHovered, setIsHovered] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [comment, setComment] = useState("");
  const [commentPost] = useCommentPostMutation();
  const [getComments] = useGetCommentsMutation();
  const [commentsList, setCommentList] = useState([]);
  const [likeComment] = useLikeCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const { userInfo } = useSelector((state) => state.auth);

  //ADD EMOJI
  const addEmoji = (e) => {
    const sym = e.unified.split("_");
    const codeArray = [];
    sym.forEach((el) => codeArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codeArray);
    setComment(comment + emoji);
  };

  const handleCommentUpload = async () => {
    try {
      const res = await commentPost({
        postId: _id,
        text: comment,
      }).unwrap();

      const newComment = {
        user: {
          profilePic: {
            url: userInfo.pic,
          },
          fullName: userInfo.fullName,
          userName: userInfo.userName,
        },
        _doc: {
          ...res,
        },
      };

      setComment("");
      setCommentList((prevCom) => [newComment, ...prevCom]);
      commentsCount("+");
    } catch (error) {
      console.log(error);
    }
  };

  const hanldeDeleteCommment = async () => {
    try {
      const res = await deleteComment({ commentId: openModal });
      setCommentList((prevCom) =>
        prevCom.filter((com) => com._doc?._id !== openModal)
      );
      setOpenModal(null);
      commentsCount("-");
    } catch (error) {
      console.log(error);
    }
  };

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

  const handleLikeComment = async (commentId, state) => {
    try {
      const res = await likeComment({ commentId, state }).unwrap();
      setCommentList((prevComments) =>
        prevComments.map((comment) =>
          comment._doc?._id === commentId
            ? { ...comment, _doc: { ...comment._doc, likes: res.likes } }
            : comment
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await getComments({ _id }).unwrap();
      setCommentList(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  if (!open) return null;
  return (
    <div
      onClick={onClose}
      className="fixed inset-0  bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center  z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="h-auto w-[64rem] fixed top-6   transition-transform translate-y-6 bg-black  "
      >
        <div className="flex justify-between">
          <div className="">
            <img className="h-[40rem]" src={src} alt="" />
          </div>
          <div className="text-white">
            <div className=" top-0 right-0 relative">
              <div className=" flex w-[32rem] justify-between  px-4">
                <div className="flex py-3">
                  <img
                    className="h-10 rounded-full"
                    src={
                      user.profilePic
                        ? user.profilePic?.url
                        : "/img/profile_icon.jpeg"
                    }
                    alt=""
                  />
                  <div className="px-4 flex">
                    <div className="">
                      <p class="text-lg text-white font-semibold">
                        {user.fullName}
                      </p>
                      <span className=" dark:text-gray-500">
                        @{user.userName}
                      </span>{" "}
                    </div>
                    <div className="flex  pl-4">
                      <LuDot className="pr-2 text-gray-400" size={28} />
                      <span className="dark:text-gray-500">
                        {formatRelativeTime(createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="right-0 m-2">
                  <BsThreeDots color="white" size={24} />
                </span>
              </div>
              <p className="text-white text-lg px-5">{des}</p>
              <hr class="h-px mt-4   bg-gray-200 border-0 dark:bg-gray-700" />
            </div>

            <div className="absolute top-0 px-4 w-auto  mt-32 bottom-0 overflow-y-auto max-h-[375px] start-[32rem] end-0 ">
              {commentsList.map((comment) => (
                <div
                  key={comment._doc?._id}
                  className="flex  py-3"
                  onMouseEnter={() => setIsHovered(comment._doc?._id)}
                  onMouseLeave={() => setIsHovered(null)}
                >
                  <img
                    className="h-10 rounded-full"
                    src={
                      comment.user.profilePic?.url
                        ? comment.user?.profilePic?.url
                        : "/img/profile_icon.jpeg"
                    }
                    alt=""
                  />
                  <div className="flex">
                    <div className="px-4">
                      <Link to={`/${comment.user?.userName}`}>
                        <div className="flex  text-center">
                          <p class="text-lg  font-semibold">
                            {comment.user?.fullName}
                          </p>
                          <span className="px-2 dark:text-gray-500">
                            @{comment.user?.userName}
                          </span>{" "}
                          <LuDot className="pr-2 text-gray-400" size={28} />
                          <span className="dark:text-gray-500">
                            {formatRelativeTime(comment._doc?.createdAt)}
                          </span>
                        </div>
                      </Link>
                      <p className="">{comment._doc?.text}</p>
                      <div className="flex space-x-6 mt-2 text-sm font-semibold text-gray-400">
                        {comment._doc?.likes?.length > 0 && (
                          <p>{comment._doc?.likes?.length} likes</p>
                        )}
                        <p>Reply</p>
                        {isHovered === comment._doc?._id &&
                          comment.user?._id === userInfo.id && (
                            <p onClick={() => setOpenModal(comment._doc?._id)}>
                              <BsThreeDots
                                color="white text-center"
                                size={20}
                              />
                            </p>
                          )}
                      </div>
                    </div>
                    <p className="absolute right-0 px-8">
                      {comment._doc?.likes.includes(userInfo.id) ? (
                        <FaHeart
                          onClick={() =>
                            handleLikeComment(comment._doc?._id, "dislike")
                          }
                          size={20}
                          color="red"
                        />
                      ) : (
                        <FaRegHeart
                          onClick={() =>
                            handleLikeComment(comment._doc?._id, "like")
                          }
                          size={20}
                        />
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {showEmoji && (
              <div className="absolute bottom-36 ">
                <Picker
                  data={data}
                  onEmojiSelect={addEmoji}
                  emojiSize={20}
                  emojiButtonSize={30}
                  maxFrequentRows={0}
                />
              </div>
            )}

            <div className=" fixed  bottom-0 w-[32rem] bg-black">
              <hr class="h-px    bg-gray-200 border-0 dark:bg-gray-700" />

              <div className="text-gray-400 flex justify-between pt-4 px-2">
                <div className="flex  items-center space-x-6">
                  <span
                    onClick={() => {
                      handleLike(
                        likes.includes(userInfo.id) ? "dislike" : "like"
                      );
                    }}
                  >
                    {likes.includes(userInfo.id) ? (
                      <FaHeart size={27} color="red" />
                    ) : (
                      <FaRegHeart size={27} />
                    )}
                  </span>
                  {/* {totalLikes > 0 && (
                    <span onClick={() => setLikedUsersList(true)}>
                      {formatNumber(totalLikes)}
                    </span>
                  )} */}

                  <FaRegCommentAlt
                    // onClick={() => setOpenCommentModal(!openCommentModal)}
                    size={24}
                  />
                  {/* {totalComments > 0 && (
                    <span>{formatNumber(totalComments)}</span>
                  )} */}
                  <RiShareBoxLine size={27} />
                </div>
                <span>
                  {savedPosts.includes(_id)? (
                  <FaBookmark size={24} />
                  ) : ( 
                  <FaRegBookmark size={24} /> 
                  )} 
                </span>
              </div>
              <p className="p-2">{likes.length} likes</p>
              <hr class="h-px    bg-gray-200 border-0 dark:bg-gray-700" />

              <div className="flex justify-between items-center p-4 text-lg">
                <div className="flex items-center space-x-4">
                  <p onClick={() => setShowEmoji(!showEmoji)}>
                    <MdEmojiEmotions size={24} />
                  </p>
                  <input
                    className="bg-black w-[24rem] focus:outline-none "
                    type="text"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleCommentUpload}
                  className={`px-2 font-bold ${
                    comment ? "text-red-600 hover:text-white" : "text-gray-600"
                  }`}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* deleteModal */}
      {openModal && (
        <div className="fixed  inset-0  bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center overflow-auto z-50">
          <div
            onClick={(e) => e.stopPropagation()}
            className="h-auto w-[400px] text-white fixed top-52 transition-transform translate-y-6   bg-gray-900 rounded-xl "
          >
            <div className="flex flex-col">
              <button
                onClick={hanldeDeleteCommment}
                className="border-b border-gray-600 py-3 text-red-600 font-bold"
              >
                Delete
              </button>

              {/* <button
                // onClick={() => setActiveModal("report")}
                className="border-b border-gray-600 py-3 text-red-600 font-bold"
              >
                Report
              </button> */}

              <button onClick={() => setOpenModal(null)} className="py-3">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* deleteModal */}
    </div>
  );
};

export default CommentModal;
