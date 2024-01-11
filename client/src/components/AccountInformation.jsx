import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import { useGetCurrentUserMutation } from "../utils/slices/userApiSlice";
import { Link } from "react-router-dom";

const AccountInformation = () => {
  const [getUser] = useGetCurrentUserMutation();
  const [userData,setUserData]= useState(null)

  const fetchData = async () => {
    try {
      const user = await getUser().unwrap();
      setUserData(user)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <div className="flex items-center space-x-6 mb-8 ">
        <Link to={"/settings/account"}> 
          <FaArrowLeft size={18} />
        </Link>
        <h1 className="text-xl font-semibold">Account Information</h1>
      </div>
      <ul className="space-y-6">
        <li>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <p className="">Username</p>
              <span className="text-sm text-gray-400">
                @{userData?.userName}
              </span>
            </div>
            <IoIosArrowForward color="gray" size={24} />
          </div>
        </li>
        <li>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <p className="">Phone</p>
              <span className="text-sm text-gray-400">9061765352</span>
            </div>
            <IoIosArrowForward color="gray" size={24} />
          </div>
        </li>
        <li>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <p className="">Email</p>
              <span className="text-sm text-gray-400">{userData?.email}</span>
            </div>
            {/* <IoIosArrowForward color="gray" size={24} /> */}
          </div>
        </li>
        <hr className="border-0 h-px bg-gray-600" />
        <li>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <p className="">Country</p>
              <span className="text-sm text-gray-400">India</span>
            </div>
            <IoIosArrowForward color="gray" size={24} />
          </div>
        </li>
        <li>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <p className="">Gender</p>
              <span className="text-sm text-gray-400">add your gender</span>
            </div>
            <IoIosArrowForward color="gray" size={24} />
          </div>
        </li>
        <li>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <p className="">Birth date</p>
              <span className="text-sm text-gray-400">add your birth date</span>
            </div>
            <IoIosArrowForward color="gray" size={24} />
          </div>
        </li>
      </ul>
    </div>
  );
};

export default AccountInformation;
