import { apiSlice } from "./apiSlice";
const MESSAGE_URL = "http://localhost:8004";

export const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRecentChattedUsers: builder.mutation({
      query: () => ({
        url: `${MESSAGE_URL}/getRecentChattedUsers`,
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetRecentChattedUsersMutation } = messageApiSlice;
