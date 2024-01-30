import React, { useRef, useState } from "react";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import "react-image-crop/dist/ReactCrop.css";
import { IoMdArrowBack, IoMdClose } from "react-icons/io";
import { ImFilePicture } from "react-icons/im";
import { MdEmojiEmotions } from "react-icons/md";
import setCanvasPreview from "../../utils/setCanvasPreview";
import { useCreatePostMutation } from "../../utils/slices/postApiSlice";
import { useSelector } from "react-redux";
import { ImSpinner2 } from "react-icons/im";
import { useNavigate } from "react-router-dom";

const ASPECT_RATIO = 4 / 5;
const MIN_DIMENTION = 300;

const CreatPostModal = ({ open, onClose, communityId, addNewPost }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [image, setImage] = useState("");
  const [caption, setCaption] = useState("");
  const [openCropper, setOpenCropper] = useState(false);
  const [crop, setCrop] = useState();
  const [croppedImage, setCroppedImage] = useState("");
  const [createPost, { isLoading }] = useCreatePostMutation();
  const [showEmoji, setShowEmoji] = useState(false);

  const onSelectFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.addEventListener("load", () => {
      const imageUrl = reader.result?.toString() || "";
      setImage(imageUrl);
      previewCanvasRef.current.style.display = "none";
      setOpenCropper(true);
    });
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (MIN_DIMENTION / width) * 100;
    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  //ADD EMOJI
  const addEmoji = (e) => {
    const sym = e.unified.split("_");
    const codeArray = [];
    sym.forEach((el) => codeArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codeArray);
    setCaption(caption + emoji);
  };

  const handleSubmit = async () => {
    try {
      console.log(croppedImage);
      const formData = new FormData();
      formData.append("image", croppedImage);
      formData.append("des", caption);
      if (communityId) {
        formData.append("communityId", communityId);
      }

      const res = await createPost(formData).unwrap();
      if(communityId){
        addNewPost(res)
      }
      console.log(res);
      setCaption("");
      setCroppedImage("");
      onClose();
      window.location.reload();
      window.scrollTo(0, 0);
    } catch (error) {
      console.log(error.data);
    }
  };

  function dataURLtoBlob(dataURL) {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  }

  if (!open) return null;
  return (
    <>
      <div
        onClick={() => {
          if (!openCropper) onClose();
        }}
        className="fixed  inset-0  bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center overflow-auto z-50"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="h-auto w-[600px] text-white  fixed top-8 transition-transform translate-y-6 px-5 pt-2 bg-gray-800 rounded-xl "
        >
          <div className="py-2">
            {!openCropper ? (
              <p onClick={onClose}>
                <IoMdClose size={25} />
              </p>
            ) : (
              <div className="flex justify-between items-center">
                <div className="flex space-x-6">
                  <IoMdArrowBack
                    onClick={() => setOpenCropper(false)}
                    className=""
                    size={30}
                  />
                  <p className="text-xl font-bold">Crop media</p>
                </div>
                <button
                  // onClick={handleCropComplete}
                  onClick={() => {
                    setCanvasPreview(
                      imgRef.current,
                      previewCanvasRef.current,
                      convertToPixelCrop(
                        crop,
                        imgRef.current.width,
                        imgRef.current.height
                      )
                    );
                    const dataUrl = previewCanvasRef.current.toDataURL();
                    previewCanvasRef.current.style.display = "block";

                    const blob = dataURLtoBlob(dataUrl);

                    // Create a File from the Blob
                    const file = new File([blob], "cropped_image.jpg", {
                      type: "image/jpeg",
                    });

                    // console.log(file);
                    setCroppedImage(file);
                    setOpenCropper(false);
                    // console.log(dataUrl);
                  }}
                  className="text-black px-4 text-lg bg-white rounded-2xl font-semibold"
                >
                  Save
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center py-4">
            <img
              className="h-10 rounded-full"
              src={userInfo.pic ? userInfo.pic : "/img/no_profile.jpg"}
              alt=""
            />
            <input
              className="bg-transparent w-full focus:outline-none px-4 text-xl text-gray-400"
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What s happening?!"
            />
          </div>

          {openCropper && (
            <div className="flex flex-col items-center mb-4">
              <ReactCrop
                crop={crop}
                onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
                keepSelection
                aspect={ASPECT_RATIO}
                minWidth={MIN_DIMENTION}
              >
                <img
                  ref={imgRef}
                  src={image}
                  alt=""
                  style={{ maxHeight: "70vh" }}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            </div>
          )}

          <div
            onClick={() => {
              previewCanvasRef.current.style.display = "none";
              setOpenCropper(true);
            }}
            className="flex justify-center items-center"
          >
            <canvas
              ref={previewCanvasRef}
              className="mt-4"
              style={{
                display: "none",
                // border: "1px solid black",
                objectFit: "contain",
                width: 3500,
                height: 500,
              }}
            />
          </div>
          {isLoading && (
            <div className="fixed  inset-0  bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
              <ImSpinner2 className="animate-spin" size={27} />
            </div>
          )}

          {!openCropper && (
            <>
              {" "}
              <hr className="h-px mt-16  bg-gray-200 border-0 dark:bg-gray-700" />
              <div className="flex p-4 justify-between">
                <div className="flex space-x-4">
                  <div>
                    <label htmlFor="fileInput" className="cursor-pointer">
                      <p className="">
                        <ImFilePicture size={24} />
                      </p>
                    </label>
                    <input
                      id="fileInput"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={onSelectFile}
                    />
                  </div>
                  <p onClick={() => setShowEmoji(!showEmoji)} className="">
                    {" "}
                    <MdEmojiEmotions size={24} />
                  </p>
                </div>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-1 rounded-2xl bg-red-600 font-bold"
                >
                  Post
                </button>
              </div>
            </>
          )}
        </div>
        {showEmoji && !openCropper && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 left-[28rem]"
          >
            <Picker
              data={data}
              onEmojiSelect={addEmoji}
              emojiSize={20}
              emojiButtonSize={30}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default CreatPostModal;
