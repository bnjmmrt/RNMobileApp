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
            query: ({ eventId }) => ({
                url: `v1/events/invitation/${eventId}/cancel`,
                method: 'DELETE',
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
    }),
});

export const {
    useSubmitApplicationMutation,
    useUpdateApplicationMutation,
    useDeleteApplicationMutation,
    useGetApplicationQuery,
    useGetQuizQuestionQuery,
} = rspvApiAction;
