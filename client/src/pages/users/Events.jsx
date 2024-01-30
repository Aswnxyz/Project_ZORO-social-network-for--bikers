import React from 'react'
import MyEvents from '../../components/MyEvents'
import { ToastContainer } from 'react-toastify';
import { Outlet } from 'react-router-dom';

const Events = () => {
  return (
    <div className="flex  h-screen text-white">
      <MyEvents />
      <div className="w-3/4 py-2 flex flex-col border-gray-800 dark:border-gray-700 border-r  relative z-10">
        <ToastContainer />
        <Outlet />
      </div>
    </div>
  );
}

export default Events