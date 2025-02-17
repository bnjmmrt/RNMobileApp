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
        url: `v1/events/users/${userId}/events?guestEventStatus=${guestEventStatus}s&take=${take}&skip=${skip}&findInNameAndDescription=${searchText}`,
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
      }: {
        userId: string;
      }) => ({
        url: `v1/events/users/${userId}/events`,
        method: 'GET',
      }),
      providesTags: ['Events'], // Adjust the tag if needed for cache invalidation
    }),

    fetchEventDetails: builder.query({
      query: ({
        eventId,
      }: {
        eventId: string;
      }) => ({
        url: `v1/events/event/${eventId}`,
        method: 'GET',
      }),
      providesTags: ['EventDetails'],
      keepUnusedDataFor: 0// Adjust the tag if needed for cache invalidation
    }),

  }),
});

export const { useFetchEventsQuery, useFetchEventDetailsQuery, useFetchAllEventsQuery, useFetchHostEventsQuery } = eventApiAction;