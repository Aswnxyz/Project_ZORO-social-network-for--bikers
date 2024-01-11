import React, { useEffect, useState } from "react";
import { BsToggleOff, BsToggleOn } from "react-icons/bs";
import {
  useChangeToPrivateAccountMutation,
  useGetCurrentUserMutation,
} from "../utils/slices/userApiSlice";
import { ImSpinner2 } from "react-icons/im";

const AccountPrivacy = () => {
  const [userData, setUserData] = useState(null);
  const [getUser] = useGetCurrentUserMutation();
  const [changeToPrivateAccount,{isLoading}] = useChangeToPrivateAccountMutation();

  const handlePrivateAccount = async () => {
    try {
      const res = await changeToPrivateAccount().unwrap();
      setUserData(res);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      const res = await getUser().unwrap();
      setUserData(res);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="px-20 relative">
      <h1 className="text-2xl font-semibold">Account privacy</h1>
      <div className="mt-10">
        <div className="flex justify-between items-center">
          <p onClick={handlePrivateAccount} className="text-lg">
            Private account
          </p>
          <span onClick={handlePrivateAccount}>
            {userData?.privateAccount ? (
              <BsToggleOn className="" size={32} color="white" />
            ) : (
              <BsToggleOff className="" size={32} color="white" />
            )}
          </span>
        </div>
        <div className="text-xs mt-4 space-y-4 text-gray-400">
          <p className="">
            When your account is public, your profile and posts can be seen by
            anyone, on or off Instagram, even if they don’t have an Instagram
            account.
          </p>
          <p>
            When your account is private, only the followers you approve can see
            what you share, including your photos or videos on hashtag and
            location pages, and your followers and following lists.{" "}
          </p>
        </div>
      </div>
      {/* {isLoading && (
        <div className=" absolute inset-0 h-screen  bg-black bg-opacity-75  flex justify-center items-center">
          <ImSpinner2 className="animate-spin" size={27} />
        </div>
      )} */}
    </div>
  );
};

export default AccountPrivacy;
