import React, { useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { TbCameraPlus } from "react-icons/tb";
import { useUpdateProfileMutation } from "../../utils/slices/userApiSlice";
import ProfileImageCropper from "../ImageCrop";
import { StandaloneSearchBox, LoadScript } from "@react-google-maps/api";

const EditProfileModal = ({ open, onClose, userData, setUserData }) => {
  const inputRef = useRef(null);
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [coverPic, setCoverPic] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState("");
  const [updateProfile] = useUpdateProfileMutation();
  const fileInputRef = useRef(null);
  const [imgType, setImageType] = useState("");
  //CROP_SECTION
  const [showImageModal, setShowImageModal] = useState(false);
  const [body, setBody] = useState({});



  const handleProfileUpdate = async () => {
    try {
      const res = await updateProfile({ ...body, fullName, bio, location });
      
      setUserData(res.data);
      onClose();
    } catch (error) {
      console.log(error.data);
    }
  };
  const handleImage = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage({
        data: reader.result,
        type: imgType,
      });
      setShowImageModal(true);

    };
  };

  const handleCameraIconClick = (type) => {
    // Trigger the file input when the camera icon is clicked
    fileInputRef.current.click();
    setImageType(type);
  };

  //IMAGE_CROP

  const handleCropComplete = async (dataURL) => {
    // Set data URL to state or use it as needed
    // console.log("Cropped Image Data URL:", dataURL);
    if (imgType === "profile") {
      setProfilePic(dataURL);
      setBody((prevBody) => ({
        ...prevBody,
        profilePic: dataURL,
      }));
    } else {
      setCoverPic(dataURL);
      setBody((prevBody) => ({
        ...prevBody,
        coverPic: dataURL,
      }));
    }
    setImage("");

    // Continue with your logic for using the cropped image blob

    setShowImageModal(false);
  };

  useEffect(() => {
    if (userData) {
      setFullName(userData.fullName);
      setBio(userData.bio);
      setLocation(userData.location);
      setProfilePic(userData.profilePic?.url);
      setCoverPic(userData.coverPic?.url);
    }
  }, [userData]);

  if (!open) return null;
  return (
    <div
      onClick={() => {
        if (!showImageModal) {
          onClose();
        }
      }}
      className="fixed inset-0  bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center overflow-auto z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="h-auto w-[700px]  fixed top-16 transition-transform translate-y-6 px-5 pt-2 pb-10 bg-black rounded-xl  "
      >
        <div className="">
          {!showImageModal && (
            <div className="flex justify-between py-2 bg-black">
              <div className="flex items-center  space-x-4">
                <p onClick={onClose}>
                  <IoMdClose size={25} />
                </p>
                <h1 className="text-lg font-semibold">Edit profile</h1>
              </div>

              <button
                onClick={handleProfileUpdate}
                className=" font-semibold px-5 py-1 text-black bg-white rounded-2xl"
              >
                Save
              </button>
            </div>
          )}

          {showImageModal ? (
            <ProfileImageCropper
              src={image.data}
              imgType={imgType}
              setCompletedCrop={(data) => handleCropComplete(data)}
              onClose={() => setShowImageModal(false)}
            />
          ) : (
            <>
              {" "}
              <div className="relative h-[12rem] bg-gradient-to-r from-black">
                {/* Cover Picture */}
                <div className="relative">
                  <div className="bg-gray-800 h-[12rem] w-full">
                    {coverPic && (
                      <img
                        id="coverPic"
                        src={coverPic}
                        className="h-[12rem] w-full"
                        alt="cover_picture"
                      />
                    )}
                  </div>

                  {/* Camera Icon for Cover Picture */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="bg-black bg-opacity-25 p-3 rounded-full"
                      onClick={() => handleCameraIconClick("cover")}
                    >
                      <TbCameraPlus size={20} className="text-white" />
                    </span>
                  </div>
                </div>

                {/* Profile Picture */}
                <div className="absolute bottom-3 left-3">
                  <img
                    id="profilePic"
                    src={profilePic ? profilePic : "/img/no_profile.jpg"}
                    className="h-24 rounded-full"
                    alt="profile"
                  />
                  {/* Camera Icon for Profile Picture */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="bg-black bg-opacity-25 p-3 rounded-full"
                      onClick={() => handleCameraIconClick("profile")}
                    >
                      <TbCameraPlus size={20} className="text-white" />
                    </span>
                  </div>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleImage}
                />
              </div>
              <div className="w-full h-14 mt-4 border-2 px-2 border-gray-800 rounded">
                <span className="text-xs text-gray-400">Name</span>
                <div>
                  <input
                    className="bg-black w-full focus:outline-none"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full  mt-4 border-2 px-2 border-gray-800 rounded">
                <span className="text-xs text-gray-400">Bio</span>
                <div>
                  <textarea
                    className="w-full bg-black focus:outline-none"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  >
                    {bio}
                  </textarea>
                </div>
              </div>
              <div className="w-full h-14 mt-4 border-2 px-2 border-gray-800 rounded">
                <span className="text-xs text-gray-400">Location</span>
                <div>
                  <input
                    className="bg-black w-full focus:outline-none"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* <LoadScript
          googleMapsApiKey="AIzaSyDb31E4d21m52qNpkiEWimraFx_mzDmKj0"
          libraries={["places"]}
        >
          <StandaloneSearchBox
            onLoad={(ref) => (inputRef.current = ref)}
            onPlacesChanged={handlePlaceChanged}
          >
            <input type="text" className="text-black" />
          </StandaloneSearchBox>
        </LoadScript> */}
      </div>
    </div>
  );
};

export default EditProfileModal;
