import {
  ManageGuestPayload,
  GuestListResponse,
} from 'src/screens/EventScreen/types';
import { createBaseApi } from '../../ApiManager/createBaseApi';

export const eventApiAction = createBaseApi.injectEndpoints({
  endpoints: builder => ({
    fetchEvents: builder.query({
      query: ({
        userId,
        guestEventStatus,
        searchText,
        take,
        skip,
      }: {
        userId: string;
        guestEventStatus: string;
        searchText: string;
        take: number;
        skip: number;
      }) => ({
        url: `v1/events/users/${userId}/events?guestEventStatus=${guestEventStatus}&take=${take}&skip=${skip}&findInNameAndDescription=${searchText}`,
        method: 'GET',
      }),
      providesTags: ['Event'], // Adjust the tag if needed for cache invalidation
    }),

    fetchHostEvents: builder.query({
      query: ({
        status,
        searchText,
        take,
        skip,
      }: {
        status: string;
        searchText: string;
        take: number;
        skip: number;
      }) => ({
        url: `v1/events/hosts/events?take=${take}&skip=${skip}&status=${status}&eventName=${searchText}`,
        method: 'GET',
      }),
      providesTags: ['HostEvents'], // Adjust the tag if needed for cache invalidation
    }),

    fetchAllEvents: builder.query({
      query: ({
        userId,
        queryString,
        searchText,
        skip,
        take,
      }: {
        statusName?: string;
        userId: string;
        queryString?: string;
        searchText?: string;
        take?: number;
        skip?: number;
      }) => {
        let url = `v1/events/users/${userId}/events`;
        if (take) {
          url = `${url}?take=${take}&skip=${skip}`;
        }
        if (searchText) {
          url = `${url}&findInNameAndDescription=${searchText}`;
        }
        // if (statusName) {
        //   url = `${url}&status=${statusName}`;
        // }
        if (queryString) {
          url = `${url}&${queryString}`;
        }
        return {
          url: `${url}&feed=true`,
          method: 'GET',
        };
      },
      providesTags: ['Events'], // Adjust the tag if needed for cache invalidation
    }),

    fetchEventDetails: builder.query({
      query: ({ eventId, userId }: { eventId: string; userId: string }) => ({
        url: `v1/events/users/${userId}/events/${eventId}`,
        method: 'GET',
      }),
      providesTags: ['EventDetails'],
      keepUnusedDataFor: 0, // Adjust the tag if needed for cache invalidation
    }),

    fetchPublicEventDetails: builder.query({
      query: ({ eventId }: { eventId: string }) => ({
        url: `v1/events/event/${eventId}`,
        method: 'GET',
      }),
      providesTags: ['EventDetails'],
      keepUnusedDataFor: 0, // Adjust the tag if needed for cache invalidation
    }),

    fetchHostEventDetails: builder.query({
      query: ({ eventId }: { eventId: string }) => ({
        url: `v1/events/event/${eventId}`,
        method: 'GET',
      }),
      providesTags: ['EventDetails'],
      keepUnusedDataFor: 0, // Adjust the tag if needed for cache invalidation
    }),

    fetchGuestStatusCount: builder.query({
      query: ({ eventId }: { eventId: string }) => ({
        url: `v1/events/${eventId}/guest-status-counts`,
        method: 'GET',
      }),
      providesTags: ['GuestStatusCount'],
      keepUnusedDataFor: 0, // Adjust the tag if needed for cache invalidation
    }),

    fetchDashboardUpcomingEvents: builder.query({
      query: () => ({
        url: 'v1/events/dashboard/upcoming-events',
        method: 'GET',
      }),
      providesTags: ['DashboardUpcomingEvents'],
      keepUnusedDataFor: 0, // Adjust the tag if needed for cache invalidation
    }),

    getGuests: builder.query<GuestListResponse, string>({
      query: (eventId: string) => ({
        url: `v1/events/${eventId}/guests/`,
        method: 'GET',
      }),
      providesTags: ['EventGuestList'],
    }),

    manageGuest: builder.mutation({
      query: ({
        guestId,
        action,
        payload,
      }: {
        guestId?: string;
        action: 'CREATE' | 'UPDATE' | 'DELETE';
        payload?: ManageGuestPayload;
      }) => {
        const baseUrl = 'v1/events/manage-guests';

        return {
          url: baseUrl,
          method: 'PUT',
          body: {
            inclusiveIds: [guestId],
            action,
            ...payload,
          },
        };
      },
      invalidatesTags: ['EventDetails', 'GuestStatusCount', 'EventGuestList'],
    }),
  }),
});

export const {
  useFetchEventsQuery,
  useFetchEventDetailsQuery,
  useFetchAllEventsQuery,
  useFetchHostEventsQuery,
  useFetchGuestStatusCountQuery,
  useFetchDashboardUpcomingEventsQuery,
  useFetchHostEventDetailsQuery,
  useGetGuestsQuery,
  useManageGuestMutation,
  useFetchPublicEventDetailsQuery,
} = eventApiAction;
