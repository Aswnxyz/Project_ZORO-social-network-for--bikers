import React, { useCallback, useEffect, useRef, useState } from "react";

import Post from "../../components/Post";
import RightSidebar from "../../components/RightSidebar";
import { useGetCurrentUserMutation } from "../../utils/slices/userApiSlice";
import usePostsList from "../../components/usePostsList";
import { ImSpinner3 } from "react-icons/im";

function Home() {
  const [pageNumber, setPageNumber] = useState(1);

  const [userData, setUserData] = useState("");

  const [getUser] = useGetCurrentUserMutation();

  const { posts, hasMore, loading, error } = usePostsList(pageNumber);
  const observer = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const fetchData = async () => {
    try {
     
      const userData = await getUser().unwrap();
      setUserData(userData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <div className="w-[53rem] px-28 z-10">
        <div className="fixed inset-x-0 bg-black bg-opacity-75 pr-20 ">
          <div className="flex justify-evenly  items-center text-center text-white text-lg font-semibold my-4">
            <p>For you </p>
            <p>Following</p>
          </div>
          <hr className="h-px mt-6 w-full bg-gray-200 border-0 dark:bg-gray-700 " />
        </div>
        <div className="py-20">
          {posts.map((post, index) => {
            if (posts.length === index + 1) {
              return (
                <div ref={lastBookElementRef} key={post._id}>
                  <Post
                    {...post}
                    savedPosts={userData?.savedPosts}
                    // key={post._id}
                  />
                </div>
              );
            } else {
              return (
                <div key={post._id}>
                  <Post
                    {...post}
                    savedPosts={userData?.savedPosts}
                    // key={post._id}
                  />
                </div>
              );
            }
          })}
          {loading && (
            <div className="flex justify-center items-center">
              <ImSpinner3 className="animate-spin" size={32} color="white"/>
            </div>
          )}
        </div>
      </div>

      <RightSidebar />
    </>
  );
}

export default Home;
