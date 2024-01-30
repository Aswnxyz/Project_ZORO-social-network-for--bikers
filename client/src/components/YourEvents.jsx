import React, { useCallback, useEffect, useState } from "react";
import {
  useGetEventsBySegmentMutation,
  useRespondEventMutation,
} from "../utils/slices/EventApiSlice";
import { LuDot } from "react-icons/lu";
import { FaRegStar, FaStar } from "react-icons/fa";
import {
  IoIosArrowDown,
  IoIosCheckmarkCircle,
  IoIosCheckmarkCircleOutline,
} from "react-icons/io";
import { MdDoNotDisturb } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const YourEvents = () => {
  const [segment, setSegment] = useState();
  const [eventsList, setEventsList] = useState([]);
  const [getEvents] = useGetEventsBySegmentMutation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const [respondEvent] = useRespondEventMutation();

  const handleRespondEvent = async (response, eventId) => {
    try {
      const res = await respondEvent({
        response,
        eventId,
      }).unwrap();
      console.log(res);
      setEventsList((prev) =>
        prev.map((event) => (event._id === res._id ? res : event))
      );
      console.log("completed");
      setIsDropdownOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const fetchData = async (selectedType) => {
    try {
      const res = await getEvents({ selectedType }).unwrap();
      console.log(res);
      setEventsList(res);
    } catch (error) {
      console.log(error);
    }
  };
  const formatDateString = (dateString) => {
    const options = { weekday: "short", month: "short", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  };
  const formatTimeString = (timeString) => {
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    const formattedTime = new Date(
      `1970-01-01T${timeString}Z`
    ).toLocaleTimeString("en-US", options);
    return formattedTime;
  };
  useEffect(() => {
    const currentUrl = window.location.href;
    const pathSegments = currentUrl.split("/");

    // Get the last segment of the path
    const lastSegment = pathSegments[pathSegments.length - 1];
    setSegment(lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1));
    fetchData(lastSegment);
  }, [window.location.href]);
  return (
    <div className="px-32 py-10 overflow-y-auto">
      <div>
        <h1 className="text-xl font-semibold">{segment}</h1>
        <span className="text-sm text-gray-400">
          {eventsList?.length} Events
        </span>
      </div>
      <div className="p-3 bg-gray-900 ">
        {eventsList?.map((event) => (
          <div
            key={event._id}
            className="flex items-center justify-between  mb-4"
          >
            <Link to={`/events/${event._id}`}>
              <div className="flex items-center space-x-4">
                <img className="h-32 w-36" src={event?.image?.url} alt="" />
                <div>
                  <div className="flex space-x-3 items-center text-sm  text-bold">
                    <span>{`${formatDateString(
                      event?.startDate
                    )} AT ${formatTimeString(event?.startTime)}`}</span>
                    {/* {event?.endDate && (
                    <span>{`${formatDateString(
                      event?.endDate
                    )} AT ${formatTimeString(event?.endTime)}`}</span>
                  )} */}
                  </div>
                  <p className="text-lg font-semibold">{event.name}</p>
                  <span className="text-sm text-gray-400">
                    {event.location}
                  </span>
                  <div className="flex items-center text-gray-400">
                    <span>{event.interested.length} interested</span>
                    <LuDot className="" />
                    <span>{event.going.length} going</span>
                  </div>
                </div>
              </div>
            </Link>
            {event.createrId !== userInfo.id && (
              <div>
                <div
                  onClick={handleToggleDropdown}
                  className="flex justify-center items-center space-x-3 rounded-md py-1 px-2 my-2 bg-gray-600"
                >
                  <IoIosCheckmarkCircleOutline size={18} />{" "}
                  <span className="text-lg font-semibold ">
                    {event.interested.includes(userInfo.id)
                      ? "Interested"
                      : event.going.includes(userInfo.id)
                      ? "Going"
                      : segment}
                  </span>
                  {(event.interested.includes(userInfo.id) ||
                    event.going.includes(userInfo.id)) && <IoIosArrowDown />}
                </div>
                <div
                  className={`${
                    isDropdownOpen
                      ? "origin-bottom absolute right-0 top-10  mt-2"
                      : "hidden"
                  } w-56 rounded-md shadow-lg bg-gray-900 ring-1 ring-black ring-opacity-5`}
                >
                  {/* Dropdown content */}
                  <div className="py-1">
                    <div className=" flex justify-between items-center px-4 py-2 text-sm  ">
                      <div className="flex items-center space-x-3">
                        <FaStar size={20} />

                        <span>Interested</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={event.interested.includes(userInfo.id)}
                        onChange={() =>
                          handleRespondEvent("interested", event._id)
                        }
                        className=""
                        name=""
                        id=""
                      />
                    </div>
                    <div className=" flex justify-between items-center px-4 py-2 text-sm  ">
                      <div className="flex items-center space-x-3">
                        <IoIosCheckmarkCircle size={20} />

                        <span>Going</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={event.going.includes(userInfo.id)}
                        onChange={() => handleRespondEvent("going", event._id)}
                        className=""
                        name=""
                        id=""
                      />
                    </div>
                    <div className=" flex justify-between items-center px-4 py-2 text-sm  ">
                      <div className="flex items-center space-x-3">
                        <MdDoNotDisturb size={20} />

                        <span>Not Interested</span>
                      </div>
                      <input
                        type="checkbox"
                        onChange={() => handleRespondEvent("", event._id)}
                        className=""
                        name=""
                        id=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default YourEvents;
