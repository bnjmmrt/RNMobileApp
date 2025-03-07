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
          sendInvite: boolean;
          ticketTypeId: string;
          users: string[];
        };
      }) => ({
        url: `${EndPoint.events}/${eventId}/guests`,
        method: 'POST',
        body: payload,
      }),
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
        url: `${EndPoint.events}/${eventId}/invite-new-user`,
        method: 'POST',
        body: payload,
      }),
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
