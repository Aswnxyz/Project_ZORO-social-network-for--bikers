import React, { useEffect, useState } from "react";
import { MdEmojiEmotions } from "react-icons/md";
import { useSelector } from "react-redux";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useEditPostMutation } from "../../utils/slices/postApiSlice";

const EditPostModal = ({ post, onClose, updatePost }) => {
  const [des, setDes] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const [editPost] = useEditPostMutation();
  //ADD EMOJI
  const addEmoji = (e) => {
    const sym = e.unified.split("_");
    const codeArray = [];
    sym.forEach((el) => codeArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codeArray);
    setDes(des + emoji);
  };
  const handleEditPost = async () => {
    try {
      const res = await editPost({ postId: post._id, des });
      updatePost(des);
      onClose();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (post) {
      setDes(post.des);
    }
  }, []);
  return (
    <div
      //   onClick={onClose}
      className="fixed inset-0  bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center  z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="h-auto w-[50rem] fixed top-0 transition-transform translate-y-6 bg-black"
      >
        <div className="flex justify-between p-2  bg-gray-900 border-b border-gray-600 rounded-t-xl">
          <div onClick={onClose} className="">
            Cancel
          </div>
          <div className="font-semibold text-lg">Edit info</div>
          <div onClick={handleEditPost} className="font-semibold text-blue-600">
            Done
          </div>
        </div>
        <div className="flex justify-between h-[27rem] ">
          <div className=" h-[27rem] w-full  flex justify-center items-center border border-gray-800 rounded-bl-xl">
            <img className="h-full" src={post.media.url} alt="" />
          </div>
          <div className="w-[42rem] p-3 bg-gray-900 rounded-br-xl">
            <div className="flex items-center space-x-4  ">
              <img className="w-8 rounded-full" src={userInfo.pic} alt="" />
              <p className="text-sm font-semibold">{userInfo.userName}</p>
            </div>
            <div className="py-4 ">
              <textarea
                onChange={(e) => setDes(e.target.value)}
                className="w-full h-36 bg-transparent focus:outline-none"
                maxLength={200}
                type="text"
                value={des}
              />
              <p onClick={() => setShowEmoji(!showEmoji)}>
                {" "}
                <MdEmojiEmotions size={24} />{" "}
              </p>
            </div>
          </div>
          {showEmoji && (
            <div className="absolute left-28">
              <Picker
                data={data}
                onEmojiSelect={addEmoji}
                emojiSize={20}
                emojiButtonSize={30}
                maxFrequentRows={0}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;
