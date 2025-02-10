import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { environment } from '../../environments/environment';
import { getItem, TagKey } from '../utils/functions';
import { FlashMessageComponent } from '../component/FlashMessageComponent/FlashMessageComponent';
import {store} from 'src/redux/store';

// Create an Axios instance with type annotations
export const axiosController: AxiosInstance = axios.create({
  baseURL: environment.DEV_URL,
  timeout: 10000, // Timeout in ms
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosController.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    // const token = ''; // Example: retrieve token;
    // const token = await getItem(TagKey.IsBearerToken);
    const token = store.getState().auth.token;
    if (token) {
      if (config.headers) {
        config.headers['Authorization'] = token ? `Bearer ${token}` : '';
      }
    }

    // Log the request URL and other details
    const fullUrl = config.baseURL ? `${config.baseURL}${config.url}` : config.url;
    console.log('Request URL:', fullUrl);
    console.log('Request Method:', config.method);
     console.log('Request Headers:', config.headers);
    if (config.params) {
      console.log('Request Params:', config.params);
    }
    if (config.data) {
      console.log('Request Data:', config.data);
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor (e.g., handle global errors)
// Response interceptor for global error handling
axiosController.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log the response URL, status, and data
    console.log('Response URL:', response.config.url);
    console.log('Response Status:', response.status);
    console.log('Response Data:', response.data);

    return response.data; // Return only the data part of the response
  },
  // Only return the data part of the response
  (error: AxiosError) => {
    console.log('API Error:', error);

    // Log the request URL if available
    const requestUrl = error.config?.url;
    if (requestUrl) {
      console.log('Request URL on error:', requestUrl);
    }
    const status = error.response?.status;
    if (status === 400) {
      console.error('Bad request ----');
      FlashMessageComponent.show('error', 'Something went wrong, please try again!');
    } else
      if (status === 401) {
        FlashMessageComponent.show('error', "Unauthorized access - Token might be expired")
        console.error('Unauthorized access - Token might be expired');
      } else if (status === 403) {
        console.error('Forbidden access');
      } else if (status === 404) {
        console.error('Resource not found');
      } else if (status >= 500) {
        console.error('Internal server error');
      } else {
        console.error('An error occurred:', error.message);
      }

    return Promise.reject(error); // Propagate error
  }
);

