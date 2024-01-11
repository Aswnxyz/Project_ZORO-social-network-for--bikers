import React from "react";
import { CiSettings } from "react-icons/ci";
import { LuActivitySquare } from "react-icons/lu";
import { FiActivity } from "react-icons/fi";
import { Link } from "react-router-dom";



const MoreModal = ({logout,onClose}) => {
  return (
    <div
        onClick={onClose}
      className="fixed  inset-0  bg-black bg-opacity-25 flex justify-center items-center overflow-auto z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="h-auto w-64 ml-4  text-white fixed bottom-24 transition-transform translate-y-6   bg-gray-900 rounded-xl "
      >
        <ul className=" px-4 pt-4 space-y-4">
          <li>
            <Link to={"/settings/account"}>
            <div onClick={onClose} className="flex items-center space-x-2">
              <CiSettings size={24} />
              <span>Settings</span>
            </div></Link>
          </li>
          <li>
            <div className="flex items-center space-x-2">
              <FiActivity size={24}/>

              <span>Activity</span>
            </div>
          </li>
          {/* <li>jsdnvd</li> */}
        </ul>
        {/* <hr className="my-4 w-full bg-white " /> */}
        <button onClick={logout} className="p-4 border-t border-gray-600 mt-4 text-left w-full">
          {" "}
          Log out
        </button>
      </div>
    </div>
  );
};

export default MoreModal;
