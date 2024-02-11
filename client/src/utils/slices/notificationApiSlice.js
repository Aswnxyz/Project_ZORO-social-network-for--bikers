import { apiSlice } from "./apiSlice";
import { NOTIFICATION_SERVICE } from "../../constants/constant";

const NOTIFICATION_URL = NOTIFICATION_SERVICE;

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
