import AsyncStorage from '@react-native-async-storage/async-storage';
// import moment from 'moment';
import { environment } from 'environments/environment';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import moment from 'moment-timezone';
import React from 'react';
import { Platform, StatusBar, Text } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { axiosController } from 'src/axios/axiosController';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
import { setProfileData } from 'src/redux/slices/appGlobalDataSlice';
import { resetAppStack, role, setDeviceId, setLoginData } from 'src/redux/slices/authSlice';
import {
  configStatusBar,
  SafeAreaViewConfig,
} from 'src/redux/slices/safeAreaViewConfigSlice';
import store from 'src/redux/store';
import settings, { EndPoint } from '../ApiManager/config';
import { ROLE } from './constants';
import { setEmail, setFirstName, setIsEmailPhoneBothVerified, setLastName, setPhone } from 'src/redux/slices/appFlowSlice';

// ErrorText component with TypeScript props
interface ErrorTextProps {
  msg: string;
}

export const getApiBaseUrl = () => {
  return settings.apiUrl.replace(/[^\x20-\x7E]/g, '');
};

export const getDeviceId = async () => {
  const dispatch = store.store.dispatch;

  DeviceInfo.getUniqueId()
    .then(uniqueId => {
      console.log('Device Unique ID:', uniqueId);
      dispatch(setDeviceId(uniqueId));
    })
    .catch(error => {
      console.error('Error getting unique ID:', error);
    });
};

export const LINKS = {
  TERMS_AND_CONDITION: 'https://www.therumor.com/terms-of-service',
  PRIVACY_POLICY: 'https://www.therumor.com/privacy-policy',
  APPLY_FOR_HOST: `${environment.HOST_WEB_URL}/auth/sign-up`,
};

export const fontFamily = {
  ABCDiatype_Bold: 'ABCDiatype-Bold',
  ABCDiatype_BoldItalic: 'ABCDiatype-BoldItalic',
  ABCDiatype_Light: 'ABCDiatype-Light',
  ABCDiatype_LightItalic: 'ABCDiatype-LightItalic',
  ABCDiatype_Medium: 'ABCDiatype-Medium',
  ABCDiatype_MediumItalic: 'ABCDiatype-MediumItalic',
  ABCDiatype_Regular: 'ABCDiatype-Regular',
  ABCDiatype_RegularItalic: 'ABCDiatype-RegularItalic',
  ABCDiatype_Thin: 'ABCDiatype-Thin',
  ABCDiatype_ThinItalic: 'ABCDiatype-ThinItalic',
  RomieTrial_Black: 'RomieTrial-Black',
  RomieTrial_Bold: 'RomieTrial-Bold',
  RomieTrial_Heavy: 'RomieTrial-Heavy',
  RomieTrial_Light: 'RomieTrial-Light',
  RomieTrial_Medium: 'RomieTrial-Medium',
  RomieTrial_Regular_Italic: 'RomieTrial-Regular-Italic',
  RomieTrial_Regular: 'RomieTrial-Regular',
  RomieTrial: 'RomieTrial',
};

export const getNumberOfLines = (str: string) => {
  if (!str) return 0;

  const totalChars = str.length;
  const charsPerLine = 50;

  return Math.ceil(totalChars / charsPerLine);
}

export const ErrorText: React.FC<ErrorTextProps> = ({ msg }) => {
  return (
    <Text
      style={{
        fontSize: 14,
        lineHeight: 19,
        color: '#EF5944',
        fontWeight: '400',
        marginLeft: 20,
        marginTop: 2,
      }}>
      {msg}
    </Text>
  );
};

export const AsyncStrings = {
  PROFILE_TYPE: 'ProfileType',
  LOGIN_TYPE: 'LoginType',
  EMAIL: 'Email',
  STEP_ONE: 'Step 1',
  STEP_TWO: 'Step 2',
  STEP_3: 'Step 3',
  SCHOOL_SELECTION: 'SchoolSelection',
  BASIC_PROFILE_DATA: 'BasicProfileData',
  REGION_TEXT: 'Region',
  ACCESS_TOKEN: 'AccessToken',
  SCHOOL_ID: 'SchoolId',
  USER_NAME: 'UserName',
};

// Helper function for logging
export function printLog(msg: string, value: any = ''): void {
  if (__DEV__) {
    console.log(msg, value);
  }
}

export function normalizeEmail(email: any): any {
  return email?.trim().toLowerCase();
}

