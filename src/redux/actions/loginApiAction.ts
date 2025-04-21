import { EndPoint } from 'src/ApiManager/config';
import { createBaseApi } from '../../ApiManager/createBaseApi';

export const loginApiAction = createBaseApi.injectEndpoints({
  endpoints: builder => ({
    checkMemberLogin: builder.mutation({
      query: requestParam => ({
        url: 'users/v1/auth/check-member-login',
        method: 'POST',
        body: requestParam,
      }),
      invalidatesTags: ['Login'],
    }),

    memberLogin: builder.mutation({
      query: requestParam => ({
        url: 'users/v1/auth/member-login',
        method: 'POST',
        body: requestParam,
      }),
      invalidatesTags: ['Login'],
    }),

    getUserStatus: builder.query({
      query: requestParam => ({
        url: EndPoint.get_user_status,
        method: 'POST',
        body: requestParam,
      }),
      providesTags: ['NO_CACHE'], // Tag to bypass cache logic
      keepUnusedDataFor: 0, // Clear cache immediately when unused
    }),
  }),
});

export const {
  useCheckMemberLoginMutation,
  useMemberLoginMutation,
  useGetUserStatusQuery,
} = loginApiAction;
