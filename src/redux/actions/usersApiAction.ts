import { EndPoint } from 'src/ApiManager/config';
import { createBaseApi } from '../../ApiManager/createBaseApi';

export const usersApiAction = createBaseApi.injectEndpoints({
  endpoints: builder => ({
    fetchAllUsers: builder.query({
      query: ({
        take,
        skip,
        searchValue = '',
        queryString = '',
      }: {
        take: number;
        skip: number;
        searchValue?: string;
        queryString?: string;
      }) => {
        let url = `${EndPoint.users_list}?take=${take}&skip=${skip}&sortBy=name`;
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
      providesTags: ['Users'], // Adjust the tag if needed for cache invalidation
    }),

    fetchUserFilters: builder.query({
      query: ({ id }: { id: string }) => ({
        url: `${EndPoint.host}/${id}/filters`,
        method: 'GET',
      }),
      providesTags: ['Filters'], // Adjust the tag if needed for cache invalidation
    }),

    fetchUserDetails: builder.query<UserDetailResponse, { user: string }>({
      query: ({ user }) => ({
        url: `${EndPoint.user}${user}`,
        method: 'GET',
      }),
      providesTags: ['UserDetail'],
    }),

    addNewUser: builder.mutation({
      query: (requestParam: {
        email: string;
        firstName: string;
        lastName: string;
        phoneNumber: string;
      }) => ({
        url: EndPoint.create_user,
        method: 'POST',
        body: requestParam,
      }),
    }),
    addUserNote: builder.mutation({
      query: (requestParam: { note: string; user: string }) => ({
        url: `${EndPoint.user}${requestParam.user}/note`,
        method: 'POST',
        body: {
          note: requestParam.note,
        },
      }),
      invalidatesTags: ['UserDetail'],
    }),
    userSpamToggle: builder.mutation({
      query: (requestParam: { isSpam: boolean; user: string }) => ({
        url: `${EndPoint.user}${requestParam.user}/spam`,
        method: 'POST',
        body: {
          isSpam: requestParam.isSpam,
        },
      }),
      invalidatesTags: ['UserDetail'],
    }),
    reportUser: builder.mutation({
      query: (requestParam: {
        reportMessage: string;
        user: string;
        reportedByRoleId: string;
        reportedToroleId: string;
      }) => ({
        url: `${EndPoint.user}${requestParam.user}/report`,
        method: 'POST',
        body: {
          reportMessage: requestParam.reportMessage,
          reportedByRoleId: requestParam.reportedByRoleId,
          reportedToroleId: requestParam.reportedToroleId,
        },
      }),
      invalidatesTags: ['UserDetail'],
    }),
    markUserFav: builder.mutation({
      query: (requestParam: { targetUserId: string; user: string }) => ({
        url: `${EndPoint.user}${requestParam.user}/favorite`,
        method: 'POST',
        body: {
          targetUserId: requestParam.targetUserId,
        },
      }),
      invalidatesTags: ['UserDetail'],
    }),
    unmarkUserFav: builder.mutation({
      query: (requestParam: { targetUserId: string; user: string }) => ({
        url: `${EndPoint.user}${requestParam.user}/favorite`,
        method: 'DELETE',
        body: {
          targetUserId: requestParam.targetUserId,
        },
      }),
      invalidatesTags: ['UserDetail'],
    }),
    deleteUser: builder.mutation({
      query: (requestParam: { user: string }) => ({
        url: `${EndPoint.user}${requestParam.user}`,
        method: 'DELETE',
        body: {},
      }),
      invalidatesTags: ['UserDetail'],
    }),
  }),
});

export const {
  useFetchAllUsersQuery,
  useLazyFetchAllUsersQuery,

  useFetchUserDetailsQuery,
  useLazyFetchUserDetailsQuery,

  useAddNewUserMutation,
  useAddUserNoteMutation,
  useUserSpamToggleMutation,
  useReportUserMutation,
  useMarkUserFavMutation,
  useUnmarkUserFavMutation,

  useFetchUserFiltersQuery,
  useLazyFetchUserFiltersQuery,

  useDeleteUserMutation,
} = usersApiAction;

export interface UserDetailResponse {
  data: {
    age: number;
    category: string;
    city: string;
    customLists: any[]; // Can refine based on custom list structure
    dateOfBirth: string;
    email: string;
    firstName: string;
    gender: string;
    hostUserMappingId: string;
    id: string;
    imageUrl: string;
    interest: string;
    invitedEvents: any[]; // Define a specific type if available
    isFavourite: boolean;
    isFollow: boolean;
    isSpam: boolean;
    lastName: string;
    note: string;
    pastEvents: any[]; // Define specific type if available
    phoneNumber: string;
    referredBy: any[]; // Define specific type if available
    requestedEvents: any[]; // Define specific type if available
    role: string;
    roleId: string;
    socialStats: {
      facebookFollowersCount?: number | undefined;
      instagramFollowersCount?: number | undefined;
      youtubeFollowersCount?: number | undefined;
      tiktokFollowersCount?: number | undefined;
      linkedinFollowersCount?: number | undefined;
      xFollowersCount?: number | undefined;
      snapchatFollowersCount?: number | undefined;
    };
    focuses: {
      id: string;
      name: string;
    }[];
    status: string;
    upcomingEvents: any[]; // Define specific type if available
  };
  status: number;
}
