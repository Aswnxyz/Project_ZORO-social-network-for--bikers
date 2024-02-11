import { apiSlice } from "./apiSlice";
import{ADMIN_SERVICE} from '../../constants/constant'
const ADMIN_URL = ADMIN_SERVICE;

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    adminLogout: builder.mutation({
      query: () => ({
        url: `${ADMIN_URL}/logout`,
        method: "POST",
   
      }),
    }),
    adminGetUsers: builder.mutation({
      query: () => ({
        url: `${ADMIN_URL}/getUsers`,
        method: "GET",
      }),
    }),
    adminGetPosts: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/getPosts`,
        method: "POST",
        body:data
      }),
    }),
    handleBlock: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/handleBlock`,
        method: "POST",
        body: data,
      }),
    }),
    handlePostBlock: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/handlePostBlock`,
        method: "POST",
        body: data,
      }),
    }),
    AdminGetPostById: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/getPostById`,
        method: "POST",
        body: data,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useAdminLoginMutation,useAdminGetUsersMutation,useHandleBlockMutation,useAdminLogoutMutation,useAdminGetPostsMutation,useHandlePostBlockMutation,useAdminGetPostByIdMutation} = adminApiSlice; ;


