import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["User","Post","Admin","Notification","Message"],
  endpoints: (builder) => ({}),
});
