import { apiSlice } from "./apiSlice";
const MESSAGE_URL = "http://localhost:8004";

export const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    accessChat: builder.mutation({
      query: (data) => ({
        url: `${MESSAGE_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    getRecentChats: builder.mutation({
      query: () => ({
        url: `${MESSAGE_URL}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    createGroup: builder.mutation({
      query: (data) => ({
        url: `${MESSAGE_URL}/group`,
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    RenameGroupName: builder.mutation({
      query: (data) => ({
        url: `${MESSAGE_URL}/rename`,
        method: "PUT",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    addUserToGroup: builder.mutation({
      query: (data) => ({
        url: `${MESSAGE_URL}/addUserToGroup`,
        method: "PUT",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    removeUserFromGroup: builder.mutation({
      query: (data) => ({
        url: `${MESSAGE_URL}/removeUserFromGroup`,
        method: "PUT",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    leaveFromGroup: builder.mutation({
      query: (data) => ({
        url: `${MESSAGE_URL}/leaveGroup`,
        method: "PUT",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    sendMessage: builder.mutation({
      query: (data) => ({
        url: `${MESSAGE_URL}/message`,
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    getMessages: builder.mutation({
      query: (data) => ({
        url: `${MESSAGE_URL}/message`,
        method: "GET",
        params: {chatId:data},
        
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useAccessChatMutation,
  useGetRecentChatsMutation,
  useCreateGroupMutation,
  useRenameGroupNameMutation,
  useAddUserToGroupMutation,
  useRemoveUserFromGroupMutation,
  useLeaveFromGroupMutation,
  useSendMessageMutation,
  useGetMessagesMutation,
} = messageApiSlice;
