import React from 'react'

const UserPosts = ({posts}) => {
  return (
    <div className="flex flex-wrap my-3 px-1">
      {posts.map((post) => (
        <div key={post._id} className="w-64 h-full p-1 border-gray-800">
          <img src={post.mediaUrl} alt="" />
        </div>
      ))}
    </div>
  );
}

export default UserPosts