export const capitalizeFirstLetter = (text: string): string => {
  if (typeof text !== 'string' || text.trim() === '') {
    console.warn('Input is not a valid string');
    return '';
  }

  return text
    .split('_') // Split by underscore
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
    .join('-'); // Join with hyphen
};

// Example Usage
console.log(capitalizeFirstLetter('co_host')); // Output: "Co-Host"
console.log(capitalizeFirstLetter('host')); // Output: "Host"
console.log(capitalizeFirstLetter('admin_user')); // Output: "Admin-User"

export const objectToQueryString = (
  obj: Record<string, string | number | boolean>,
): string => {
  const str: string[] = [];
  for (const p in obj) {
    if (obj.hasOwnProperty(p)) {
      str.push(
        `${encodeURIComponent(p)}=${encodeURIComponent(String(obj[p]))}`,
      );
    }
  }
  return str.length > 0 ? `?${str.join('&')}` : '';
};

export const objectToQueryStringFilter = (
  params: Record<string, string | number | boolean | string[]>,
): string => {
  const queryString = Object.entries(params)
    .filter(
      ([_, value]) => value !== undefined && value !== null && value !== '',
    ) // Filter out empty values
    .map(([key, value]) =>
      Array.isArray(value)
        ? `${key}=${value.join(',')}` // Handle array values
        : `${key}=${encodeURIComponent(value)}`,
    )
    .join('&');

  return queryString ? `?${queryString}` : '';
};

// AsyncStorage utility functions with type safety
export const storeData = async (key: string, data: any): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error storing data:', error);
  }
};

export const retrieveData = async (key: string): Promise<void | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);

    // If jsonValue is null or undefined, return null, else parse it and return the parsed value
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null; // Return null in case of error
  }
};

