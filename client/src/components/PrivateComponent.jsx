import React from 'react'


import { CiLock } from "react-icons/ci";



const PrivateComponent = () => {
  return (
    <div className='flex flex-col justify-center items-center p-10 border border-gray-700 my-10'>
        <div>
            <CiLock size={54}/>
        </div>
      <p className='font-medium'>This Account is Private</p>
      <span>Follow to see their photos and videos.</span>
    </div>
  );
}

export default PrivateComponent