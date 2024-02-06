import React, { useEffect } from "react";
import MyClubs from "../../components/MyClubs";
import ClubBox from "../../components/ClubBox";
import { Outlet, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const Clubs = () => {
  const navigate = useNavigate()
  useEffect(()=>{
    console.log(window.location)
    if(window.location.pathname==="/clubs"){

      navigate('/clubs/discover')
    }
  },[])
  return (
    <div className="flex  h-screen text-white">
      <MyClubs />
      <div className="w-3/4 py-2 flex flex-col border-gray-800 dark:border-gray-700 border-r  relative z-10">
             <ToastContainer />
        <Outlet />
      </div>
    </div>
  );
};

export default Clubs;
