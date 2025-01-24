import { createBaseApi } from "../../ApiManager/createBaseApi";

export const eventApiAction = createBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchEvents: builder.query({
      query: ({ eventId, guestEventStatus, searchText, take, skip }: { eventId: string; guestEventStatus: string , searchText: string, take: number, skip: number }) => ({
        url: `v1/events/guest/events/${eventId}?guestEventStatus=${guestEventStatus}&take=${take}&skip=${skip}&findInNameAndDescription=${searchText}`,
        method: 'GET',
      }),
      providesTags: ['Event'], // Adjust the tag if needed for cache invalidation
    }),
  }),
});

export const { useFetchEventsQuery } = eventApiAction;
