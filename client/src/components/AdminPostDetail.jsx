import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { LuDot } from "react-icons/lu";
import { Link } from "react-router-dom";

const AdminPostDetail = ({ post, onClose }) => {
 

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
            <img className="h-[40rem]" src={post.media.url} alt="" />
          </div>
          <div className="text-white">
            <div className=" top-0 right-0 relative">
              <div className=" flex w-[32rem] justify-between  px-4">
                <div className="flex py-3">
                  {/* <img
                    className="h-10 rounded-full"
                    src={
                      user?.profilePic
                        ? user?.profilePic?.url
                        : "/img/profile_icon.jpeg"
                    }
                    alt=""
                  /> */}
                  <div className=" flex">
                    <p className="text-lg text-gray-400">
                      Posted at : {new Date(post?.createdAt).toLocaleString()}
                    </p>
                    {/* <div className="">
                      <p class="text-lg text-white font-semibold">
                        {user?.fullName}
                      </p>
                      <span className=" dark:text-gray-500">
                        @{user?.userName}
                      </span>{" "}
                    </div> */}
                    {/* <div className="flex  pl-4">
                      <LuDot className="pr-2 text-gray-400" size={28} />
                      <span className="dark:text-gray-500">
                        {formatRelativeTime(createdAt)}{post.createdAt}
                      </span>
                    </div> */}
                  </div>
                </div>
                {/* <span className="right-0 m-2">
                  <BsThreeDots color="white" size={24} />
                </span> */}
              </div>
              <p className="text-gray-400 text-lg px-4">Des : {post.des}</p>
              <hr className="h-px mt-4   bg-gray-200 border-0 dark:bg-gray-700" />
            </div>

            <h1 className="text-xl font-bold px-4 ">Reports</h1>
            <div className="absolute top-0 px-4 w-auto   mt-36 bottom-0 overflow-y-auto max-h-[490px] start-[32rem] end-0">
              {post.reported?.map((report) => (
                <div>
                  <p className="">
                    <span className="text-gray-400">
                      @{report.userName}
                      {"      :      "}
                    </span>
                    {report.reason}
                  </p>
                </div>
              ))}
            </div>
            {/* {showEmoji && (
              <div className="absolute bottom-16 ">
                <Picker
                  data={data}
                  onEmojiSelect={addEmoji}
                  emojiSize={20}
                  emojiButtonSize={30}
                  maxFrequentRows={0}
                />
              </div>
            )} */}

            {/* <div className=" fixed  bottom-0 w-[32rem] bg-black">
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
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPostDetail;
