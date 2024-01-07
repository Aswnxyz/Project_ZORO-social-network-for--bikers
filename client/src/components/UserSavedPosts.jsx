import React from 'react'

const UserSavedPosts = ({savedPosts}) => {
  return (
    <div className="flex flex-wrap my-3 px-1">
      {savedPosts.map((post) => (
        <div key={post._id} className="w-64 h-full p-1 border-gray-800">
          <img src={post.media.url} alt="" />
        </div>
      ))}
    </div>
  );
}

export default UserSavedPosts