import { useState, useCallback } from 'react';
import { axiosController } from './axiosController'; // Import your API controller
import { AxiosError } from 'axios';

// Define the return type for the hook

type MethodType= 'get' | 'post' | 'put' | 'delete'

interface UseApiReturn<T> {
  apiRequest: (method: MethodType, url: string, data?: Record<string, unknown> | null, params?: Record<string, unknown> | null) => Promise<T>;
  loading: boolean;
  error: AxiosError | null;
}

const useApi = <T>(): UseApiReturn<T> => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const apiRequest = useCallback(async (method: string, url: string, data:any , params: Record<string, unknown> | null = null): Promise<T> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosController[method](url, data || params);
      return response; // Return the response to the caller
    } catch (err) {
      setError(err as AxiosError);
      throw err; // Rethrow error for specific handling if needed
    } finally {
      setLoading(false);
    }
  }, []);

  return { apiRequest, loading, error };
};

export default useApi;
