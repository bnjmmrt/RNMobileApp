import {
  ManageGuestPayload,
  GuestListResponse,
} from 'src/screens/EventScreen/types';
import { createBaseApi } from '../../ApiManager/createBaseApi';
import { addAnnouncementRequestInterface } from 'src/screens/EventScreen/Announcement/AddAnnouncement/AddAnnouncementInterface';
import { EndPoint } from 'src/ApiManager/config';

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
        url: `events/v1/events/users/${userId}/events?guestEventStatus=${guestEventStatus}&take=${take}&skip=${skip}&findInNameAndDescription=${searchText}`,
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
        url: `events/v1/hosts/events?take=${take}&skip=${skip}&status=${status}&eventName=${searchText}`,
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
        isFeed = true,
      }: {
        statusName?: string;
        userId: string;
        queryString?: string;
        searchText?: string;
        take?: number;
        skip?: number;
        isFeed?: boolean;
      }) => {
        let url = `events/v1/events/users/${userId}/events?`;
        if (isFeed) {
          url = `${url}&feed=true`;
        }
        if (take) {
          url = `${url}&take=${take}&skip=${skip}`;
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
          url: `${url}`,
          method: 'GET',
        };
      },
      providesTags: ['Events'], // Adjust the tag if needed for cache invalidation
    }),

    fetchEventDetails: builder.query({
      query: ({ eventId, userId }: { eventId: string; userId: string }) => ({
        url: `events/v1/users/${userId}/events/${eventId}`,
        method: 'GET',
      }),
      providesTags: ['EventDetails'],
      keepUnusedDataFor: 0, // Adjust the tag if needed for cache invalidation
    }),

    fetchPublicEventDetails: builder.query({
      query: ({ eventId }: { eventId: string }) => ({
        url: `events/v1/events/event/${eventId}`,
        method: 'GET',
      }),
      providesTags: ['EventDetails'],
      keepUnusedDataFor: 0, // Adjust the tag if needed for cache invalidation
    }),

    fetchHostEventDetails: builder.query({
      query: ({ eventId }: { eventId: string }) => ({
        url: `events/v1/event/${eventId}`,
        method: 'GET',
      }),
      providesTags: ['EventDetails'],
      keepUnusedDataFor: 0, // Adjust the tag if needed for cache invalidation
    }),

    fetchGuestStatusCount: builder.query({
      query: ({ eventId }: { eventId: string }) => ({
        url: `events/v1/events/${eventId}/guest-counts`,
        method: 'GET',
      }),
      providesTags: ['GuestStatusCount'],
      keepUnusedDataFor: 0, // Adjust the tag if needed for cache invalidation
    }),

    fetchDashboardUpcomingEvents: builder.query({
      query: () => ({
        url: 'events/v1/events/dashboard/upcoming-events',
        method: 'GET',
      }),
      providesTags: ['DashboardUpcomingEvents'],
      keepUnusedDataFor: 0, // Adjust the tag if needed for cache invalidation
    }),

    getGuests: builder.query({
      query: ({
        eventId,
        queryString,
        searchValue,
        sortBy,
        sortDirection,
        take,
        skip,
        guestStatus,
      }: {
        eventId?: string;
        queryString?: string;
        searchValue?: string;
        sortBy?: 'name' | 'partySize';
        guestStatus?:
        | 'INVITED'
        | 'APPLIED'
        | 'CONFIRMED'
        | 'DECLINED'
        | 'DRAFT'
        | '';
        sortDirection?: 'ASC' | 'DESC';
        take?: number;
        skip?: number;
      }) => {
        let url = `events/v1/events/${eventId}/guests/?`;
        if (take) {
          url = `${url}&take=${take}&skip=${skip}`;
        }
        if (queryString) {
          url = `${url}&${queryString}`;
        }
        if (searchValue) {
          url = `${url}&searchValue=${searchValue}`;
        }
        if (sortBy && sortDirection) {
          url = `${url}&sortBy=${sortBy}&sortDirection=${sortDirection}`;
        }
        if (guestStatus) {
          url = `${url}&status=${guestStatus}`;
        }
        return {
          url,
          method: 'GET',
        };
      },
      providesTags: ['EventGuestList'],
    }),

    fetchGuestDetails: builder.query({
      query: (guestId: string) => ({
        url: `events/v1/events/guest-details/${guestId}`,
        method: 'GET',
      }),
      providesTags: ['GuestDetails'],
    }),

    manageGuest: builder.mutation({
      query: ({
        payload,
        eventId,
      }: {
        eventId: string;
        payload?: ManageGuestPayload;
      }) => {
        const baseUrl = `${EndPoint.events_events}/manage-guests?eventId=${eventId}`;

        return {
          url: baseUrl,
          method: 'PUT',
          body: payload,
        };
      },
      invalidatesTags: ['EventDetails', 'GuestStatusCount', 'EventGuestList'],
    }),

    // create event announcement for host builder.mutation({

    createEventAnnouncement: builder.mutation({
      query: ({
        eventId,
        payload,
      }: {
        eventId: string;
        payload: addAnnouncementRequestInterface;
      }) => ({
        url: `events/v1/event/${eventId}/event-announcement`,
        method: 'POST',
        body: payload,
      }),
    }),

    // fetch event announcement for host
    fetchHostEventsAnnouncement: builder.query({
      query: ({
        eventId,
        take,
        skip,
      }: {
        eventId: any;
        take: number;
        skip: number;
      }) => ({
        url: `events/v1/event/${eventId}/event-announcements?take=${take}&skip=${skip}`,
        method: 'GET',
      }),
      providesTags: ['HostEventsAnnouncment'],
    }),

    // fetch event receipient for host
    fetchAnnouncementRecipients: builder.query({
      query: ({
        eventId,
        ticketType,
        addedBy,
        searchText,
        take,
        skip,
      }: {
        eventId: string;
        ticketType: string;
        addedBy: string;
        searchText: string;
        take: number;
        skip: number;
      }) => ({
        url: `events/v1/event/${eventId}/event-announcement-guest?${ticketType}&${addedBy}&findByName=${searchText}&take=${take}&skip=${skip}`,
        method: 'GET',
      }),
      providesTags: ['AnnouncmentRecipient'],
    }),

    // fetch selected event receipient for edit announcement
    fetchSelectedRecipients: builder.query({
      query: ({
        eventId,
        announcementId,
        searchText,
        take,
        skip,
      }: {
        eventId: string;
        announcementId: string;
        searchText: string;
        take: number;
        skip: number;
      }) => ({
        url: `events/v1/event/${eventId}/event-announcement-guest/${announcementId}?findByName=${searchText}&take=${take}&skip=${skip}`,
        method: 'GET',
      }),
      providesTags: ['SelectedRecipient'],
    }),

    // delete announcement
    deleteEventAnnouncement: builder.mutation({
      query: ({
        eventId,
        announcementId,
      }: {
        eventId: string;
        announcementId: string;
      }) => ({
        url: `events/v1/event/${eventId}/event-announcement/${announcementId}`,
        method: 'DELETE',
      }),
    }),

    //edit announcement
    editEventAnnouncement: builder.mutation({
      query: ({
        eventId,
        announcementId,
        payload,
      }: {
        eventId: string;
        announcementId: string;
        payload: addAnnouncementRequestInterface;
      }) => ({
        url: `events/v1/event/${eventId}/event-announcement/${announcementId}`,
        method: 'PATCH',
        body: payload,
      }),
    }),
    // fetch announcement detail  for host
    fetchAnnouncementDetail: builder.query({
      query: ({
        eventId,
        announcementId,
      }: {
        eventId: string;
        announcementId: string;
      }) => ({
        url: `events/v1/event/${eventId}/event-announcement/${announcementId}`,
        method: 'GET',
      }),
      providesTags: ['AnnouncmentDetail'],
    }),

    // fetch signup forms for an event
    fetchSignupForms: builder.query({
      query: ({ eventId }: { eventId: string }) => ({
        url: `/events/v1/events/${eventId}/signup-forms`,
        method: 'GET',
      }),
      providesTags: ['EventSignupForms'],
    }),

    fetchEventTypes: builder.query({
      query: ({ }: {}) => ({
        url: `/events/v1/event-types`,
        method: 'GET',
      }),
      providesTags: ['EventTypes'],
    }),

    guestCheckIn: builder.mutation({
      query: ({ guestId, checkIn }: { guestId: string; checkIn: boolean }) => ({
        url: `events/v1/guest/ticket/${guestId}/validate`,
        method: 'POST',
        body: { checkIn },
      }),
      invalidatesTags: [
        'GuestDetails',
        // 'EventGuestList',
        'GuestStatusCount',
        'EventDetails',
      ],
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
  useLazyGetGuestsQuery,
  useManageGuestMutation,
  useFetchPublicEventDetailsQuery,
  useLazyFetchEventDetailsQuery,
  useLazyFetchPublicEventDetailsQuery,
  useFetchGuestDetailsQuery,
  useCreateEventAnnouncementMutation,
  useDeleteEventAnnouncementMutation,
  useFetchAnnouncementRecipientsQuery,
  useFetchHostEventsAnnouncementQuery,
  useFetchSelectedRecipientsQuery,
  useEditEventAnnouncementMutation,
  useFetchAnnouncementDetailQuery,
  useFetchSignupFormsQuery,
  useFetchEventTypesQuery,
  useGuestCheckInMutation,
} = eventApiAction;
