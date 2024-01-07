import React from "react";
import { useSelector } from "react-redux";

const RightSidebar = () => {

    const {userInfo} = useSelector(state => state.auth);


  return (
    <div className="fixed top-0 right-0 border-l bg-black border-gray-700 w-[22rem] h-screen text-white z-40">
      <div className="flex m-4">
        <img
          className="h-12 rounded-full"
          src={userInfo.pic ? userInfo.pic :"/img/profile_icon.jpeg"}
          alt=""
        />
        <div className="px-3">
          <div className="">
            <p className="text-white font-semibold">@{userInfo.userName}</p>
            <p className="text-base dark:text-gray-500 font-normal ">{userInfo.fullName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
