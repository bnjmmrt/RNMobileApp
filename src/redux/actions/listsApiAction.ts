import {EndPoint} from 'src/ApiManager/config';
import {createBaseApi} from '../../ApiManager/createBaseApi';

export const listsApiAction = createBaseApi.injectEndpoints({
  endpoints: builder => ({
    fetchAllCustomLists: builder.query({
      query: ({take, skip}: {take: number; skip: number}) => ({
        url: `${EndPoint.custom_lists}?take=${take}&skip=${skip}`,
        method: 'GET',
      }),
      providesTags: ['CustomLists'], // Adjust the tag if needed for cache invalidation
    }),
    addNewCustomList: builder.mutation({
      query: (requestParam: {customName: string; userIds: string[]}) => ({
        url: EndPoint.custom_lists,
        method: 'POST',
        body: requestParam,
      }),
      invalidatesTags: ['CustomLists'],
    }),
  }),
});

export const {
  useFetchAllCustomListsQuery,
  useLazyFetchAllCustomListsQuery,
  useAddNewCustomListMutation,
} = listsApiAction;
