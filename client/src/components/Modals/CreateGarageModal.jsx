import React, { useRef, useState } from "react";
import { IoMdArrowBack, IoMdClose } from "react-icons/io";
import { MdAddToPhotos } from "react-icons/md";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import setCanvasPreview from "../../utils/setCanvasPreview";
import { useCreateGarageMutation } from "../../utils/slices/userApiSlice";

const ASPECT_RATIO = 4 / 5;
const MIN_DIMENTION = 300;

const CreateGarageModal = ({ onClose, updateGarage }) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState("");
  const [nickName, setNickName] = useState("");
  const [model, setModel] = useState("");
  const [image, setImage] = useState("");
  const [openCropper, setOpenCropper] = useState(false);
  const [crop, setCrop] = useState();
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [croppedImage, setCroppedImage] = useState("");
  const [createGarage] = useCreateGarageMutation();

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

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

  const handleSubmit = async () => {
    try {
      const res = await createGarage({
        nickName,
        media: croppedImage,
        model,
        year: parseInt(selectedYear),
      }).unwrap();
      updateGarage(res)
      setSelectedYear("");
      setModel("");
      setNickName("");
      setCroppedImage("");
      onClose();
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div
      onClick={() => {
        if (!openCropper) onClose();
      }}
      className="fixed  inset-0  bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center overflow-auto z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="h-auto w-[550px] text-white  fixed top-8 transition-transform translate-y-6 px-5 py-2 bg-black rounded-xl "
      >
        <div className="py-2">
          {!openCropper ? (
            <div className="flex justify-between py-2 bg-black">
              <div className="flex items-center  space-x-4">
                <p onClick={onClose}>
                  <IoMdClose size={25} />
                </p>
              </div>
              <h1 className="text-lg font-semibold">New Bike</h1>

              <button
                onClick={handleSubmit}
                className=" font-semibold px-5 py-1 text-black bg-white rounded-2xl"
              >
                Save
              </button>
            </div>
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
                  setCroppedImage(dataUrl);
                  setOpenCropper(false);
                  // console.log(dataUrl);
                }}
                className="text-black px-4 text-lg bg-white rounded-2xl font-semibold"
              >
                Apply
              </button>
            </div>
          )}
        </div>

        {!openCropper && !image && (
          <div className="flex justify-center items-center">
            <div className="w-56 h-72 p-2 flex justify-center items-center shadow-lg border border-gray-800">
              <label htmlFor="fileInput" className="cursor-pointer">
                <MdAddToPhotos
                  className="text-gray-600 hover:opacity-100 opacity-50"
                  size={125}
                />
              </label>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={onSelectFile}
              />
            </div>
          </div>
        )}
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
        <div className="w-full h-14 mt-4 border-2 px-2 border-gray-800 rounded">
          <span className="text-xs text-gray-400">NickName</span>
          <div>
            <input
              className="bg-black w-full focus:outline-none"
              type="text"
              onChange={(e) => setNickName(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full h-14 mt-4 border-2 px-2 border-gray-800 rounded">
          <span className="text-xs text-gray-400">Model</span>
          <div>
            <input
              className="bg-black w-full focus:outline-none"
              type="text"
              onChange={(e) => setModel(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full h-14 mt-4 border-2 px-2 border-gray-800 rounded">
          <label className="text-xs text-gray-400" htmlFor="yearSelect">
            Year
          </label>

          {/* <span className="text-xs text-gray-400">Select a Year:</span> */}
          <div>
            {/* <input className="bg-black w-full focus:outline-none" type="text" /> */}
            <select
              className="bg-black w-full focus:outline-none"
              id="yearSelect"
              name="yearSelect"
              value={selectedYear}
              onChange={handleYearChange}
              required
            >
              <option value="" disabled>
                Select a year
              </option>
              {Array.from({ length: currentYear - 1900 + 1 }, (_, index) => (
                <option key={index} value={currentYear - index}>
                  {currentYear - index}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGarageModal;
