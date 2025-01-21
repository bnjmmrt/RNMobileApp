import {createBaseApi} from '../../ApiManager/createBaseApi';

import {EndPoint} from '../../ApiManager/config';

export const appFlowApiAction = createBaseApi.injectEndpoints({
  endpoints: builder => ({
    getFocuses: builder.query({
      query: () => ({
        url: EndPoint.get_focuses,
        method: 'GET',
        providesTags: ['Focuses'],
      }),
    }),

    getInterests: builder.query({
      query: () => ({
        url: EndPoint.interests,
        method: 'GET',
        providesTags: ['Interests'],
      }),
    }),

    memberSignUp: builder.mutation({
      query: requestParam => ({
        url: EndPoint.member_signUp,
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
} = appFlowApiAction;
