import axios, { AxiosHeaders } from 'axios';
import { ForceLogout, getApiBaseUrl, getItem, printLog } from '../utils/functions';
import { TagKey } from './config';
import { statusCode } from './config';

// const { dispatch, getState } = store;

// Helper function to get headers
export async function getHeaders(): Promise<{ headers: AxiosHeaders }> {
  const token = await getItem(TagKey.IsBearerToken);

  const headers = new AxiosHeaders();
  headers.set('Authorization', token ? `Bearer ${token}` : '');
  headers.set('Content-Type', 'application/json');

  return { headers };
}

// Base Axios instance
const instance = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 10000, // Default timeout 10 seconds
  headers: { 'Content-Type': 'application/json' },
});

export const apiPost = async (url: any, apiData = {}) => {
  console.log("Api post :", `${getApiBaseUrl()}${url}`)
  console.log("Api post param:", `${getApiBaseUrl()}${url}`, apiData)
  return new Promise(async (res, rej) => {
    instance
      .post(`${getApiBaseUrl()}${url}`, apiData, await getHeaders())
      .then(result => {
        console.log("result signup api", result)
        const { data, status } = result;
        console.log("Api Call Response ", data)
        return res({ data, status });
      })
      .catch(error => {
        printLog('🚀  check error ', error);
        console.log("Api post error:", `${getApiBaseUrl()}${url}`, error.response)

        // printLog('🚀  check error statusCode-->', error.response.status);
        printLog(
          '🚀  check error message-->',
          error.response.data.errorMessage,
        );

        if (error.response.status === statusCode.Unauthorized) {
          printLog(
            '🚀  check error logout -->',
            error.response.data.errorMessage,
          );
          // const {isLoggedIn, setLoggedIn} = useAuth();

          ForceLogout();

          // return rej({
          //   message: 'Network Error',
          //   msg: error.response.data.errorMessage || 'Network Error',
          // });
        }
        if (error && error.response && error.response.data) {
          if (!error.response.data.message) {
            return rej({
              ...error.response.data,
              msg: error.response.data.errorMessage || 'Network Error',
            });
          }
          return rej(error.response.data);
        } else {
          return rej({ message: 'Network Error', msg: 'Network Error' });
        }
      });
  });
};

export const apiPut = async (url: any, apiData: {}) => {
  console.log("Api Put :", `${getApiBaseUrl()}${url}`)
  console.log("Api Put param:", `${getApiBaseUrl()}${url}`, apiData)
  return new Promise(async (res, rej) => {
    axios
      .put(`${getApiBaseUrl()}${url}`, apiData, await getHeaders())
      .then(result => {
        const { data, status } = result;
        console.log("Api Call Response ", url, data)
        return res({ data, status });
      })
      .catch(error => {
        printLog('🚀  check error ', error.response);
        printLog(
          '🚀  check error message-->',
          error.response.data.errorMessage,
        );

        if (error.response.status === statusCode.Unauthorized) {
          printLog(
            '🚀  check error logout -->',
            error.response.data.errorMessage,
          );
          ForceLogout();
          return rej({
            message: 'User does not exists',
            msg: error.response.data.errorMessage || 'User does not exists',
          });
        }
        if (error && error.response && error.response.data) {
          if (!error.response.data.message) {
            return rej({
              ...error.response.data,
              msg: error.response.data.errorMessage || 'Network Error',
            });
          }
          return rej(error.response.data);
        } else {
          return rej({ message: 'Network Error', msg: 'Network Error' });
        }
      });
  });
};

export const apiGet = async (url: any) => {
  console.log("Api get :", `${getApiBaseUrl()}${url}`)
  return new Promise(async (res, rej) => {

    axios.get(getApiBaseUrl() + url, await getHeaders())
      .then(result => {
        const { data } = result;
        console.log("Get Api Call Response ", url, data)
        return res(data);
      })
      .catch(error => {
        printLog('🚀  check error ', error.response);

        printLog(
          '🚀  check error message-->',
          error.response.data.errorMessage,
        );

        if (error.response.status === statusCode.Unauthorized) {
          printLog(
            '🚀  check error logout -->',
            error.response.data.errorMessage,
          );

          ForceLogout();

          return rej({
            message: 'Network Error',
            msg: error.response.data.errorMessage || 'Network Error',
          });
        }
        if (error && error?.response && error?.response?.data) {
          if (!error?.response?.data?.message) {
            return rej({
              ...error.response.data,
              msg: error.response.data.errorMessage || 'Network Error',
            });
          }
          return rej(error?.response?.data);
        } else {
          return rej({ message: 'Network Error', msg: 'Network Error' });
        }
      });
  });
};

// Handle API errors
const handleApiError = (error: any, url: string) => {
  const errorResponse = error.response;
  printLog('🚀 API Error', errorResponse);

  if (errorResponse?.status === statusCode.Unauthorized) {
    printLog('🚀 Unauthorized Error. Logging out...', errorResponse.data?.errorMessage);
    ForceLogout();
  }

  console.log("API Error Response for:", url, errorResponse);
};