export const removeData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing data with key '${key}':`, error);
  }
};

export const setItem = async (key: string, value: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
    printLog('AsyncStorage set =======Success>>>>>', value);
  } catch (error) {
    printLog('AsyncStorage set (ERROR)=======>>>>>', error);
  }
};

// export const getApiBaseUrl = () => {
//   return settings.apiUrl.replace(/[^\x20-\x7E]/g, '');
// };

export const getItem = async (key: string): Promise<string | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== undefined && value !== null) {
      return value;
    } else {
      printLog(
        'Error while getting data from AsyncStorage, please check if the key is correct.',
      );
      return null;
    }
  } catch (error) {
    printLog('AsyncStorage get (ERROR)=======>>>>>', error);
    return null;
  }
};

export const removeItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
    printLog('AsyncStorage remove success=======>>>>>', key);
  } catch (error) {
    printLog('AsyncStorage remove (ERROR)=======>>>>>', error);
  }
};

export const clearAllAsyncData = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    console.error('Error clearing AsyncStorage:', e);
  }
  printLog('Done.');
};

// Example TagKey object (replace with actual keys)
export const TagKey = {
  IsBearerToken: 'IsBearerToken',
  OwnUserData: 'OwnUserData',
  IsFirstLocationFetch: 'IsFirstLocationFetch',
  exploreReq: 'exploreReq',
  PROFILE_TYPE: 'ProfileType',
  LOGIN_TYPE: 'LoginType',
  EMAIL: 'Email',
  STEP_ONE: 'Step 1',
  STEP_TWO: 'Step 2',
  STEP_3: 'Step 3',
  SCHOOL_SELECTION: 'SchoolSelection',
  BASIC_PROFILE_DATA: 'BasicProfileData',
  REGION_TEXT: 'Region',
  ACCESS_TOKEN: 'AccessToken',
  SCHOOL_ID: 'SchoolId',
};

export const clearAllForLogout = async (): Promise<void> => {
  try {
    await removeItem(TagKey.PROFILE_TYPE);
    await removeItem(TagKey.LOGIN_TYPE);
    await removeItem(TagKey.EMAIL);
    await removeItem(TagKey.STEP_ONE);
    await removeItem(TagKey.STEP_TWO);
    await removeItem(TagKey.STEP_3);
    await removeItem(TagKey.SCHOOL_SELECTION);
    await removeItem(TagKey.BASIC_PROFILE_DATA);
    await removeItem(TagKey.REGION_TEXT);
    await removeItem(TagKey.ACCESS_TOKEN);
    await removeItem(TagKey.SCHOOL_ID);

    await clearAllAsyncData();
  } catch (error) {
    console.error('Error clearing data for logout:', error);
  }
};

export const ForceLogout = async (): Promise<void> => {
  await clearAllForLogout();
  // Uncomment and replace with navigation reset logic if required:
  // const resetAction = CommonActions.reset({
  //   index: 0,
  //   routes: [{ name: 'AuthStack' }],
  // });
  // navigation.dispatch(resetAction);
};

export const ageCaluclation = (
  selectedDay: string,
  selectedMonth: string,
  selectedYear: string,
  months: string[],
): number => {
  const monthIndex = months.indexOf(selectedMonth);
  if (monthIndex === -1) {
    throw new Error('Invalid month name');
  }
  const dob = new Date(
    parseInt(selectedYear),
    monthIndex,
    parseInt(selectedDay),
  );
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  const dayDiff = today.getDate() - dob.getDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }
  return age;
};

export const platform = Platform.OS;

export const totalAllowedGb = 3;

export const isIos = (): boolean => platform === 'ios';

export const isAndroid = (): boolean => platform === 'android';

export const convertDateFormat = (dateString: string): string => {
  console.log('dateString', dateString);
  const [month, day, year] = dateString.split('/');
  return `${year}-${month}-${day}`;
};
export const convertDateToFormatMMDDYYYY = (dateString: string) => {
  try {
    const [year, month, day] = dateString && dateString.split('-');
    return dateString && `${month}-${day}-${year}`;
  } catch (error) {
    console.log(error);
  }
};
export const removeSignature = (url: string) => {
  return url ? url.split('?')[0] : url;
};
export const formatDate = (date: Date) => {
  return date
    .toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }) // Format to MM/DD/YYYY
    .replace(/\//g, '/');
};

export const parseAndFormatDate = (dateString: string) => {
  const formats = ['MM-DD-YYYY', 'MM/DD/YYYY', 'DD-MM-YYYY', 'DD/MM/YYYY'];
  const parsedDate = moment(dateString, formats, true);

  if (parsedDate.isValid()) {
    return parsedDate.format('YYYY-MM-DD');
  }

  // If invalid, return 18 years back from today
  return moment().subtract(18, 'years').format('YYYY-MM-DD');
};
export const numberSpacing = (number: any, callingCode: any) => {
  const cleanedText = number.replace(/[^\d+]/g, '');
  const fullNumber = `${callingCode}${cleanedText}`;
  let parsedNumber = parsePhoneNumberFromString(fullNumber);
  if (parsedNumber && parsedNumber.isValid()) {
    return parsedNumber.formatInternational().replace(`${callingCode} `, ''); // Remove country code from input
  } else {
    return cleanedText; // Keep raw input if invalid
  }
};

export const changeSafeAreaViewConfig = (config: SafeAreaViewConfig) => {
  store.store.dispatch(configStatusBar(config));
  if (Platform.OS == 'android') {
    StatusBar.setHidden(false);
    StatusBar.setBackgroundColor(config.topSafeAreaViewColor, true);
    // changeNavigationBarColor(config.bottomSafeAreaViewColor);
    if (config.showBottomSafeAreaView) {
      // showNavigationBar();
    } else {
      // hideNavigationBar();
    }

    StatusBar.setTranslucent(config.translucent || false);
  }
  StatusBar.setBarStyle(config.statusBarStyle, true);
};
export const validateAge = (selectedDate: string) => {
  const [month, day, year] = selectedDate.split('/').map(Number);
  const selectedDateObj = new Date(year, month - 1, day);
  const today = new Date();
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(today.getFullYear() - 18);

  return selectedDateObj > eighteenYearsAgo;
};

export const extractCountryCode = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber);

  if (!phone) return null;

  const countryCode: any = phone.country;
  const flag = getCountryFlag(countryCode);

  return {
    country: countryCode,
    countryCallingCode: phone.countryCallingCode,
    flag: flag,
  };
};

export const getCountryFlag = (countryCode: string) => {
  return countryCode
    ? countryCode
      .toUpperCase()
      .split('')
      .map(char => String.fromCodePoint(127397 + char.charCodeAt(0)))
      .join('')
    : '';
};
export interface ApiErrorInterface {
  data: { message: string; statusCode: number; success: boolean } | string;
}
export const getErrorMessage = (error: ApiErrorInterface) => {
  let message = 'Something went wrong!';
  if (typeof error.data === 'string') {
    message = error.data;
  } else if (typeof error?.data === 'object' && error?.data?.message) {
    message = error.data.message;
  }
  return message;
};

export const getRoleRole = (role: string) => {
  switch (role.toLowerCase()) {
    case 'member':
      return 'Member';
    case 'non_member':
      return 'Non-Member';
    case 'host':
      return 'Host';
    default:
      return 'Non-Member';
  }
};

export const getPriorityRole = (roles: role[]) => {
  let priorityRole = roles[0];
  const hostRole = roles.find(role => role.roleName === 'host');
  if (roles.length > 1 && hostRole) {
    priorityRole = hostRole;
  }
  return priorityRole;
};

export const loginUser = ({
  id,
  roles,
  token,
  isGuest,
  varifyStatus,
  companyLogo,
  profilePicture,
}: {
  token: string;
  id: string;
  isGuest: boolean;
  varifyStatus: 0 | 1;
  roles: role[];
  profilePicture: string | undefined;
  companyLogo: string | undefined;
}) => {
  console.log({ id, roles, token, isGuest, varifyStatus });
  const dispatch = store.store.dispatch;
  let priorityRole = getPriorityRole(roles);
  dispatch(
    setLoginData({
      userId: id,
      role: priorityRole.roleName,
      roleId: priorityRole.roleId,
      roles,
      token,
      isGuest,
      varifyStatus,
      companyLogo,
      profilePicture,
    }),
  );
};

export const fetchUserProfile = async () => {
  const dispatch = store.store.dispatch;
  const authState = store.store.getState().auth;
  const currentRole = authState.role;
  const userId = authState.userId;
  const token = authState.token;

  let apiUrl = '';
  let apiMethod: 'get' | 'post' | 'put' | 'delete' = 'get';
  let apiPayload = {};

  if (currentRole) {
    if (currentRole === ROLE.HOST) {
      // apiUrl = `${EndPoint.host}/${userId}/profile`;
      apiUrl = `${EndPoint.host_ep}`;
      apiMethod = 'get';
      apiPayload = {};
    } else {
      if (!token && currentRole === ROLE.NON_MEMBER) {
        apiUrl = EndPoint.get_user_with_role_by_id;
        apiMethod = 'post';
        apiPayload = { id: userId };
      } else {
        apiUrl = `${EndPoint.user}/${userId}`;
        apiMethod = 'get';
        apiPayload = {};
      }
    }
  }

  try {
    const response = await axiosController[apiMethod](apiUrl, apiPayload, {});
    if (response.success) {
      dispatch(
        setProfileData({
          ...response.data,
          profilePicture: response?.data?.imageUrl,
        }),
      );
      response?.data?.email && dispatch(setEmail(response?.data?.email));
      response?.data?.phoneNumber && dispatch(setPhone(response?.data?.phoneNumber));
      if (response?.data?.email && response?.data?.phoneNumber) {
        dispatch(setIsEmailPhoneBothVerified(true));
      }
      response?.data?.firstName && dispatch(setFirstName(response?.data?.firstName));
      response?.data?.lastName && dispatch(setLastName(response?.data?.lastName));
    }
  } catch (err) {
    const typedError = err as ApiErrorInterface;
    FlashMessageComponent.show('error', getErrorMessage(typedError));
  } finally {
  }
};

export const performLogout = async () => {
  const dispatch = store.store.dispatch;
  dispatch(resetAppStack(true));
};


export const removeCityFromLocation = (locationText: string, city: string) => {
  if (locationText.includes(city)) {
    const addressWithoutCity = locationText
      .replace(city, '')
      .trim()
      .replace(/,\s*$/, '');
    return { address: addressWithoutCity, city };
  }
  return { address: locationText, city };
};

export const extractCityFromLocation = (locationText: string, city: string) => {
  const cityIndex = locationText?.indexOf(city);

  if (cityIndex !== -1) {
    const address = locationText
      .substring(0, cityIndex)
      .trim()
      .replace(/,\s*$/, '');
    const cityDetails = locationText.substring(cityIndex).trim();
    return { address, city: cityDetails };
  }

  return { address: locationText, city: '' };
};

export const isCityInLocation = (locationText: string, city: string) => {
  return locationText.includes(city);
};

export const getDisplayLocation = (
  location: string = '',
  guestStatus: String = '',
  showLocation: boolean = false,
  role: string,
) => {
  if (role === ROLE.HOST) {
    return location;
  }

  if (guestStatus === 'CONFIRMED') {
    if (showLocation) {
      return location;
    } else {
      return 'Exact Location to Be Announced';
    }
  } else if (guestStatus === 'APPLIED') {
    return 'Location Shared Upon Confirmation';
  } else {
    return 'RSVP to See Location';
  }
};

export const switchProfile = () => {
  // api call
  // loginUser();
  // fetchUserProfile;
};

export const removeSpaceFromStr = (text: string) => {
  if (text) {
    return text.split(' ').join('');
  }
  return '';
};
