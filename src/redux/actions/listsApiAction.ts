import { EndPoint } from 'src/ApiManager/config';
import { createBaseApi } from '../../ApiManager/createBaseApi';

export const listsApiAction = createBaseApi.injectEndpoints({
  endpoints: builder => ({
    fetchAllCustomLists: builder.query({
      query: ({ take, skip }: { take: number; skip: number }) => ({
        url: `${EndPoint.hosts_custom_lists}?take=${take}&skip=${skip}`,
        method: 'GET',
      }),
      providesTags: ['CustomLists'], // Adjust the tag if needed for cache invalidation
    }),
    addNewCustomList: builder.mutation({
      query: (requestParam: { customName: string; userIds: string[] }) => ({
        url: EndPoint.host_custom_lists,
        method: 'POST',
        body: requestParam,
      }),
      invalidatesTags: ['CustomLists'],
    }),
    editCustomList: builder.mutation({
      query: ({
        listId,
        customName,
      }: {
        customName: string;
        listId: string;
      }) => ({
        url: `${EndPoint.host_custom_lists}/${listId}/users`,
        method: 'PUT',
        body: {
          customName: customName,
          mappingIds: [],
          userIds: [],
        },
      }),
      invalidatesTags: ['CustomListDetail', 'CustomLists'],
    }),
    deleteCustomList: builder.mutation({
      query: ({ listId }: { listId: string }) => ({
        url: `${EndPoint.host_custom_lists}/${listId}`,
        method: 'DELETE',
        body: {},
      }),
      invalidatesTags: ['CustomLists', 'UserDetail'],
    }),
    duplicateCustomList: builder.mutation({
      query: ({
        listId,
        customName,
        listType,
      }: {
        listId: string;
        customName: string;
        listType: string;
      }) => ({
        url: `${EndPoint.custom_lists_duplicate}`,
        method: 'POST',
        body: {
          customListId: listId,
          customName: customName,
          listType: listType,
        },
      }),
      invalidatesTags: ['CustomLists'],
    }),

    fetchCustomListUsers: builder.query({
      query: ({
        take,
        skip,
        listId,
        searchValue = '',
        listType = 'custom',
        queryString,
      }: {
        take: number;
        skip: number;
        listId: string;
        searchValue: string;
        listType: 'follower' | 'favorite' | 'custom';
        queryString?: string;
      }) => {
        let url = `${EndPoint.host_custom_lists}/${listId}/users?take=${take}&skip=${skip}`;
        if (listType === 'favorite') {
          url = `${EndPoint.hosts_favorites_lists}/?take=${take}&skip=${skip}`;
        }
        if (listType === 'follower') {
          url = `${EndPoint.hosts_followers_lists}/?take=${take}&skip=${skip}`;
        }

        if (searchValue) {
          url = `${url}&searchValue=${searchValue}`;
        }
        if (queryString) {
          url = `${url}&${queryString}`;
        }
        return {
          url: url,
          method: 'GET',
        };
      },
    }),
    addUsersToCustomList: builder.mutation({
      query: ({
        listId,
        userIds,
        customName,
      }: {
        listId: string;
        userIds: string[];
        customName: string;
      }) => ({
        url: `${EndPoint.host_custom_lists}/${listId}/users`,
        method: 'PUT',
        body: {
          customName: customName,
          mappingIds: [],
          userIds: userIds,
        },
      }),
      invalidatesTags: ['CustomLists'],
    }),
    removeUsersFromCustomList: builder.mutation({
      query: ({
        listId,
        userIds,
        customName,
      }: {
        listId: string;
        userIds: string[];
        customName: string;
      }) => ({
        url: `${EndPoint.host_custom_lists}/${listId}/users`,
        method: 'PUT',
        body: {
          customName: customName,
          mappingIds: userIds,
          userIds: [],
        },
      }),
      invalidatesTags: ['CustomLists', 'UserDetail'],
    }),
  }),
});

export const {
  useFetchAllCustomListsQuery,
  useLazyFetchAllCustomListsQuery,
  useAddNewCustomListMutation,
  useAddUsersToCustomListMutation,
  useRemoveUsersFromCustomListMutation,
  useDeleteCustomListMutation,
  useFetchCustomListUsersQuery,
  useEditCustomListMutation,
  useDuplicateCustomListMutation,
} = listsApiAction;
