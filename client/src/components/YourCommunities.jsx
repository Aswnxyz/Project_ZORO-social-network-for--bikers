import React, { useEffect, useState } from "react";
import { useGetCommunityMutation } from "../utils/slices/communityApiSlice";
import { Link } from "react-router-dom";

const YourCommunities = () => {
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [getCommunities] = useGetCommunityMutation();

  const fetchData = async () => {
    try {
      const res = await getCommunities().unwrap();
      setJoinedCommunities(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="text-white px-3 py-2">
      <p className="text-xl font-medium">
        All groups you've joined {`(${joinedCommunities.length})`}
      </p>
      <div className="mt-6">
        <div className="grid grid-cols-4 gap-3">
          {joinedCommunities?.map((community) => (
            <Link key={community._id} to={`/clubs/${community._id}`}>
              <div className="   p-2 bg-gray-800 rounded-xl">
                <div className="flex items-center space-x-3">
                  {community?.image ? (
                    <img
                      className="h-20 w-20"
                      src={community?.image?.url}
                      alt=""
                    />
                  ) : (
                    <div className="h-20 w-20 bg-red-500 flex justify-center items-center">
                      <p className="text-xl font-bold">{community.name[0]}</p>
                    </div>
                  )}

                  <p className="text-lg ">{community.name}</p>
                </div>
                <button className="w-full font-bold border py-1 mt-3">
                  view community
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YourCommunities;
