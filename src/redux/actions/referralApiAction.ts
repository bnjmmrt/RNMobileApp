import { createBaseApi } from "src/ApiManager/createBaseApi";

export const referralApiAction = createBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitReferralCode: builder.mutation({
      query: (requestParam) => ({
        url: 'v1/platform/referred-users',
        method: 'POST',
        body: requestParam,
      }),
    }),
    requestMember: builder.mutation({
        query: (requestParam) => ({
          url: 'v1/platform/referral-requests',
          method: 'POST',
          body: requestParam,
        }),
      }),
      fetchMembers: builder.query({
        query: () => ({
          url: 'v1/platform/members', 
          method: 'GET',
        }),
      }),

  }),
});

export const {
  useSubmitReferralCodeMutation,
  useRequestMemberMutation,
  useFetchMembersQuery
} = referralApiAction;