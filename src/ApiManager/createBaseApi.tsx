import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { environment } from '../../environments/environment';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
import { performLogout, switchProfileDueToInactiveRole } from 'src/utils/functions';

// Middleware for logging requests and responses
const logMiddleware = async (
  args: string | FetchArgs,
  api: Parameters<BaseQueryFn>[1],
  extraOptions: Parameters<BaseQueryFn>[2],
  baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
) => {
  const {
    url,
    method = 'GET',
    body,
  } = typeof args === 'string' ? { url: args } : args;

  console.log(`[API Request] ${method} ${environment.BASE_URL}${url}`, {
    body,
  });

  const result = await baseQuery(args, api, extraOptions);

  console.log(`[API Response] ${method} ${environment.BASE_URL}${url}`, result);

  if (result.error) {
    console.error(`[API Error] ${method} ${url}`, result.error);
    if (result?.error?.status == 401) {
      FlashMessageComponent.show('error', result?.error?.message || "Unauthorized!!");
      performLogout()
    } else if (result?.error?.status == 301) {
      switchProfileDueToInactiveRole(result.data.data)
    }
    // FlashMessageComponent.show(
    //   'error',
    //   result.error?.data?.message || 'Something went wrong, please try again!',
    // );
  } else {
    if (result?.data?.statusCode === 206) {
      switchProfileDueToInactiveRole(result.data.data)
    }
  }

  console.log("API Response", result)
  return result;
};

// Custom base query function
export const customBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = (args, api, extraOptions) =>
    logMiddleware(
      args,
      api,
      extraOptions,
      fetchBaseQuery({
        baseUrl: environment.BASE_URL,
        prepareHeaders: (headers, { getState }) => {
          const token = (getState() as any).auth?.token; // Replace with your token logic
          const role = (getState() as any).auth?.role; // Replace with your token logic
          console.log('Token:', token);
          console.log("Api call role:", role)
          if (token) {
            headers.set('Authorization', `Bearer ${token}`);
            headers.set('requester', `${role}`);
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
    'HostEvents',
    'Filters',
    'GuestStatusCount',
    'DashboardUpcomingEvents',
    'EventGuestList',
    'GuestDetails',
    'HostEventsAnnouncment',
    'AnnouncmentRecipient',
    'SelectedRecipient',
    'CreateEventsAnnouncment',
    'DeleteAnnouncement',
    'AnnouncmentDetail',
    'fetchNotification',
    'notificationDetail',
    'EventSignupForms',
    'EventTypes',
  ], // Accept tagTypes as a parameter
  endpoints: () => ({}),
  keepUnusedDataFor: 0, // Optional: Adjust cache duration
  refetchOnFocus: true, // Optional: Refetch data when the app is focused
});
