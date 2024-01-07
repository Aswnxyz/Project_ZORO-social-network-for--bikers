import { apiSlice } from "./apiSlice";
const NOTIFICATION_URL = "http://localhost:8003";

export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNofications: builder.mutation({
      query: () => ({
        url: `${NOTIFICATION_URL}/getNotifications`,
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {useGetNoficationsMutation} = notificationApiSlice;
