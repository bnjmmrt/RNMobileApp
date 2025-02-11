import { createBaseApi } from "../../ApiManager/createBaseApi";

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
    fetchHostList: builder.query({
      query: ({ id, take, skip }) => ({
        url: `/auth/hosts-followed/${id}?take=${take}&skip=${skip}`,
        method: 'GET',
      }),
    }),
    followHost: builder.mutation({
      query: ({ hostId, userId }) => ({
        url: `/auth/host/${hostId}/follow`,
        method: 'POST',
        body: { userId },
      }),
    }),
    unfollowHost: builder.mutation({
      query: ({ hostId, userId }) => ({
        url: `/auth/host/${hostId}/follow`,
        method: 'DELETE',
        body: { userId },
      }),
    }),
    getConfirmedMembers: builder.mutation({
      query: (requestParam) => ({
        url: 'v1/auth/get-confirmed-members',
        method: 'POST',
        body: requestParam,
      }),
    }),
  }),
});

export const {
  useSubmitReferralCodeMutation,
  useRequestMemberMutation,
  useFetchMembersQuery,
  useFetchHostListQuery,
  useFollowHostMutation,
  useUnfollowHostMutation,
  useGetConfirmedMembersMutation,
} = referralApiAction;
