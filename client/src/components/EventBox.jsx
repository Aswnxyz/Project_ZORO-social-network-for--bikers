import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetEventByIdMutation,
  useRespondEventMutation,
} from "../utils/slices/EventApiSlice";
import { IoPeople } from "react-icons/io5";
import { FaRegStar, FaStar, FaUser } from "react-icons/fa";
import { FaLocationDot, FaRightFromBracket } from "react-icons/fa6";
import {
  IoIosArrowDown,
  IoIosCheckmarkCircle,
  IoIosCheckmarkCircleOutline,
  IoIosMail,
} from "react-icons/io";
import { CiMail } from "react-icons/ci";
import { MdDoNotDisturb } from "react-icons/md";
import { useSelector } from "react-redux";
import InviteEventModal from "./Modals/InviteEventModal";
import { ImSpinner2 } from "react-icons/im";

const EventBox = () => {
  const [inviteFollowers,setInviteFollowers] = useState(false)
  const {userInfo} = useSelector(state=>state.auth)
  const { eventId } = useParams();
  const [response, setResponse] = useState("");
  const [getEvent,{isLoading}] = useGetEventByIdMutation();
  const [eventData, setEventData] = useState();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [respondEvent] = useRespondEventMutation();
  // const [selectedOptions, setSelectedOptions] = useState({
  //   going: false,
  //   interested: false,
  //   notInterested: false,
  // });
  const handleOptionToggle = (selectedOption) => {
    setSelectedOptions((prevOptions) => ({
      going: selectedOption === "going" ? !prevOptions.going : false,
      interested:
        selectedOption === "interested" ? !prevOptions.interested : false,
      notInterested: selectedOption === "notInterested" ? !prevOptions.notInterested : false,
    }));
    setIsDropdownOpen(false)
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

  const fetchData = async () => {
    try {
      const res = await getEvent({ eventId }).unwrap();
      console.log(res);
      setEventData(res);
      if(res.interested.includes(userInfo.id)){
        setResponse("Interested")
      }else if(res.going.includes(userInfo.id)){
        setResponse("Going")
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleRespondEvent = async (response) => {
    try {
      setResponse(response);
      const res = await respondEvent({response:response.toLowerCase(),eventId}).unwrap();
      setEventData(res)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();

  }, [eventId]);
  return (
    <>
      <div className="text-white px-4 py-2 pb-10 overflow-y-auto">
        <div className="px-6">
          <div className="flex justify-center items-center">
            <img className="h-80 w-auto" src={eventData?.image?.url} alt="" />
          </div>
          <div className="flex flex-col ">
            <div className="flex space-x-3 items-center text-sm text-bold">
              <span>{`${formatDateString(
                eventData?.startDate
              )} AT ${formatTimeString(eventData?.startTime)}`}</span>
              {eventData?.endDate && (
                <span>{`${formatDateString(
                  eventData?.endDate
                )} AT ${formatTimeString(eventData?.endTime)}`}</span>
              )}
            </div>
            <h1 className="text-2xl font-bold">{eventData?.name}</h1>
            <p>{eventData?.location}</p>
          </div>
          {/* <hr className="border-none h-px bg-gray-700 my-3" /> */}
          <div className="flex justify-end py-2 my-2 border-y border-gray-700 ">
            <div className="flex items-center space-x-2">
              {eventData?.createrId !== userInfo.id && (
                <div className=" flex relative">
                  {!response ? (
                    <div className="flex space-x-2  ">
                      <div
                        onClick={() => {
                          handleRespondEvent("Interested");
                          handleOptionToggle("interested");
                        }}
                        className="flex justify-center items-center space-x-3 rounded-md py-1 px-2 my-2 bg-gray-600"
                      >
                        <FaRegStar size={18} />{" "}
                        <span className="text-lg font-semibold ">
                          Interested
                        </span>
                      </div>
                      <div
                        onClick={() => {
                          handleRespondEvent("Going");
                          handleOptionToggle("going");
                        }}
                        className="flex justify-center items-center space-x-3 rounded-md py-1 px-3 my-2 bg-gray-600"
                      >
                        <IoIosCheckmarkCircleOutline size={18} />{" "}
                        <span className="text-lg font-semibold ">Going</span>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex justify-center items-center space-x-3 rounded-md py-1 px-2 my-2 bg-gray-600"
                    >
                      {response === "Interested" ? (
                        <FaRegStar size={18} />
                      ) : (
                        <IoIosCheckmarkCircleOutline size={18} />
                      )}
                      <span className="text-lg font-semibold ">{response}</span>
                      <IoIosArrowDown
                        className={`${isDropdownOpen && "rotate-180"}`}
                      />
                    </div>
                  )}
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
                          checked={eventData?.interested.includes(userInfo.id)}
                          onChange={() => {
                            // handleOptionToggle("interested");
                            handleRespondEvent("Interested");
                          }}
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
                          checked={eventData?.going.includes(userInfo.id)}
                          onChange={() => {
                            // handleOptionToggle("going");
                            handleRespondEvent("Going");
                          }}
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
                          checked={false}
                          onChange={() => {
                            // handleOptionToggle("notInterested");
                            handleRespondEvent("");
                          }}
                          className=""
                          name=""
                          id=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div
                onClick={() => setInviteFollowers(true)}
                className="flex justify-center items-center space-x-3 rounded-md py-1 px-3 my-2 bg-gray-600"
              >
                <CiMail size={18} />{" "}
                <span className="text-lg font-semibold ">Invite</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2 ">
            <div className=" w-1/2 bg-gray-800 p-2">
              <h1 className="text-xl font-semibold ">Details</h1>
              <div className="space-y-3 my-2">
                <div className="flex items-center ">
                  <IoPeople size={20} />
                  <div className="flex text-xs items-center mx-2 space-x-1">
                    <span className="">
                      {eventData?.interested?.length + eventData?.going?.length}
                    </span>
                    <p>people responded</p>
                  </div>
                </div>
                <div className="flex items-center ">
                  <FaUser size={20} />
                  <div className="flex text-xs items-center mx-2 space-x-1">
                    <span className="">Event by</span>
                    <p className="font-bold">{eventData?.creater?.fullName}</p>
                  </div>
                </div>
                <div className="flex items-center ">
                  <FaLocationDot size={20} />
                  <div className="flex text-xs items-center mx-2 space-x-1">
                    <p className="">{eventData?.location}</p>
                  </div>
                </div>
              </div>
              <p className="text-sm">{eventData?.details}</p>
            </div>
            <div className="w-1/2 bg-gray-800 p-2 ">
              <h1 className="text-xl font-semibold">Guests</h1>
              <div className="flex justify-evenly text-lg font-semibold py-4">
                <div className="flex flex-col items-center justify-center">
                  <span>{eventData?.going?.length}</span>
                  <span>Going</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <span>{eventData?.interested?.length}</span>
                  <span>Interested</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {inviteFollowers && (
        <InviteEventModal
          eventId={eventId}
          onClose={() => setInviteFollowers(false)}
        />
      )}
      {/* {isLoading && (
        <div className="fixed  inset-0  bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
          <ImSpinner2 className="animate-spin" size={27} />
        </div>
      )} */}
    </>
  );
};

export default EventBox;
