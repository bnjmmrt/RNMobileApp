import { createBaseApi } from "../../ApiManager/createBaseApiWithoutFecthBaseQuery";

export const eventApiAction = createBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchEvents: builder.query({
      query: ({ eventId, guestEventStatus }: { eventId: string; guestEventStatus: string }) => ({
        url: `v1/events/guest/events/${eventId}?guestEventStatus=${guestEventStatus}`,
        method: 'GET',
      }),
      providesTags: ['Event'], // Adjust the tag if needed for cache invalidation
    }),
  }),
});

export const { useFetchEventsQuery } = eventApiAction;
