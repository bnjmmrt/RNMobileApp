import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://901b-106-220-185-88.ngrok-free.app/',
    prepareHeaders: (headers, { getState }) => {
      // Add common headers
      const token = ""//getState().auth?.token; // Get token from Redux state
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['CheckMember'], // Common cache tags
  endpoints: () => ({}), // No endpoints in the base API
});
