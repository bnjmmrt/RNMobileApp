import { createBaseApi } from "src/ApiManager/createBaseApi";

export const rspvApiAction = createBaseApi.injectEndpoints({
    endpoints: (builder) => ({
        submitApplication: builder.mutation({
            query: (requestParam) => ({
                url: 'events/v1/events/request/guest',
                method: 'POST',
                body: requestParam,
            }),
        }),
        updateApplication: builder.mutation({
            query: (requestParam) => ({
                url: 'events/v1/events/request/guest',
                method: 'PUT',
                body: requestParam,
            }),
        }),
        deleteApplication: builder.mutation({
            query: ({ eventId, id }) => ({
                url: `events/v1/users/${id}/events/${eventId}/cancel`,
                method: 'PUT',
            }),
        }),
        getApplication: builder.query({
            query: ({ id, eventId }) => ({
                url: `events/v1/events/request/guest/${id}/${eventId}`,
                method: 'GET',
            }),
        }),
        getQuizQuestion: builder.query({
            query: ({ id }) => ({
                url: `events/v1/events/${id}/quiz-question`,
                method: 'GET',
            }),
        }),
        getQuizQuestionAnswer: builder.query({
            query: ({ userId, eventId }) => ({
                url: `events/v1/users/${userId}/events/${eventId}/request`,
                method: 'GET',
            }),
        }),
        vouchRequest: builder.mutation({
            query: (requestParam) => ({
                url: 'events/v1/events/vouch-requests',
                method: 'POST',
                body: requestParam,
            }),
        }),
        declineApplication: builder.mutation({
            query: ({ id, eventId, reason, guestId }) => ({
                url: `events/v1/users/${id}/events/${eventId}/decline`,
                method: 'PUT',
                body: { reason, guestId },
            }),
        }),
        acceptInvitation: builder.mutation({
            query: ({ id, eventId, limitOnePlus }) => ({
                url: `events/v1/users/${id}/events/${eventId}/accept`,
                method: 'PUT',
                body: { limitOnePlus }
            }),
        }),
        inviteGuests: builder.mutation({
            query: ({ userId, eventId, guests }) => ({
                url: `events/v1/users/${userId}/events/${eventId}/invite-guests`,
                method: 'POST',
                body: { guests },
            }),
        }),
        deleteConfirmedGuest: builder.mutation({
            query: ({ userId, eventId, id }) => ({
                url: `events/v1/users/${userId}/events/${eventId}/guest/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useSubmitApplicationMutation,
    useUpdateApplicationMutation,
    useDeleteApplicationMutation,
    useGetApplicationQuery,
    useGetQuizQuestionQuery,
    useGetQuizQuestionAnswerQuery,
    useVouchRequestMutation,
    useDeclineApplicationMutation,
    useInviteGuestsMutation,
    useDeleteConfirmedGuestMutation,
    useAcceptInvitationMutation
} = rspvApiAction;