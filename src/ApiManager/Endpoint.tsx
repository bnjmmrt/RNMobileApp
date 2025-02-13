import dayjs from 'dayjs';
import { objectToQueryString, objectToQueryStringFilter } from '../utils/functions';
import { apiGet } from './MainApi';

/**
 * Generates an endpoint URL with query parameters for fetching listing data.
 * @param params - An object containing query parameters (e.g., id, page, page_limit, category).
 * @returns A string representing the full endpoint URL with query parameters appended.
 * 
 * Example:
 * Input: { id: 7726, page: 1, page_limit: 3, category: 'do' }
 * Output: 'api/v2/event/get_detail?id=7726&page=1&page_limit=3&category=do'
 */
export const getListing = (params: Record<string, string | number | boolean>): string => {
  const queryString = objectToQueryString(params);
  return `api/v2/event/get_detail${queryString}`;
};

export const getRegions = (params?: Record<string, string | number | boolean>): string => {
  const queryString = params ? objectToQueryString(params) : '';

  return `/program-management/api/geography/region${queryString}`;
};

export const getLocalAuthority = (params: Record<string, string | number | boolean>): string => {
  const queryString = objectToQueryString(params);

  return `/program-management/api/geography/local-authority${queryString}`;
};

export const getUserEvents = async (userId: string, filter: any) => {
  const params = {
    minStartDate: filter.date[0] ? dayjs(filter.date[0]).format('YYYY-MM-DD') : '',
    maxEndDate: filter.date[1] ? dayjs(filter.date[1]).format('YYYY-MM-DD') : '',
    longitude: filter.location.longitude,
    latitude: filter.location.latitude,
    eventTypeName: filter.categories, // Pass array directly
  };

  const queryString = objectToQueryStringFilter(params);
  const res: any = await apiGet(`/events/users/${userId}/events${queryString}`);

  return res;
};

