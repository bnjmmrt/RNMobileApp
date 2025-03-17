import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import { environment } from '../../environments/environment';
import { FlashMessageComponent } from '../component/FlashMessageComponent/FlashMessageComponent';
import { store } from 'src/redux/store';

// Create an Axios instance with type annotations
export const axiosController: AxiosInstance = axios.create({
  baseURL: environment.BASE_URL,
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
    const fullUrl = config.baseURL
      ? `${config.baseURL}${config.url}`
      : config.url;
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
  (error: AxiosError) => Promise.reject(error),
);

// Response interceptor (e.g., handle global errors)
// Response interceptor for global error handling
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
    const errorMessage =
      (error.response?.data as any)?.error?.message || error.message;
    if (status === 400) {
      console.error('Bad request:', errorMessage);
      FlashMessageComponent.show(
        'error',
        errorMessage || 'Something went wrong, please try again!',
      );
    } else if (status === 401) {
      console.error('Unauthorized access - Token might be expired');
      FlashMessageComponent.show(
        'error',
        'Unauthorized access - Token might be expired',
      );
    } else if (status === 403) {
      console.error('Forbidden access:', errorMessage);
      FlashMessageComponent.show('error', errorMessage || 'Forbidden access');
    } else if (status === 404) {
      console.error('Resource not found:', errorMessage);
      FlashMessageComponent.show('error', 'Resource not found');
    } else if (status >= 500) {
      console.error('Internal server error:', errorMessage);
      FlashMessageComponent.show(
        'error',
        'Internal server error. Please try again later.',
      );
    } else {
      console.error('An error occurred:', errorMessage);
      FlashMessageComponent.show('error', errorMessage);
    }

    return Promise.reject(error);
  },
);
