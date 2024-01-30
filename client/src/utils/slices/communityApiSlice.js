import { apiSlice } from "./apiSlice";
const COMMUNITY_URL = "http://localhost:8005";

export const communityApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCommunity: builder.mutation({
      query: (data) => ({
        url: `${COMMUNITY_URL}/createCommunity`,
        method: "POST",
        body: data,
      }),
    }),
    getCommunity: builder.mutation({
      query: () => ({
        url: `${COMMUNITY_URL}/getCommunites`,
        method: "GET",
      }),
    }),
    getCommunityDetails: builder.mutation({
      query: (data) => ({
        url: `${COMMUNITY_URL}/getCommunityWithId`,
        method: "GET",
        params:data
      }),
    }),
    getAllCommunities: builder.mutation({
      query: () => ({
        url: `${COMMUNITY_URL}/getAllCommunities`,
        method: "GET",
      }),
    }),
    joinCommunity: builder.mutation({
      query: (data) => ({
        url: `${COMMUNITY_URL}/joinCommunity`,
        method: "PUT",
        body:data
      }),
    }),
    searchCommunities: builder.mutation({
      query: (data) => ({
        url: `${COMMUNITY_URL}/searchCommunity`,
        method: "GET",
        params:data
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateCommunityMutation,
  useGetCommunityMutation,
  useGetCommunityDetailsMutation,
  useGetAllCommunitiesMutation,
  useJoinCommunityMutation,
  useSearchCommunitiesMutation
} = communityApiSlice;
