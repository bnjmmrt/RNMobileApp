import { EndPoint } from 'src/ApiManager/config';
import { createBaseApi } from '../../ApiManager/createBaseApi';

export const inviteGuestsApiAction = createBaseApi.injectEndpoints({
  endpoints: builder => ({
    inviteGuests: builder.mutation({
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
  }),
});

export const { useInviteGuestsMutation, useInviteNewGuestsMutation } =
  inviteGuestsApiAction;
