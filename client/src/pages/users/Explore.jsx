import React, { useEffect, useState } from "react";
import RightSidebar from "../../components/RightSidebar";
import { BsSearch } from "react-icons/bs";
import { useSelector } from "react-redux";
import { IoMdClose } from "react-icons/io";
import {  useAddToRecentSearchMutation, useClearRecentSearchMutation, useGetRecentSearcheMutation, useSearchUsersMutation } from "../../utils/slices/userApiSlice";
import { Link } from "react-router-dom";

const Explore = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches,setRecentSearches] = useState([]);
  const [searchUser] = useSearchUsersMutation();
  const [addRecentSearch] = useAddToRecentSearchMutation();
  const [getRecentSearches] = useGetRecentSearcheMutation();
  const[clearRecentSearch]= useClearRecentSearchMutation()
  const { userInfo } = useSelector((state) => state.auth);
  const handleSearch = async () => {
      try {

      const res = await searchUser({ searchInput }).unwrap();
      setSearchResults(res);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange =  (e) => {
    const { value } = e.target;
     setSearchInput(value);
    

    handleSearch(); // Trigger search on each change
  };

  const handleAddRecentSearch = async (userId)=>{
    try {
      const res=await  addRecentSearch({userId}).unwrap()
    } catch (error) {
      console.log(error)
    }
  }

  const handleClearRecentSearches= async ()=>{
    try {
      const res= await clearRecentSearch().unwrap();
      setRecentSearches([])
    } catch (error) {
      console.log(error.data)
    }
  }

  const fetchData = async ()=>{
    try {
      const res = await getRecentSearches().unwrap();
      setRecentSearches(res)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    fetchData()
  },[])

  return (
    <>
      <div className="w-[53rem] text-white px-28 py-3 z-10">
        <div className="flex justify-center items-center">
          {" "}
          <div className="flex items-center w-[24rem] px-3 py-2 space-x-6 bg-slate-700 rounded-3xl">
            <p className="">
              {" "}
              <BsSearch size={20} />
            </p>
            <input
              className="w-full bg-transparent focus:outline-none"
              placeholder="Search"
              type="text"
              onChange={handleChange}
            />
          </div>
        </div>
        <hr className="my-6 border border-gray-800" />

        {searchInput ? (
          searchResults.map((user) => (
            <Link to={`/${user.userName}`}>
              <div key={user._id}
                onClick={() => handleAddRecentSearch(user._id)}
                className="flex m-4"
              >
                <img
                  className="h-12 rounded-full"
                  src={
                    user.profilePic
                      ? user.profilePic?.url
                      : "/img/profile_icon.jpeg"
                  }
                  alt=""
                />
                <div className="px-3">
                  <div className="">
                    <p className="text-white font-semibold">{user.userName}</p>
                    <p className="text-base dark:text-gray-500 font-normal ">
                      {user.fullName}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div>
            <div className="flex justify-between font-semibold px-4">
              <p>Recent</p>
              {recentSearches.length > 0 && (
                <p onClick={handleClearRecentSearches} className="text-red-400">Clear all</p>
              )}
            </div>
            {recentSearches.length > 0 ? (
              recentSearches.map((user) => (
                <div key={user._id} className="flex justify-between items-center">
                  <div className="flex m-4">
                    <img
                      className="h-12 rounded-full"
                      src={
                        user.profilePic
                          ? user.profilePic?.url
                          : "/img/profile_icon.jpeg"
                      }
                      alt=""
                    />
                    <div className="px-3">
                      <div className="">
                        <p className="text-white font-semibold">
                          {user.userName}
                        </p>
                        <p className="text-base dark:text-gray-500 font-normal ">
                          {user.fullName}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="px-4">
                    <IoMdClose size={24} />
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center mt-64">No recent searches.</p>
            )}
          </div>
        )}
      </div>
      <RightSidebar />
    </>
  );
};

export default Explore;
