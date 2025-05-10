import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import { environment } from '../../environments/environment';
import { FlashMessageComponent } from '../component/FlashMessageComponent/FlashMessageComponent';
import { store } from 'src/redux/store';
import {
  getErrorMessage,
  performLogout,
  switchProfileDueToInactiveRole,
} from 'src/utils/functions';

// Extend AxiosRequestConfig to include custom `withAuth` key
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  withAuth?: boolean; // Optional flag to control token inclusion
}

// Create an Axios instance
export const axiosController: AxiosInstance = axios.create({
  baseURL: environment.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosController.interceptors.request.use(
  async (config: CustomAxiosRequestConfig) => {
    const token = store.getState().auth.token;
    const role = store.getState().auth.role;
    console.log('Api call role:', role);

    // Check for `withAuth` flag (default true if not specified)
    const shouldAttachToken = config.withAuth !== false;

    if (shouldAttachToken && token) {
      if (config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
        config.headers['requester'] = `${role}`;
      }
    }

    // Log the request URL and other details
    const fullUrl = config.baseURL
      ? `${config.baseURL}${config.url}`
      : config.url;
    console.log('Request URL:', fullUrl, config.method);
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// Response interceptor
axiosController.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    console.log('API Error:', error);
    const requestUrl = error.config?.url;
    if (requestUrl) {
      console.log('Request URL on error:', requestUrl);
    }

    const status = error.response?.status;
    // const errorMessage = (error.response?.data as any)?.error?.message || error?.message;

    if (status === 400) {
      console.log('Error 400 error:', error);
      // FlashMessageComponent.show(
      //   'error',
      //   getErrorMessage(error?.response) || 'Something went wrong, please try again!',
      // );
    } else if (status === 401) {
      performLogout();
      // FlashMessageComponent.show(
      //   'error',
      //   'Unauthorized access - Token might be expired',
      // );

      // } else if (status === 403) {
      //   FlashMessageComponent.show('error', errorMessage || 'Forbidden access');
      // } else if (status === 404) {
      //   FlashMessageComponent.show('error', 'Resource not found');
      // } else if (status >= 500) {
      //   FlashMessageComponent.show(
      //     'error',
      //     'Internal server error. Please try again later.',
      //   );
      // } else if (status === 302) {
      //   console.log("Error 302 error:", error?.response?.data)
      //   FlashMessageComponent.show('error', errorMessage || 'Current user role is inactive. switching to active role');
      //   switchProfileDueToInactiveRole(error?.response?.data)
    } else {
      console.log('Error 4002 error:', error);
      // FlashMessageComponent.show('error', errorMessage);
    }

    return error.response;
  },
);
