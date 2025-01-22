import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { environment } from '../../environments/environment';

// Create an Axios instance with type annotations
export const axiosController: AxiosInstance = axios.create({
  baseURL: environment.DEV_URL, 
  timeout: 10000, // Timeout in ms
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosController.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = ''; // Example: retrieve token
    if (token) {
      if (config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor (e.g., handle global errors)
// Response interceptor for global error handling
axiosController.interceptors.response.use(
  (response: AxiosResponse) => response.data, // Only return the data part of the response
  (error: AxiosError) => {
    const status = error.response?.status;
    if (status === 400) {
      console.error('Bad request ----');
    } else
    if (status === 401) {
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

