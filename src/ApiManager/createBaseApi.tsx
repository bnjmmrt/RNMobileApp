import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { environment } from '../../environments/environment';

// Create Base API with Logging
export const baseApi = createApi({
  reducerPath:'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: environment.DEV_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = ''; // Replace with your token logic
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Login','Event'], // Accept tagTypes as a parameter
  endpoints: () => ({}),
  keepUnusedDataFor: 60, // Optional: Adjust cache duration
  refetchOnFocus: true, // Optional: Refetch data when the app is focused
});

// Add Request and Response Logging Middleware
const logMiddleware = async (args, api, extraOptions, baseQuery) => {
  const { url, method = 'GET', body } = typeof args === 'string' ? { url: args } : args;

  console.log(`[API Request] ${method} ${environment.DEV_URL}${url}`, { body });

  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    console.error(`[API Error] ${method} ${url}`, result.error);
  } else {
    console.log(`[API Response] ${method} ${url}`, result.data);
  }

  return result;
};

export const customBaseQuery = (args, api, extraOptions) => logMiddleware(args, api, extraOptions, fetchBaseQuery({
  baseUrl: environment.BASE_URL,
}));


