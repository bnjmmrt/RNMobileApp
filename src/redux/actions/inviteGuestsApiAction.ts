import { EndPoint } from 'src/ApiManager/config';
import { createBaseApi } from '../../ApiManager/createBaseApi';

export const inviteGuestsApiAction = createBaseApi.injectEndpoints({
  endpoints: builder => ({
    inviteGuest: builder.mutation({
      query: ({
        payload,
        eventId,
      }: {
        eventId: string;
        payload: {
          guestStatus: string;
          inviteMessage: string;
          maxAdditionalGuests: number;
          privateGuestNote: string;
          ticketTypeId: string;
          users: string[];
        };
      }) => ({
        url: `${EndPoint.events_events}/manage-guests?eventId=${eventId}`,
        method: 'PUT',
        body: {
          maxAdditionalGuests: payload.maxAdditionalGuests,
          ticketTypeId: payload.ticketTypeId,
          inviteMessage: payload.inviteMessage,
          privateGuestNote: payload.privateGuestNote,
          action: 'CREATE',
          exclusiveIds: [],
          currentStatus: payload.guestStatus,
          guestStatus: payload.guestStatus,
          inclusiveIds: payload.users,
          isSelectedAll: false,
          sendNotification: true,
        },
      }),
      invalidatesTags: ['Users'],
    }),
    inviteNewGuests: builder.mutation({
      query: ({
        payload,
        eventId,
      }: {
        eventId: string;
        payload: {
          guestStatus: string;
          inviteMessage: string;
          maxAdditionalGuests: number;
          privateGuestNote: string;
          sendInvite: boolean;
          ticketTypeId: string;
          firstName: string;
          lastName: string;
          email?: string;
          phoneNumber?: string;
        };
      }) => ({
        url: `${EndPoint.events_events}/${eventId}/invite-new-user`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Users'],
    }),
    getUserWithRolesByEmail: builder.mutation({
      query: (requestParam: { email: string }) => ({
        url: EndPoint.get_user_with_role_by_email,
        method: 'POST',
        body: requestParam,
      }),
    }),
    getUserWithRolesByPhone: builder.mutation({
      query: (requestParam: { phoneNumber: string }) => ({
        url: EndPoint.get_user_with_role_by_phone,
        method: 'POST',
        body: requestParam,
      }),
    }),
    getUserWithRolesById: builder.mutation({
      query: (requestParam: { id: string }) => ({
        url: EndPoint.get_user_with_role_by_id,
        method: 'POST',
        body: requestParam,
      }),
    }),
  }),
});

export const {
  useInviteGuestMutation,
  useInviteNewGuestsMutation,
  useGetUserWithRolesByEmailMutation,
  useGetUserWithRolesByPhoneMutation,
  useGetUserWithRolesByIdMutation,
} = inviteGuestsApiAction;
