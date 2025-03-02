import { useState, useCallback } from 'react';
import { axiosController } from './axiosController'; // Import your API controller
import { AxiosError, AxiosRequestConfig } from 'axios';

type MethodType = 'get' | 'post' | 'put' | 'delete';

interface UseApiReturn<T> {
  apiRequest: (
    method: MethodType,
    url: string,
    data?: Record<string, unknown> | FormData | null,
    params?: Record<string, unknown> | null,
    headers?: Record<string, string>,
  ) => Promise<T>;
  loading: boolean;
  error: AxiosError | null;
}

const useApi = <T>(): UseApiReturn<T> => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const apiRequest = useCallback(
    async (
      method: MethodType,
      url: string,
      data: Record<string, unknown> | FormData | null = null,
      params: Record<string, unknown> | null = null,
      headers: Record<string, string> = {},
    ): Promise<T> => {
      setLoading(true);
      setError(null);

      try {
        const config: AxiosRequestConfig = {
          params,
          headers,
          ...(method === 'delete' && data ? { data } : {}), // Ensure DELETE supports a body
        };

        const response = await axiosController[method](url, method === 'delete' ? config : data, config);
        return response;
      } catch (err) {
        setError(err as AxiosError);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { apiRequest, loading, error };
};

export default useApi;
