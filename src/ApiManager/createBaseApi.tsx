import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { environment } from '../../environments/environment';

// Middleware for logging requests and responses
const logMiddleware = async (args, api, extraOptions, baseQuery) => {
  const {
    url,
    method = 'GET',
    body,
  } = typeof args === 'string' ? { url: args } : args;

  console.log(`[API Request] ${method} ${environment.BASE_URL}${url}`, { body });

  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    console.error(`[API Error] ${method} ${url}`, result.error);
  } else {
    console.log(`[API Response] ${method} ${url}`, result.data);
  }

  return result;
};

// Custom base query function
export const customBaseQuery = (args, api, extraOptions) =>
  logMiddleware(
    args,
    api,
    extraOptions,
    fetchBaseQuery({
      baseUrl: environment.BASE_URL,
      prepareHeaders: (headers, { getState }) => {
        const token = getState().auth?.token; // Replace with your token logic
        console.log('Token:', token);
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
        headers.set('Content-Type', 'application/json');
        headers.set('Accept', 'application/json');
        return headers;
      },
    }),
  );

// Create API with custom base query
export const createBaseApi = createApi({
  reducerPath: 'api',
  baseQuery: customBaseQuery,
  tagTypes: [
    'NO_CACHE',
    'Login',
    'Event',
    'Users',
    'UserDetail',
    'CustomLists',
    'CustomListDetail',
    'EventDetails',
    'Events',
    'HostEvents'
  ], // Accept tagTypes as a parameter
  endpoints: () => ({}),
  keepUnusedDataFor: 60, // Optional: Adjust cache duration
  refetchOnFocus: true, // Optional: Refetch data when the app is focused
});
