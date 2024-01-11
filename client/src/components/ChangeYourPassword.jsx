import React, { useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useChangePasswordMutation } from '../utils/slices/userApiSlice';
 import { toast } from "react-toastify";
 import "react-toastify/dist/ReactToastify.css";

const ChangeYourPassword = () => {
    const [currentPassword,setCurrentPassword ]=useState("")
    const [newPassword,setNewPassword ]=useState("")
    const [confirmPassword,setConfirmPassword ]=useState("")
    const [changePassword]= useChangePasswordMutation()
    const [error,setError]= useState("")
    const navigate = useNavigate()

    const handleChangePassword=async ()=>{
        try {
              if (!currentPassword || !newPassword || !confirmPassword) {
                setError("All fields are required");
                return;
              }
              if(newPassword.length < 8 ){
                setError("Password must be at least 8 characters long.");
                return ;
              }

              // Check if new password and confirm password match
              if (newPassword !== confirmPassword) {
                setError("New password and confirm password do not match");
                return;
              }
                const res =await changePassword({currentPassword,newPassword}).unwrap();
               navigate("/settings/account")
              toast.success("Password changed succesfully...")
        } catch (error) {
            setError(error.data)
            console.log(error)
        }
    }
  return (
    <div>
      <div className="flex items-center space-x-6 mb-8 ">
        <Link to={"/settings/account"}>
          <FaArrowLeft size={18} />
        </Link>
        <h1 className="text-xl font-semibold">Change your password</h1>
      </div>
      {error ? <p className="p-3 bg-red-400 my-2">{error}</p> : null}

      <div>
        <div className="w-full h-14 mt-4 border-2  px-2 border-gray-800 rounded">
          <span className="text-xs text-gray-400">Current password</span>
          <div>
            <input
              className="bg-black w-full focus:outline-none"
              type="password"
              placeholder="Enter password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
        </div>
        <hr className="h-px border-0 my-6 bg-gray-600" />
        <div className="w-full h-14 mt-4 border-2  px-2 border-gray-800 rounded">
          <span className="text-xs text-gray-400">New password</span>
          <div>
            <input
              className="bg-black w-full focus:outline-none"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full h-14 mt-4 border-2  px-2 border-gray-800 rounded">
          <span className="text-xs text-gray-400">Confirm password</span>
          <div>
            <input
              className="bg-black w-full focus:outline-none"
              type="password"
              placeholder="confirm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleChangePassword}
            className="text-lg my-4 font-medium px-4 py-1 bg-red-600 rounded-full"
          >
            save
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangeYourPassword