import React, { useState } from "react";
import { IoIosArrowForward, IoMdClose } from "react-icons/io";
import {
  useDeletePostMutation,
  useReportPostMutation,
} from "../../utils/slices/postApiSlice";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import EditPostModal from "./EditPostModal";

const MoreOptionsModal = ({
  onClose,
  postId,
  userName,
  postDetails,
  updatePost,
}) => {
  const [activeModal, setActiveModal] = useState("options");
  const [reportPost] = useReportPostMutation();
  const [deletePost] = useDeletePostMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const handleReport = async (reason) => {
    try {
      const res = await reportPost({
        userName: userInfo.userName,
        reason,
        postId,
      }).unwrap();
      Swal.fire({
        title: "Thanks for letting us know",
        text: "Your feedback is important in helping us keep the Instagram community safe.",
        icon: "success",
      });
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  //  "in a perfect or exact way"

  const handleDeletePost = async () => {
    try {
      const res = await deletePost({ postId }).unwrap();
      onClose();
    } catch (error) {
      console.log(error.data);
    }
  };
  return (
    <div
      onClick={onClose}
      className="fixed  inset-0  bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center overflow-auto z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="h-auto w-[400px] text-white fixed top-32 transition-transform translate-y-6   bg-gray-900 rounded-xl "
      >
        {activeModal === "options" && (
          <div className="flex flex-col">
            {userName === userInfo.userName ? (
              <>
                <button
                  onClick={() => setActiveModal("delete")}
                  className="border-b border-gray-600 py-3 text-red-600 font-bold"
                >
                  Delete
                </button>
                <button
                  onClick={() => setActiveModal("edit")}
                  className="border-b border-gray-600 py-3 "
                >
                  Edit
                </button>
              </>
            ) : (
              <button
                onClick={() => setActiveModal("report")}
                className="border-b border-gray-600 py-3 text-red-600 font-bold"
              >
                Report
              </button>
            )}
            <button className="border-b border-gray-600 py-3">
              Share to...
            </button>
            <button className="border-b border-gray-600 py-3">Copy link</button>

            <button onClick={onClose} className="py-3">
              Cancel
            </button>
          </div>
        )}

        {/* Report Post */}
        {activeModal === "report" && (
          <div className="flex flex-col ">
            <button className="border-b  border-gray-600 py-2">Report</button>
            <IoMdClose
              onClick={() => setActiveModal("options")}
              className="absolute end-3 top-2 "
              size={24}
            />
            <div>
              <h1 className="font-bold px-5 pt-4">
                Why are you reporting this post?
              </h1>
              <div className="py-2 max-h-[320px] px-5 overflow-y-auto">
                <p
                  onClick={() => handleReport(" It's spam")}
                  className="flex justify-between pt-6"
                >
                  It's spam <IoIosArrowForward />
                </p>
                <p
                  onClick={() =>
                    handleReport(" Vionlence or dangerous organizations")
                  }
                  className="flex justify-between pt-6"
                >
                  Vionlence or dangerous organizations <IoIosArrowForward />
                </p>
                <p
                  onClick={() => handleReport(" Nudity or sexual activity")}
                  className="flex justify-between pt-6"
                >
                  Nudity or sexual activity <IoIosArrowForward />
                </p>
                <p
                  onClick={() => handleReport("Suicide or self-injury")}
                  className="flex justify-between pt-6"
                >
                  Suicide or self-injury <IoIosArrowForward />
                </p>
                <p
                  onClick={() => handleReport("  Scam or fraud")}
                  className="flex justify-between pt-6"
                >
                  Scam or fraud <IoIosArrowForward />
                </p>
                <p
                  onClick={() => handleReport(" False information")}
                  className="flex justify-between pt-6"
                >
                  False information <IoIosArrowForward />
                </p>
                <p
                  onClick={() => handleReport(" Bullying or harassment")}
                  className="flex justify-between pt-6"
                >
                  Bullying or harassment <IoIosArrowForward />
                </p>
                <p
                  onClick={() => handleReport("I just don't like it")}
                  className="flex justify-between pt-6"
                >
                  I just don't like it <IoIosArrowForward />
                </p>
              </div>
            </div>
          </div>
        )}
        {/* Delete Post */}
        {activeModal === "delete" && (
          <div className="flex flex-col">
            <button className="text-xl mt-5">Delete post?</button>
            <p className="text-center pt-1 pb-2 text-sm font-light">
              {" "}
              Are you sure you want to delete this post?
            </p>
            <div className="mt-5">
              <button
                onClick={handleDeletePost}
                className="border-t border-gray-600 py-3 w-full font-semibold text-red-600"
              >
                Delete
              </button>
              <button
                onClick={onClose}
                className="border-t border-gray-600 py-3 w-full"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {/* Edit post */}
        {activeModal === "edit" && (
          <EditPostModal post={postDetails} onClose={onClose} updatePost={(des)=>updatePost(des)} />
        )}
      </div>
    </div>
  );
};

export default MoreOptionsModal;
