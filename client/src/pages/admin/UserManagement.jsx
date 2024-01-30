import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  useAdminGetUsersMutation,
  useHandleBlockMutation,
} from "../../utils/slices/adminApiSlice";

const UserManagement = () => {
  const [usersList, setUsersList] = useState([]);
  const [getUsers] = useAdminGetUsersMutation();
  const [handleBlockUser] = useHandleBlockMutation();

  const fetchData = async () => {
    try {
      const usersData = await getUsers().unwrap();
      

      if (usersData) {
        const users = usersData;
        setUsersList(users);
      }
    } catch (error) {
      console.log(error.data);
    }
  };

  const handleBlock = async (id, type) => {
    const result = await Swal.fire({
      title: "Are you sure?",

      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
    });

    if (result.isConfirmed) {
      try {
        const res = await handleBlockUser({ _id: id, type }).unwrap();
        setUsersList((prevUsers) =>
          prevUsers.map((user) =>
            user._id === id ? { ...user, isActive: !user.isActive } : user
          )
        );
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      {/* <AdminNav/>
    <AdminSidebar/> */}

      <h1 className="text-white text-2xl font-bold">Users</h1>
      <div class="my-5 relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">
                Image
              </th>
              <th scope="col" class="px-6 py-3">
                Name
              </th>
              <th scope="col" class="px-6 py-3">
                Email
              </th>

              <th scope="col" class="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {usersList?.map((user, index) => (
              <tr
                key={user?._id}
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <th
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {/* {user?._id} */}
                  <img
                    src={
                      user?.profilePic
                        ? user?.profilePic?.url
                        : "/img/profile_icon.jpeg"
                    }
                    className="h-12"
                    alt="image"
                  />
                </th>
                <td class="px-6 py-4">{user?.fullName}</td>
                <td class="px-6 py-4">{user?.email}</td>

                <td class="px-6 py-4">
                  {user?.isActive ? (
                    <div
                      class="font-medium text-red-600 dark:text-red-500 hover:underline"
                      onClick={() => handleBlock(user?._id, "block")}
                    >
                      Block
                    </div>
                  ) : (
                    <div
                      class="font-medium text-green-600 dark:text-green-500 hover:underline"
                      onClick={() => handleBlock(user?._id, "unblock")}
                    >
                      Unblock
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UserManagement;
