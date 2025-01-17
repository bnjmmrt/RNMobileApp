import { baseApi } from "../../ApiManager/baseApi";

export const referralSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitReferralCode: builder.mutation({
      query: (requestParam) => ({
        url: '/v1/platform/referred-users',
        method: 'POST',
        body: requestParam,
      }),
    }),
  }),
});

export const {
  useSubmitReferralCodeMutation,
} = referralSlice;
