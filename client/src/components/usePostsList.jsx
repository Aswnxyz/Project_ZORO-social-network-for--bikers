import React, { useEffect, useState } from "react";
import { useGetPostsMutation } from "../utils/slices/postApiSlice";

const usePostsList = (pageNumber) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [getPosts] = useGetPostsMutation();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(false);
      const res = await getPosts({ page: pageNumber }).unwrap();

      setPosts((prevPosts) => {
        return [...prevPosts, ...res];
      });
      setHasMore(res.length > 0);
      setLoading(false);
    } catch (error) {
      setError(true);
    }
  };
  useEffect(() => {
    
    fetchData();
  }, [pageNumber]);

  return { posts, loading, error, hasMore };
};

export default usePostsList;
