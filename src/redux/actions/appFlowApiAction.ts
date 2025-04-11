import { createBaseApi } from '../../ApiManager/createBaseApi';
import { environment } from '../../../environments/environment';

import { EndPoint } from '../../ApiManager/config';
console.log("EndPoint.get_focuses", environment.BASE_URL + EndPoint.get_focuses)
export const appFlowApiAction = createBaseApi.injectEndpoints({
  endpoints: builder => ({

    getFocuses: builder.query({
      query: () => ({
        url: EndPoint.get_focuses,
        method: 'GET',
        // providesTags: ['Focuses'],
      }),
    }),

    getInterests: builder.query({
      query: () => ({
        url: EndPoint.interests,
        method: 'GET',
        // providesTags: ['Interests'],
      }),
    }),

    memberSignUp: builder.mutation({
      query: requestParam => ({
        url: EndPoint.member_signUp,
        method: 'POST',
        body: requestParam,
      }),
    }),
    memberLogout: builder.mutation({
      query: requestParam => ({
        url: EndPoint.member_logout,
        method: 'POST',
        body: requestParam,
      }),
    }),
  }),
});

export const {
  useGetFocusesQuery,
  useGetInterestsQuery,
  useMemberSignUpMutation,
  useMemberLogoutMutation,
} = appFlowApiAction;
