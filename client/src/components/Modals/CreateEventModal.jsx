import React, { useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { useCreateEventMutation } from "../../utils/slices/EventApiSlice";

const CreateEventModal = ({ onClose }) => {
  const [startDate, setStartDate] = useState("");
  const [eventName, setEventName] = useState("");
  const [startTime, setStartTime] = useState("");

  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");
  const [places, setPlaces] = useState([]);
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);
  const [CreateEvent] = useCreateEventMutation();

  const handleImage = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
   function getTodayDateString() {
     const today = new Date();
     const year = today.getFullYear();
     const month = (today.getMonth() + 1).toString().padStart(2, "0");
     const day = today.getDate().toString().padStart(2, "0");
     return `${year}-${month}-${day}`;
   }

  const handleLocationAPI = async (e) => {
    const updatedSearch = e.target.value;
    console.log(updatedSearch);
    setLocation(updatedSearch);
    if (updatedSearch) {
      fetch(`
https://api.mapbox.com/geocoding/v5/mapbox.places/${updatedSearch}.json?access_token=pk.eyJ1Ijoic2FjaGlubXMiLCJhIjoiY2xyN202c285MHBsNDJrcGF5Z2xmNTgyaCJ9.C35EQx1Ogm7j7YTXxtSCXA`)
        .then(async (res) => {
          const result = await res.json();
          // console.log(result)

          if (result.features) {
            console.log(result.features);
            setPlaces(result.features);
          }
        })
        .catch((error) => {
          // Handle any errors in fetching data from mapbox
          console.error("Error fetching data:", error);
        });
    }
  };

  const handleCreateEvent = async () => {
    if (
      !image ||
      !eventName ||
      !details ||
      !location ||
      !startDate ||
      !startTime 
      
    ) {
      console.log(image, eventName, details, location, startDate, startTime);
      return;
    }
    try {
      const res = await CreateEvent({
        image,
        name: eventName,
        location,
        startDate,
        startTime,
        details,
        endDate,
        endTime
      }).unwrap();
      console.log(res);
      onClose()
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed  inset-0  bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center overflow-auto z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="h-auto w-[600px] text-white  fixed top-8 transition-transform translate-y-6 px-5 pt-2 bg-gray-800 rounded-xl "
      >
        <div className="relative">
          <p className="text-center text-lg font-bold">Create event</p>
          <IoCloseSharp
            onClick={onClose}
            className="absolute right-0 top-0 "
            size={27}
          />
        </div>
        <div className="relative h-40 my-3 bg-slate-700 w-full">
          {!image ? (
            <button
              onClick={handleImageClick}
              className="absolute right-0 bottom-0 bg-gray-800 rounded-lg px-2 py-1 m-2"
            >
              Add cover photo
            </button>
          ) : (
            <img className="w-full h-full" src={image} />
          )}
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleImage}
          />
        </div>

        <input
          type="text"
          placeholder="Event name"
          className="bg-black p-3 w-full mb-2 "
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          name=""
          id=""
        />
        <div className="flex justify-between">
          <div class="mb-4">
            <label
              for="eventDate"
              class="block text-gray-700 text-sm font-bold mb-2"
            >
              Start Date:
            </label>
            <input
              type="date"
              id="eventDate"
              name="eventDate"
              value={startDate}
              min={getTodayDateString()}
              onChange={(e) => setStartDate(e.target.value)}
              class="border rounded w-full  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div class="mb-4">
            <label
              for="eventTime"
              class="block text-gray-700 text-sm font-bold mb-2"
            >
              Start Time:
            </label>
            <input
              type="time"
              id="eventTime"
              name="eventTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              class="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>
        <div>
          {" "}
          {toggleDropdown && (
            <div className="flex justify-between">
              <div class="mb-4">
                <label
                  for="eventDate"
                  class="block text-gray-700 text-sm font-bold mb-2"
                >
                  End Date:
                </label>
                <input
                  type="date"
                  id="eventDate"
                  name="eventDate"
                  value={endDate}
                  min={getTodayDateString()}
                  onChange={(e) => setEndDate(e.target.value)}
                  class="border rounded w-full  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div class="mb-4">
                <label
                  for="eventTime"
                  class="block text-gray-700 text-sm font-bold mb-2"
                >
                  End Time:
                </label>
                <input
                  type="time"
                  id="eventTime"
                  name="eventTime"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  class="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
          )}
          <div
            onClick={() => setToggleDropdown(!toggleDropdown)}
            className="flex items-center space-x-2"
          >
            <IoIosArrowDown className={`${toggleDropdown && "rotate-180"}`} />
            <span className="text-sm text-blue-600">End date and time</span>
          </div>
        </div>
        <div className="p-3 bg-black my-2 relative">
          <input
            type="text"
            className="py-1 w-full bg-transparent outline-none"
            placeholder="Add location"
            value={location}
            onChange={handleLocationAPI}
            

            // onChange={(e) => setLocation(e.target.value)}
          />
          <div
            className={`${
              places.length > 0
                ? "origin-center absolute inset-x-0    mt-2"
                : "hidden"
            } w-56 rounded-md shadow-lg bg-gray-900 ring-1 ring-black ring-opacity-5`}
          >
            {/* Dropdown content */}
            <div className="py-1 overflow-y-auto">
              {places.map((place) => (
                <div
                  onClick={() => {
                    setLocation(place.text);
                    setPlaces([]);
                  }}
                  className=" flex items-center px-4 py-2 text-sm  space-x-3"
                >
                  {/* <FaRightFromBracket /> */}

                  <span>{place.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="p-3 bg-black mt-2 ">
          <input
            type="text"
            className="py-1 w-full bg-transparent outline-none"
            placeholder="What are the details?"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </div>
        <button
          onClick={handleCreateEvent}
          className="bg-blue-600 py-1 px-2 w-full my-4"
        >
          Create event
        </button>
      </div>
    </div>
  );
};

export default CreateEventModal;
