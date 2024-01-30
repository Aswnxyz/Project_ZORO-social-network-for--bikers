import React, { useEffect, useState } from 'react'
import { useGetEventsMutation } from '../utils/slices/EventApiSlice';
import { LuDot } from "react-icons/lu";
import { FaRegStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const EventsHome = () => {
  const [getEvents] = useGetEventsMutation();
  const [events,setEvents] = useState([]);
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


  const fetchData = async ()=>{
    try {
      const res = await getEvents().unwrap();
      console.log(res)
      setEvents(res)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    fetchData()
  },[])
  return (
    <div className="px-4 py-2 ">
      <h1 className="text-2xl font-semibold">Discover events</h1>
      <div className="my-3 grid grid-cols-3 gap-3">
        {events.length > 0
          ? events.map((event) => (
              <Link to={`/events/${event._id}`}>
                <div className="flex flex-col bg-gray-900 ring-1 ring-black ring-opacity-5 rounded-lg">
                  <img
                    className="rounded-lg h-36"
                    src={event?.image?.url}
                    alt=""
                  />
                  <div className="px-2 py-1">
                    <span className="text-sm font-bold">
                      {formatDateString(event.startDate)} AT{" "}
                      {formatTimeString(event.startTime)}
                    </span>
                    <p className="text-2xl font-semibold">{event.name}</p>
                    <span className="text-sm text-gray-400">
                      {event.location}
                    </span>
                    <div className="flex items-center text-gray-400">
                      <span>{event.interested.length} interested</span>
                      <LuDot className="" />
                      <span>{event.going.length} going</span>
                    </div>
                    <div className="flex justify-center items-center space-x-3 rounded-md py-1 px-3 my-2 bg-gray-600">
                      <FaRegStar size={20} />{" "}
                      <span className="text-lg font-semibold ">Interested</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          : null}
      </div>
    </div>
  );
}

export default EventsHome