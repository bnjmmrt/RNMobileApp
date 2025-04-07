// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { environment } from '../../environments/environment';

// export const createBaseApi = createApi({
//   baseQuery: async (args, api, extraOptions) => {
//     const { url, method = 'GET', body } = typeof args === 'string' ? { url: args } : args;

//     console.log(`[API Request] ${method} ${environment.DEV_URL}${url}`, { body });

//     try {
//       const rawResponse = await fetch(`${environment.DEV_URL}${url}`, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//           // ...(api.getState().auth?.token && { Authorization: `Bearer ${api.getState().auth.token}` }),
//         },
//         body: body ? JSON.stringify(body) : undefined,
//       });

//       const responseText = await rawResponse.text();

//       let data;
//       try {
//         data = JSON.parse(responseText); // Parse JSON response
//       } catch {
//         console.warn(`[Non-JSON Response] ${method} ${url}`, responseText);
//         data = { nonJsonResponse: responseText }; // Handle non-JSON
//       }

//       if (!rawResponse.ok) {
//         console.error(`[API Error] ${method} ${url}`, { status: rawResponse.status, data });
//         return { error: { status: rawResponse.status, data } };
//       }

//       console.log(`[API Response] ${method} ${url}`, data);
//       return { data };
//     } catch (err) {
//       console.error(`[API Error] ${method} ${url}`, err);
//       return { error: { status: 'FETCH_ERROR', data: 'Network or unexpected error occurred' } };
//     }
//   },
//   tagTypes: ['Login','Event'], // Accept tagTypes as a parameter
//   endpoints: () => ({}),
// });
