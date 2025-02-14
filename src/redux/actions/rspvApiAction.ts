import { createBaseApi } from "src/ApiManager/createBaseApi";

export const rspvApiAction = createBaseApi.injectEndpoints({
    endpoints: (builder) => ({
        submitApplication: builder.mutation({
            query: (requestParam) => ({
                url: 'v1/events/request/guest',
                method: 'POST',
                body: requestParam,
            }),
        }),
        updateApplication: builder.mutation({
            query: (requestParam) => ({
                url: 'v1/events/request/guest',
                method: 'PUT',
                body: requestParam,
            }),
        }),
        deleteApplication: builder.mutation({
            query: ({ eventId, id }) => ({
                url: `v1/users/${id}/events/${eventId}/cancel`,
                method: 'PUT',
            }),
        }),
        getApplication: builder.query({
            query: ({ id, eventId }) => ({
                url: `v1/events/request/guest/${id}/${eventId}`,
                method: 'GET',
            }),
        }),
        getQuizQuestion: builder.query({
            query: ({ id }) => ({
                url: `v1/events/${id}/quiz-question`,
                method: 'GET',
            }),
        }),
        getQuizQuestionAnswer: builder.query({
            query: ({ userId, eventId }) => ({
                url: `v1/users/${userId}/events/${eventId}/request`,
                method: 'GET',
            }),
        }),
        vouchRequest: builder.mutation({
            query: (requestParam) => ({
                url: 'v1/platform/vouch-requests',
                method: 'POST',
                body: requestParam,
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
} = rspvApiAction;
