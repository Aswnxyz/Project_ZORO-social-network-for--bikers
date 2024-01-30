import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetCommunityDetailsMutation,
  useJoinCommunityMutation,
} from "../utils/slices/communityApiSlice";
import { TiGroup } from "react-icons/ti";
import { MdGroups } from "react-icons/md";
import { useSelector } from "react-redux";
import { IoIosArrowDown, IoMdAdd } from "react-icons/io";
import { FaRightFromBracket } from "react-icons/fa6";
import { ImFilePicture } from "react-icons/im";
import CreatePostModal from "../components/Modals/CreatePostModal";
import Post from "./Post";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ClubBox = () => {
  const { communityId } = useParams();
  const [getDetails] = useGetCommunityDetailsMutation();
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [communityPosts, setCommunityPosts] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [joinCommunity] = useJoinCommunityMutation();
  const [createPostModal, setCreatePostModal] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };
  const handleJoinCommunity = async (communityId) => {
    try {
      const res = await joinCommunity({ communityId }).unwrap();
      console.log("result", res);
      setSelectedCommunity(res);
      setDropdownOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      const res = await getDetails({ communityId }).unwrap();
      console.log("fetchedData ", res);
      setSelectedCommunity(res.communityData);
      setCommunityPosts(res.posts);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [communityId]);
  return (
    <>

      <div className="text-white p-3 overflow-y-auto">
        <div>
          <div>
            <img
              className="h-96 w-full"
              src={
                selectedCommunity?.image
                  ? selectedCommunity?.image?.url
                  : "https://www.facebook.com/images/groups/groups-default-cover-photo-2x.png"
              }
              alt=""
            />
          </div>
          <div className="flex justify-between my-4  items-center px-4">
            <div>
              <p className="text-2xl font-bold">{selectedCommunity?.name}</p>
              <span className="text-sm text-gray-400">
                {selectedCommunity?.members.length} members
              </span>
            </div>
            <div className="flex">
              {selectedCommunity?.members.includes(userInfo.id) && (
                <div className="mx-3 flex justify-center items-center border space-x-2 px-2">
                  <IoMdAdd size={20} />
                  <span>Invite</span>
                </div>
              )}
              <div
                className={`flex justify-center items-center space-x-3 px-2 py-1 ${
                  selectedCommunity?.members.includes(userInfo.id)
                    ? "bg-gray-600"
                    : "bg-blue-600"
                }  rounded`}
              >
                <MdGroups size={24} />
                {!selectedCommunity?.members.includes(userInfo.id) ? (
                  <button
                    onClick={() => handleJoinCommunity(selectedCommunity._id)}
                    className={`font-semibold`}
                  >
                    Join
                  </button>
                ) : (
                  <div className="relative inline-block text-left">
                    <button
                      type="button"
                      onClick={toggleDropdown}
                      className="inline-flex justify-center items-center    shadow-sm   font-semibold  "
                    >
                      Joined
                      <IoIosArrowDown className="mx-2" size={18} />
                    </button>

                    {/* Dropdown panel, show/hide based on state */}
                    <div
                      className={`${
                        isDropdownOpen
                          ? "origin-top-right absolute right-0 mt-2"
                          : "hidden"
                      } w-56 rounded-md shadow-lg bg-gray-900 ring-1 ring-black ring-opacity-5`}
                    >
                      {/* Dropdown content */}
                      <div className="py-1">
                        <div
                          onClick={() =>
                            handleJoinCommunity(selectedCommunity._id)
                          }
                          className=" flex items-center px-4 py-2 text-sm  space-x-3"
                        >
                          <FaRightFromBracket />

                          <span>leave</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <hr className="border-none h-px bg-gray-600" />
        <div
          onClick={() =>
            selectedCommunity?.members.includes(userInfo.id)
              ? setCreatePostModal(true)
              : toast.warn("🥱 only joined users can do!", {
                  position: "top-center",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "dark",
                  // transition: Bounce,
                })
          }
          className="flex items-center p-3 border-b border-gray-600"
        >
          <img className="h-11 rounded-full" src={userInfo?.pic} alt="" />
          <input
            type="text"
            className="w-full p-2 mx-3 rounded-3xl outline-none border border-gray-700 bg-transparent "
            placeholder="Write something"
          />
          <ImFilePicture size={24} />
        </div>
        <div className="px-20">
          {communityPosts.map((post) => (
            <div key={post._id}>
              <Post
                {...post}
                savedPosts={userInfo?.savedPosts}
                // key={post._id}
              />
            </div>
          ))}
        </div>
      </div>
      {createPostModal && (
        <CreatePostModal
          open={createPostModal}
          onClose={() => setCreatePostModal(false)}
          communityId={communityId}
          addNewPost ={(newPost)=> setCommunityPosts((prev)=> [newPost,...prev])}
        />
      )}
    </>
  );
};

export default ClubBox;
