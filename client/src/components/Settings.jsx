import React, { useEffect } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { CiUser } from "react-icons/ci";
import { IoKeyOutline } from "react-icons/io5";
import { PiHeartBreakLight } from "react-icons/pi";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";





const Settings = () => {
    const navigate = useNavigate();
    useEffect(()=>{
        navigate("/settings/account")
    },[])
  return (
    <>
      <ToastContainer />

      <div className="flex h-screen text-gray-200 py-4 ">
        <div className="w-2/6  border-r border-gray-700">
          <h1 className="text-2xl font-semibold">Settings</h1>
          <ul className="my-8 pr-8">
            <Link to={"/settings/account"}>
              <li className="py-4  border-b border-gray-700">
                <div className="flex justify-between">
                  <span>Your account</span>
                  <IoIosArrowForward color="gray" size={24} />
                </div>
              </li>
            </Link>
            <Link to={"/settings/privacy-setting"}>
            <li className="py-4  border-b border-gray-700">
              <div className="flex justify-between">
                <span>Account privacy</span>
                <IoIosArrowForward color="gray" size={24} />
              </div>
            </li></Link>
            <li className="py-4  border-b border-gray-700">
              <div className="flex justify-between">
                <span>Help</span>
                <IoIosArrowForward color="gray" size={24} />
              </div>
            </li>
          </ul>
        </div>
        <div className="w-4/6 px-8 border-r border-gray-700">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Settings;
