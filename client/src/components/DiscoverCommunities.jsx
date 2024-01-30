import React, { useEffect, useState } from "react";
import { useGetAllCommunitiesMutation, useJoinCommunityMutation } from "../utils/slices/communityApiSlice";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const DiscoverCommunities = () => {
  const [communities, setCommunities] = useState([]);
  const [getAllCommunities] = useGetAllCommunitiesMutation();
  const [joinCommunity] = useJoinCommunityMutation();
  const {userInfo} = useSelector(state=> state.auth)
  const navigate = useNavigate()
  const fetchData = async () => {
    try {
      const res = await getAllCommunities().unwrap();
      setCommunities(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleJoinCommunity = async (communityId)=>{
    try {
const res = await joinCommunity({communityId}).unwrap();
  const updatedCommunities = communities.map((community) =>
    community._id === communityId ? res : community
  );
setCommunities(updatedCommunities)
      
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="text-white px-6">
      <h1 className="text-xl font-bold my-4">Suggested for you</h1>
      <div className="grid grid-cols-3 gap-4">
        {communities.map((community) => (
          <div className="bg-gray-800 rounded-b-xl">
            <img
              className="w-full h-32 rounded-t-xl"
              src={
                community?.image
                  ? community?.image?.url
                  : "https://www.facebook.com/images/groups/groups-default-cover-photo-2x.png"
              }
              alt=""
            />
            <div className="flex flex-col p-3">
              <Link to={`/clubs/${community?._id}`}>
                <p className="text-lg font-bold">{community?.name}</p>
              </Link>
              <span className="text-sm text-gray-400">
                {community?.members?.length} members
              </span>
              <button
                onClick={() =>
                  community.members.includes(userInfo.id)
                    ? navigate(`/clubs/${community._id}`)
                    : handleJoinCommunity(community._id)
                }
                className={`bg-gray-600 py-2 my-2 rounded-lg ${
                  community.members.includes(userInfo.id) ? "text-blue-600" : ""
                }`}
              >
                {community.members.includes(userInfo.id)
                  ? "Visit community"
                  : "Join community"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscoverCommunities;
