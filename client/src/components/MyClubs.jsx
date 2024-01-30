import React, { useState } from "react";
import { BsSearch } from "react-icons/bs";
import { FaRegCompass } from "react-icons/fa";
import { IoIosArrowRoundBack, IoMdAdd } from "react-icons/io";
import { MdOutlineGroup } from "react-icons/md";
import CreateClubModal from "./Modals/CreateClubModal";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSearchCommunitiesMutation } from "../utils/slices/communityApiSlice";

const MyClubs = () => {
  const [searchClicked, setSearchClicked] = useState(false);
  const [createClubModal, setCreateClubModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);
  const [searchClubs] = useSearchCommunitiesMutation();

  const handleSearch = async (value) => {
    try {
      const res = await searchClubs({ searchInput: value }).unwrap();
      console.log(res);

      setSearchResults(res);
    } catch (error) {
      console.error(error);
    }
  };
  const handleChange = (e) => {
    const { value } = e.target;
    setSearchInput(value);

    handleSearch(value); // Trigger search on each change
  };
  return (
    <>
      <div className="w-1/4 border-r  border-gray-800 dark:border-gray-700 py-4 z-0">
        <h1 className="text-2xl font-semibold">Communities</h1>
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
                onChange={handleChange}
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
              <Link to={"/clubs/discover"}>
                <div className="flex items-center text-lg space-x-4">
                  <FaRegCompass size={24} />

                  <span>Home</span>
                </div>
              </Link>

              <Link to={"/clubs/joins"}>
                <div className="flex items-center text-lg space-x-4">
                  <MdOutlineGroup size={24} />

                  <span>Your communities</span>
                </div>
              </Link>
            </div>
            <div
              onClick={() => setCreateClubModal(true)}
              className="flex justify-center bg-gray-900   py-2 px-10 mt-8 text-blue-600 items-center text-lg space-x-3 mr-8"
            >
              <IoMdAdd size={24} /> <span>Create new club</span>
            </div>
          </>
        )}
      </div>
      {createClubModal && (
        <CreateClubModal onClose={() => setCreateClubModal(false)} />
      )}
    </>
  );
};

export default MyClubs;
