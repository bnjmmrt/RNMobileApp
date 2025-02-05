import { createBaseApi } from "../../ApiManager/createBaseApi";

export const eventApiAction = createBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchEvents: builder.query({
      query: ({ userId, guestEventStatus, searchText, take, skip }: { userId: string; guestEventStatus: string, searchText: string, take: number, skip: number }) => ({
        url: `v1/events/users/${userId}/events?guestEventStatus=${guestEventStatus}&take=${take}&skip=${skip}&findInNameAndDescription=${searchText}`,
        method: 'GET',
      }),
      providesTags: ['Event'], // Adjust the tag if needed for cache invalidation
    }),
  }),
});

export const { useFetchEventsQuery } = eventApiAction;
