import { apiSlice } from "./apiSlice";
const EVENT_URL = "http://localhost:8006";

export const eventApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createEvent: builder.mutation({
      query: (data) => ({
        url: `${EVENT_URL}/createEvent`,
        method: "POST",
        body: data,
      }),
    }),
    getEvents: builder.mutation({
      query: () => ({
        url: `${EVENT_URL}/getEvents`,
        method: "GET",
      }),
    }),
    getEventById: builder.mutation({
      query: (data) => ({
        url: `${EVENT_URL}/getEventById`,
        method: "GET",
        params: data,
      }),
    }),
    respondEvent: builder.mutation({
      query: (data) => ({
        url: `${EVENT_URL}/respondEvent`,
        method: "PUT",
        body: data,
      }),
    }),
    getEventsBySegment: builder.mutation({
      query: (data) => ({
        url: `${EVENT_URL}/getEventsFromType`,
        method:"GET",
        params:data
      }),
    }),
    inviteToEvent: builder.mutation({
      query: (data) => ({
        url: `${EVENT_URL}/inviteToEvent`,
        method:"POST",
        body:data
      }),
    }),
  }),
  overrideExisting: false,
});

export const {useCreateEventMutation,useGetEventsMutation,useGetEventByIdMutation,useRespondEventMutation,useGetEventsBySegmentMutation,useInviteToEventMutation} = eventApiSlice;
