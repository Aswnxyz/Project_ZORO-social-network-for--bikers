import { apiSlice } from "./apiSlice";
import { POST_SERVICE } from "../../constants/constant";

const POST_URL = POST_SERVICE;

export const postApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPost: builder.mutation({
      query: (data) => ({
        url: `${POST_URL}/createPost`,
        method: "POST",
        body: data,
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      }),
    }),
    getPosts: builder.mutation({
      query: (data) => ({
        url: `${POST_URL}/getPosts`,
        method: "GET",
        params: data,
      }),
    }),
    likePost: builder.mutation({
      query: (data) => ({
        url: `${POST_URL}/likePost`,
        method: "POST",
        body: data,
      }),
    }),
    commentPost: builder.mutation({
      query: (data) => ({
        url: `${POST_URL}/commentPost`,
        method: "POST",
        body: data,
      }),
    }),
    getComments: builder.mutation({
      query: (data) => ({
        url: `${POST_URL}/getComments`,
        method: "POST",
        body: data,
      }),
    }),
    likeComment: builder.mutation({
      query: (data) => ({
        url: `${POST_URL}/likeComment`,
        method: "POST",
        body: data,
      }),
    }),
    reportPost: builder.mutation({
      query: (data) => ({
        url: `${POST_URL}/reportPost`,
        method: "POST",
        body: data,
      }),
    }),
    deletePost: builder.mutation({
      query: (data) => ({
        url: `${POST_URL}/deletePost`,
        method: "POST",
        body: data,
      }),
    }),
    editPost: builder.mutation({
      query: (data) => ({
        url: `${POST_URL}/editPost`,
        method: "POST",
        body: data,
      }),
    }),
    deleteComment: builder.mutation({
      query: (data) => ({
        url: `${POST_URL}/deleteComment`,
        method: "DELETE",
        body: data,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreatePostMutation,
  useGetPostsMutation,
  useLikePostMutation,
  useCommentPostMutation,
  useGetCommentsMutation,
  useLikeCommentMutation,
  useReportPostMutation,
  useDeletePostMutation,
  useEditPostMutation,
  useDeleteCommentMutation
} = postApiSlice;
