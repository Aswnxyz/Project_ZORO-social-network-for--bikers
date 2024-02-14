import { apiSlice } from "./apiSlice";
import {USER_SERVICE} from '../../constants/constant'

const USERS_URL = USER_SERVICE;

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/signup`,
        method: "POST",
        body: data,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/verifyOtp`,
        method: "POST",
        body: data,
      }),
    }),
    googleAuth: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/googleAuth`,
        method: "POST",
        body: data,
      }),
    }),
    getProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/Profile`,
        method: "POST",
        body: data,
      }),
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/editProfile`,
        method: "POST",
        body: data,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),

    followUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/followUser`,
        method: "POST",
        body: data,
      }),
    }),
    getUsers: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/getUsers`,
        method: "POST",
        body: data,
      }),
    }),
    savePost: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/savePost`,
        method: "POST",
        body: data,
      }),
    }),
    getSavedPost: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/getSavedPosts`,
        method: "POST",
        body: data,
      }),
    }),
    getCurrentUser: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/getUser`,
        method: "GET",
      }),
    }),
    createGarage: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/createGarage`,
        method: "POST",
        body: data,
      }),
    }),
    searchUsers: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/searchUsers`,
        method: "GET",
        params: data,
      }),
    }),
    searchAllUsers: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/searchAllUsers`,
        method: "GET",
        params: data,
      }),
    }),
    addToRecentSearch: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/addRecentSearch`,
        method: "POST",
        body: data,
      }),
    }),
    getRecentSearche: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/getRecentSearches`,
        method: "GET",
      }),
    }),
    clearRecentSearch: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/clearRecentSearch`,
        method: "DELETE",
      }),
    }),
    getUserData: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/getUserDataWithMessages`,
        method: "GET",
        params:data
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/changePassword`,
        method: "POST",
        body:data
      }),
    }),
    changeToPrivateAccount: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/changePrivateAccount`,
        method: "PATCH",
      }),
    }),
    manageFollowRequest: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/followRequest`,
        method: "POST",
        body:data
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGoogleAuthMutation,
  useVerifyOtpMutation,
  useLogoutMutation,
  useGetProfileMutation,
  useUpdateProfileMutation,
  useFollowUserMutation,
  useGetUsersMutation,
  useSavePostMutation,
  useGetCurrentUserMutation,
  useGetSavedPostMutation,
  useCreateGarageMutation,
  useSearchUsersMutation,
  useAddToRecentSearchMutation,
  useGetRecentSearcheMutation,
  useClearRecentSearchMutation,
  useGetUserDataMutation,
  useChangePasswordMutation,
  useChangeToPrivateAccountMutation,
  useManageFollowRequestMutation,
  useSearchAllUsersMutation
} = userApiSlice;
