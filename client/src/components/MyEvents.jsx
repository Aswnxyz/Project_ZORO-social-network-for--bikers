import React, { useState } from "react";
import { BsSearch } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { FaRegCompass, FaRightFromBracket, FaStar } from "react-icons/fa6";
import {
  IoIosArrowDown,
  IoIosArrowRoundBack,
  IoIosCheckmarkCircle,
  IoIosMail,
  IoMdAdd,
} from "react-icons/io";
import { MdEvent, MdOutlineGroup } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { GiHouse } from "react-icons/gi";
import CreateEventModal from "./Modals/CreateEventModal";

const MyEvents = () => {
  const [searchClicked, setSearchClicked] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [createEventModal, setCreateEventModal] = useState(false);
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <div className="w-1/4 border-r  border-gray-800 dark:border-gray-700 py-4 z-0">
        <h1 className="text-2xl font-semibold">Events</h1>
        <div className="flex  items-center ">
          {searchClicked && (
            <IoIosArrowRoundBack
              onClick={() => {
                setSearchInput("");
                setSearchClicked(false);
                setSearchResults([]);
              }}
              className="mt-2 mr-2"
              size={27}
            />
          )}
          <div
            onClick={() => setSearchClicked(true)}
            className={`  p-2 rounded-full my-4 ${
              searchClicked
                ? "border-blue-600 border-2"
                : "border-gray-400 border"
            }`}
          >
            <div className="flex items-center space-x-3">
              <BsSearch size={20} color="gray" />
              <input
                className="w-full bg-transparent focus:outline-none"
                value={searchInput}
                type="text"
                placeholder="Search"
                //   onChange={handleChange}
              />
            </div>
          </div>
        </div>
        {searchClicked ? (
          <div className="m-4">
            {searchResults.map((community) => (
              <Link key={community._id} to={`/clubs/${community._id}`}>
                <div className="flex items-center p-3  space-x-2 mt-2 bg-gray-800">
                  {community?.image ? (
                    <img
                      className="h-12 w-12"
                      src={community?.image?.url}
                      alt=""
                    />
                  ) : (
                    <div className="h-12 w-12 bg-red-500 flex justify-center items-center">
                      <p className="text-xl font-bold">{community.name[0]}</p>
                    </div>
                  )}
                  <p className="font-bold">{community.name}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <>
            {" "}
            <div className="flex flex-col space-y-3 mt-4">
              <Link to={"/events"}>
                <div className="flex items-center text-lg space-x-4">
                  <MdEvent size={24} />

                  <span>Home</span>
                </div>
              </Link>

              <Link to={""}>
                <div className="relative inline-block text-left w-full">
                  <div
                    onClick={toggleDropdown}
                    className="flex justify-between items-center pr-6"
                  >
                    <div className="flex items-center space-x-3">
                      <FaUserCircle size={20} />
                      <p className="text-lg">Your Events</p>
                    </div>
                    <IoIosArrowDown
                      className={`${isDropdownOpen && "rotate-180"}`}
                      size={20}
                    />
                  </div>

                  {/* Dropdown panel, show/hide based on state */}
                  <div
                    className={`${
                      isDropdownOpen ? "origin-top-right  mt-2" : "hidden"
                    } w-56 rounded-md shadow-lg bg-gray-900 ring-1 ring-black ring-opacity-5`}
                  >
                    {/* Dropdown content */}
                    <div className="py-1">
                      <Link to={"/events/going"}>
                        <div className=" flex items-center px-4 py-2 text-sm  space-x-3">
                          <IoIosCheckmarkCircle size={20} />

                          <span>Going</span>
                        </div>
                      </Link>
                      <Link to={"/events/invites"}>
                        <div className=" flex items-center px-4 py-2 text-sm  space-x-3">
                          <IoIosMail size={20} />

                          <span>Invites</span>
                        </div>
                      </Link>

                      <Link to={"/events/interested"}>
                        <div className=" flex items-center px-4 py-2 text-sm  space-x-3">
                          <FaStar size={20} />

                          <span>Interested</span>
                        </div>
                      </Link>
                      <Link to={"/events/hosting"}>
                        <div className=" flex items-center px-4 py-2 text-sm  space-x-3">
                          <GiHouse size={20} />

                          <span>Hosting</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* <div className="flex items-center text-lg space-x-4">
                <FaUserCircle size={24} />

                <span>Your Events</span>
              </div> */}
              </Link>
            </div>
            <div
              onClick={() => setCreateEventModal(true)}
              className="flex justify-center bg-gray-900   py-2 px-10 mt-8 text-blue-600 items-center text-lg space-x-3 mr-8"
            >
              <IoMdAdd size={24} /> <span>Create new event</span>
            </div>
          </>
        )}
      </div>
      {createEventModal && (
        <CreateEventModal onClose={() => setCreateEventModal(false)} />
      )}
    </>
  );
};

export default MyEvents;
