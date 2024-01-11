import React, { useState } from 'react'
import { CiUser } from 'react-icons/ci'
import { IoIosArrowForward } from 'react-icons/io'
import { IoKeyOutline } from 'react-icons/io5'
import { PiHeartBreakLight } from 'react-icons/pi'
import { Link } from 'react-router-dom'

const YourAccount = () => {

  
  return (
    <>
      <h1 className="text-2xl font-semibold">Your account</h1>
      <span className="text-xs text-gray-500">
        See information about your account, or learn about your account
        deactivation options
      </span>
      <div>
        <ul className="my-4 pr-8">
          <Link to={"/settings/your-zoro-account"}>
            <li className="py-4 ">
              <div className="flex justify-between items-center">
                <div className="flex space-x-3">
                  <CiUser size={24} />
                  <span>Account information</span>
                </div>
                <IoIosArrowForward color="gray" size={24} />
              </div>
            </li>
          </Link>
          <Link to={"/settings/password"}>
          <li className="py-4  ">
            <div className="flex justify-between items-center">
              <div className="flex space-x-3">
                <IoKeyOutline className="text-gray-400" size={24} />
                <span>Change your password</span>
              </div>
              <IoIosArrowForward color="gray" size={24} />
            </div>
          </li></Link>
          <li className="py-4 ">
            <div className="flex justify-between items-center">
              <div className="flex space-x-3">
                <PiHeartBreakLight className="text-gray-300" size={24} />
                <span>Deactivate your account </span>
              </div>
              <IoIosArrowForward color="gray" size={24} />
            </div>
          </li>
        </ul>
      </div>
    </>
  );
}

export default YourAccount