import { objectToQueryString } from '../utils/functions';

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

export const getSchoolList = (params: Record<string, string | number | boolean>): string => {
  const queryString = objectToQueryString(params);

  return `/program-management/api/geography/school${queryString}`;
};