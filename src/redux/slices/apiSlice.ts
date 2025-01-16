// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// export interface Post {
//   id: number;
//   title: string;
//   body: string;
// }

// export const apiSlice = createApi({
//   reducerPath: 'post', 
//   baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com/' }),
//   tagTypes: ['Post'], // Used for caching and invalidation
//   endpoints: (builder) => ({
//     getPosts: builder.query<Post[], void>({
//       query: () => 'posts',
//       providesTags: ['Post'], // Cache the response
//     }),
//     getPostById: builder.query<Post, number>({
//       query: (id) => `posts/${id}`,
//       providesTags: (result, error, id) => [{ type: 'Post', id }], // Cache per item
//     }),
//     addPost: builder.mutation<Post, Partial<Post>>({
//       query: (newPost) => ({
//         url: 'posts',
//         method: 'POST',
//         body: newPost,
//       }),
//       invalidatesTags: ['Post'], // Invalidate the cache when a post is added
//     }),
//   }),
// });

// export const {
//   useGetPostsQuery,
//   useGetPostByIdQuery,
//   useAddPostMutation,
// } = apiSlice;


import { baseApi } from "../../ApiManager/baseApi";

export const apiSlice = baseApi.injectEndpoints({
    endpoints: (builder) => ({
    //   getResources: builder.query({
    //     query: ({ page, limit }) => `/resources?page=${page}&limit=${limit}`,
    //     providesTags: ['Resource'],
    //   }),
      checkMemberLogin: builder.mutation({
        query: (requestParam) => ({
          url: '/v1/auth/check-member-login',
          method: 'POST',
          body: requestParam,
        }),
        invalidatesTags: ['CheckMember'],
      }),

      memberLogin: builder.mutation({
        query: (requestParam) => ({
          url: '/v1/auth/member-login',
          method: 'POST',
          body: requestParam,
        }),
        invalidatesTags: ['CheckMember'],
      }),

      
    //   resendOTP: builder.mutation({
    //     query: (newResource) => ({
    //       url: '/v1/auth/check-member-login',
    //       method: 'POST',
    //       body: newResource,
    //     }),
    //     invalidatesTags: ['CheckMember'],
    //   }),
    //   deleteResource: builder.mutation({
    //     query: (id) => ({
    //       url: `/resources/${id}`,
    //       method: 'DELETE',
    //     }),
    //     invalidatesTags: ['Resource'],
    //   }),
    }),
  });
  
  export const {
    // useGetResourcesQuery,
    useCheckMemberLoginMutation,
    useMemberLoginMutation,
  } = apiSlice;
  