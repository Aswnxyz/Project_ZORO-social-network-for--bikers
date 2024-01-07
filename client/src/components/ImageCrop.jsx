import React, { useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import ReactCrop, { centerCrop, convertToPixelCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import setCanvasPreview from "../utils/setCanvasPreview";

const MIN_DIMENTION = 300;

const ProfileImageCropper = ({ src, imgType, setCompletedCrop,onClose}) => {
  const [crop, setCrop] = useState();
    const imgRef = useRef(null);
  const [aspect, setAspect] = useState(imgType === "profile" ? 1 : 16 / 9);

   const onImageLoad = (e) => {
     const { width, height } = e.currentTarget;
     const cropWidthInPercent = (MIN_DIMENTION / width) * 100;
     const crop = makeAspectCrop(
       {
         unit: "%",
         width: cropWidthInPercent,
       },
       aspect,
       width,
       height
     );
     const centeredCrop = centerCrop(crop, width, height);
     setCrop(centeredCrop);
   };

  return (
    <div>
      <div className="flex justify-between py-2 bg-black">
        <div className="flex items-center  space-x-4">
          <p
           onClick={onClose}
          >
            <IoMdClose size={25} />
          </p>
          <h1 className="text-lg font-semibold">
            Edit media
          </h1>
        </div>

        <button
          onClick={() => {
                const canvas = document.createElement("canvas");

              setCanvasPreview(
                imgRef.current,
                canvas,
                convertToPixelCrop(
                  crop,
                  imgRef.current.width,
                  imgRef.current.height
                )
              );
              const dataUrl = canvas.toDataURL();
              // previewCanvasRef.current.style.display = "block";
              setCompletedCrop(dataUrl);
              // setOpenCropper(false);
            
          }}
          className=" font-semibold px-5 py-1 text-black bg-white rounded-2xl"
        >
          Apply
        </button>
      </div>
      <div className="flex justify-center items-center overflow-auto ">
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          // onComplete={(c) => setCompletedCrop(c)}
          keepSelection
          aspect={aspect}
          minWidth={MIN_DIMENTION}
          // minHeight={100}
        >
          <img
            ref={imgRef}
            src={src}
            alt=""
            style={{ maxHeight: "70vh" }}
            onLoad={onImageLoad}
          />
        </ReactCrop>
      </div>
    </div>
  );
};

export default ProfileImageCropper;
