import React, { useEffect, useState } from "react";
import { useGetPostsMutation } from "../utils/slices/postApiSlice";
import { useSelector } from "react-redux";

const usePostsList = (pageNumber) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [getPosts] = useGetPostsMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(false);
      const res = await getPosts({ page: pageNumber }).unwrap();
      console.log(res);

      // setPosts((prevPosts) => {
      //   return [...prevPosts, ...res];
      // });

      setPosts((prevPosts) => {
        // Filter out posts that don't meet the conditions
        const filteredPosts = res.filter(
          (post) =>
            post?.user?.followers.includes(userInfo.id) ||
            !post?.user?.privateAccount ||
            post?.user?._id === userInfo.id
        );

        // Concatenate the filtered posts with the previous posts
        return [...prevPosts, ...filteredPosts];
      });

      setHasMore(res.length > 0);
      setLoading(false);
    } catch (error) {
      setError(true);
      console.log(error.data);
    }
  };
  useEffect(() => {
    fetchData();
  }, [pageNumber]);

  return { posts, loading, error, hasMore };
};

export default usePostsList;
