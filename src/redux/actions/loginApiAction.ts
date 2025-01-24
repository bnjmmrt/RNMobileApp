import { createBaseApi } from "../../ApiManager/createBaseApi";

export const loginApiAction = createBaseApi.injectEndpoints({
  endpoints: (builder) => ({

    checkMemberLogin: builder.mutation({
      query: (requestParam) => ({
        url: 'v1/auth/check-member-login',
        method: 'POST',
        body: requestParam,
      }),
      invalidatesTags: ['Login'],
    }),

    memberLogin: builder.mutation({
      query: (requestParam) => ({
        url: 'v1/auth/member-login',
        method: 'POST',
        body: requestParam,
      }),
      invalidatesTags: ['Login'],
    }),

  }),
});

export const {
  useCheckMemberLoginMutation,
  useMemberLoginMutation
} = loginApiAction;
