import React, { useEffect, useState } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { FaRegEnvelope } from "react-icons/fa6";
import {
  useFollowUserMutation,
  useGetProfileMutation,
  useGetSavedPostMutation,
} from "../../utils/slices/userApiSlice";
import EditProfileModal from "../../components/Modals/EditProfileModal";
import { MdAddToPhotos } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import FollowersModal from "../../components/Modals/FollowersModal";
import UserPosts from "../../components/UserPosts";
import UserSavedPosts from "../../components/UserSavedPosts";
import CreateGarageModal from "../../components/Modals/CreateGarageModal";
import PrivateComponent from "../../components/PrivateComponent";
const Profile = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [userData, setUserData] = useState({});
  const [getProfile] = useGetProfileMutation();
  const [getSavedPosts] = useGetSavedPostMutation();
  const [openModel, setOpenModel] = useState(false);
  const [openFollowersModal, setopenFollowersModal] = useState("");
  const [openCreatGarageModal, setOpenCreateGarageModal] = useState(false);
  const [activeSection, setActiveSection] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);
  const { userName } = useParams();
  const [followUser] = useFollowUserMutation();

  const updateGarage = (newMotor) => {
    setUserData((prevData) => ({
      ...prevData,
      garage: [...prevData.garage, newMotor],
    }));
  };

  const handleFollowing = async (state) => {
    try {
      const res = await followUser({ userName, state }).unwrap();
      if (res) {
        // setUserData((prevData) => ({
        //   ...prevData,
        //   followers: res.followers,
        // }));
        setUserData(res)
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      if (activeSection === "posts") {
        const res = await getProfile({ userName }).unwrap();
        console.log(res)
        setUserData(res.userData);
        setPosts(res.posts);
        setSavedPosts([]);
      } else if (activeSection === "savedPosts") {
        const savedPostsRes = await getSavedPosts({ userName }).unwrap();
        setSavedPosts(savedPostsRes);
        setPosts([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userName, activeSection]);
  return (
    <>
      <div className="text-white h-full px-20 mt-10">
        <div className="relative h-[24rem]  bg-gradient-to-r from-black ">
          <div className="bg-gray-800 w-full h-[24rem] ">
            {userData.coverPic && (
              <img
                src={userData?.coverPic?.url}
                className="h-[24rem] w-full"
                alt="cover_picture"
              />
            )}
          </div>

          <img
            src={
              userData?.profilePic
                ? userData?.profilePic?.url
                : "/img/no_profile.jpg"
            }
            className="absolute bottom-5 left-5 h-36  rounded-full border-4 border-black"
            alt="profile"
          />
        </div>
        <div className="p-2">
          <div className=" flex justify-between py-2 ">
            <div>
              <h1 className="text-2xl  font-bold">{userData.fullName}</h1>
              <p className="text-gray-400">{"@" + userData.userName}</p>
            </div>
            <div>
              {userName === userInfo.userName ? (
                <button
                  onClick={() => setOpenModel(true)}
                  className="border border-gray-400 rounded-3xl px-3 py-1 text-gray-200 font-semibold"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex items-center space-x-4">
                  {userData.followers?.includes(userInfo.id) && (
                    <Link to={`/messages/${userData._id}`}>
                      <div className="border border-gray-400 p-2 rounded-full">
                        <FaRegEnvelope size={20} />
                      </div>
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      if (!userData?.followRequests?.includes(userInfo.id)) {
                        handleFollowing(
                          userData.followers?.includes(userInfo.id)
                            ? "unfollow"
                            : "follow"
                        );
                      }
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className={`border border-gray-400 rounded-3xl px-3 py-1 font-semibold ${
                      userData.followers?.includes(userInfo.id)
                        ? isHovered
                          ? "text-red-600"
                          : "text-gray-200 hover:text-red-600"
                        : userData?.followRequests?.includes(userInfo.id)
                        ? "text-white"
                        : "hover:text-gray-200 text-black  hover:decoration-stone-400  bg-white hover:bg-black"
                    }  `}
                  >
                    {userData.followers?.includes(userInfo.id)
                      ? isHovered
                        ? "Unfollow"
                        : "Following"
                      : userData?.followRequests?.includes(userInfo.id)
                      ? "Requested"
                      : "Follow"}
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className=" text-blue-400 flex space-x-2">
            {userData.location && (
              <>
                <IoLocationOutline className="mt-1" />{" "}
                <p>{userData.location}</p>
              </>
            )}
          </div>
          <p className="py-2">{userData.bio}</p>
          <div className="flex mt-3 space-x-4 items-center">
            <div
              onClick={() => {
                setopenFollowersModal("Following");
              }}
              className="space-x-2"
            >
              <span className="text-lg font-bold">
                {userData.following?.length}
              </span>
              <span className="font-light text-gray-400">Following</span>
            </div>
            <div
              onClick={() => {
                setopenFollowersModal("Followers");
              }}
              className="space-x-2"
            >
              <span className="text-lg font-bold">
                {userData.followers?.length}
              </span>
              <span className="font-light text-gray-400">Followers</span>
            </div>
          </div>
        </div>
        {!userData?.privateAccount ||
        userInfo.id === userData._id ||
        userData.followers.includes(userInfo.id) ? (
          <>
            <div className="py-4 px-2">
              {userData?.garage?.length > 0 && (
                <h1 className="text-3xl font-semibold">Garage</h1>
              )}
              <div className="flex flex-wrap my-3">
                {userData?.garage?.map((bike) => (
                  <div
                    key={bike._id}
                    className="w-56 h-full p-2 mr-3  border border-gray-800"
                  >
                    <img
                      className="w-full h-full"
                      src={bike?.image?.url}
                      alt=""
                    />

                    <h1 className="text-xl text-center ">{bike.nickName}</h1>
                    <p className="text-sm  text-center text-gray-400">
                      <span>{bike.year}</span> {bike.model}
                    </p>
                  </div>
                ))}
                {userName === userInfo.userName && (
                  <div
                    onClick={() => setOpenCreateGarageModal(true)}
                    className="w-56 h-80 p-2 flex justify-center items-center shadow-lg border border-gray-800"
                  >
                    <MdAddToPhotos
                      className="text-gray-600 hover:opacity-100 opacity-50"
                      size={125}
                    />
                  </div>
                )}
              </div>
            </div>
            {/* POSTS */}
            <div className="flex justify-between  mt-2 w-full  text-gray-400 border-b border-gray-600">
              <span
                onClick={() => setActiveSection("posts")}
                className={`text-center px-20 py-4 hover:text-white hover:font-bold  ${
                  activeSection === "posts" &&
                  "border-b-2 border-white font-bold"
                }`}
              >
                Posts
              </span>
              {userName === userInfo.userName && (
                <span
                  onClick={() => setActiveSection("savedPosts")}
                  className={`text-center px-20 py-4 hover:text-white hover:font-bold  ${
                    activeSection === "savedPosts" &&
                    "border-b-2 border-white font-bold"
                  }`}
                >
                  Saved
                </span>
              )}
              <span className="text-center px-20 py-4 hover:text-white hover:font-bold active:border-b">
                Clubs
              </span>
              <span className="text-center px-20 py-4 hover:text-white hover:font-bold active:border-b">
                Events
              </span>
            </div>

            {activeSection === "posts" && <UserPosts posts={posts} />}
            {activeSection === "savedPosts" && (
              <UserSavedPosts savedPosts={savedPosts} />
            )}
          </>
        ) : (
          <PrivateComponent />
        )}

        <EditProfileModal
          open={openModel}
          onClose={() => setOpenModel(false)}
          userData={userData}
          setUserData={(data) => setUserData(data)}
        />
        {openFollowersModal && (
          <FollowersModal
            state={openFollowersModal}
            onClose={() => setopenFollowersModal("")}
            user={userData}
            updateProfile={(updatedFollowersList, updatedFollowingList) =>
              setUserData({
                ...userData,
                followers: updatedFollowersList,
                following: updatedFollowingList,
              })
            }
          />
        )}
        {openCreatGarageModal && (
          <CreateGarageModal
            onClose={() => setOpenCreateGarageModal(false)}
            updateGarage={(newMotor) => updateGarage(newMotor)}
          />
        )}
      </div>
    </>
  );
};

export default Profile;
