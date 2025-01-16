import { baseApi } from "../../ApiManager/baseApi";

export const extendedApi = baseApi.injectEndpoints({
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
  } = extendedApi;
  