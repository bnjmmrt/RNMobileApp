import {
  getCountryCallingCode,
  parsePhoneNumberFromString,
} from 'libphonenumber-js';
import { useEffect, useState } from 'react';
import {
  Alert,
  InteractionManager,
  Linking,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Contacts from 'react-native-contacts';
import { getCountry } from 'react-native-localize';
import { getCountryFlag } from '../functions';
import { openSettings } from 'react-native-permissions';
import { useNavigation } from '@react-navigation/native';

type PermissionStatus = boolean | null;
export type ContactItem = {
  name: string;
  phoneNumber: string;
  firstName?: string;
  lastName?: string;
};

const useContacts = (autoRequestForPermision?: boolean, timout?: number) => {
  const navigation = useNavigation();
  const [permissionGranted, setPermissionGranted] =
    useState<PermissionStatus>(null);
  const [permissionLoading, setPermissionLoading] = useState<boolean>(
    autoRequestForPermision ? true : false,
  );
  const currentCountry = getCountry();

  const showAllowPermissionFromSettingAlert = () => {
    Alert.alert(
      'Contact Permission Required',
      'Please allow contact permission from app settings.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Open Settings',
          onPress: async () => {
            Linking.openSettings();
            navigation.goBack();
          },
        },
      ],
    );
  };

  const getPhoneNumber = (phoneNumber: string) => {
    const phone = parsePhoneNumberFromString(phoneNumber);
    return phone
      ? {
          countryCode: phone.countryCallingCode,
          flag: getCountryFlag(phone.country),
          phoneNumber: phone.nationalNumber.replace(/\D/g, ''),
          currentCountry: phone.country,
        }
      : {
          currentCountry,
          flag: getCountryFlag(currentCountry),
          countryCode: getCountryCallingCode(`${currentCountry}`),
          phoneNumber: phoneNumber.replace(/\D/g, ''),
        };
  };

  const getContacts = async (): Promise<ContactItem[]> => {
    if (!permissionGranted) {
      return [];
    }
    try {
      const deviceContacts = await Contacts.getAll();

      const formattedContacts = deviceContacts
        .map(contact => ({
          name: `${contact.givenName} ${contact.familyName}`.trim(),
          phoneNumber: contact.phoneNumbers[0]?.number || '',
          firstName: contact.givenName,
          lastName: contact.familyName,
        }))
        .filter(contact => contact.phoneNumber);

      return formattedContacts;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return [];
    }
  };

  const getContactNumbersOnly = async (): Promise<string[]> => {
    if (!permissionGranted) {
      return [];
    }
    try {
      const deviceContacts = await Contacts.getAll();
      const contactNumbers = deviceContacts
        .map(contact => {
          const number = contact.phoneNumbers[0]?.number.replace(/\D/g, '');
          return number ? `+${number}` : '';
        })
        .filter(number => number);
      return contactNumbers;
    } catch (error) {
      console.error('Error fetching contact numbers:', error);
      return [];
    }
  };

  const requestAndroidPermission = async (): Promise<void> => {
    setPermissionLoading(true);
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contacts',
          message: 'This app would like to view your contacts.',
          buttonPositive: 'Accept',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Contact permission granted on Android');
        setPermissionGranted(true);
        await getContacts();
      } else {
        showAllowPermissionFromSettingAlert();
        console.log('Contact permission denied on Android');
        setPermissionGranted(false);
      }
    } catch (error) {
      showAllowPermissionFromSettingAlert();
      console.error('Android permission error: ', error);
      setPermissionGranted(false);
    } finally {
      setPermissionLoading(false);
    }
  };

  const requestIOSPermission = async (): Promise<void> => {
    setPermissionLoading(true);
    try {
      const permission = await Contacts.requestPermission();
      if (permission === 'authorized') {
        console.log('Contact permission granted on iOS');
        setPermissionGranted(true);
        await getContacts();
      } else {
        showAllowPermissionFromSettingAlert();
        console.log('Contact permission denied on iOS');
        setPermissionGranted(false);
      }
    } catch (error) {
      showAllowPermissionFromSettingAlert();
      console.error('iOS permission error: ', error);
      setPermissionGranted(false);
    } finally {
      setPermissionLoading(false);
    }
  };

  const requestContactPermission = async (): Promise<void> => {
    if (Platform.OS === 'android') {
      await requestAndroidPermission();
    } else if (Platform.OS === 'ios') {
      await requestIOSPermission();
    }
  };

  useEffect(() => {
    if (autoRequestForPermision) {
      InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          requestContactPermission();
        }, timout || 200);
      });
    }
  }, [autoRequestForPermision]);

  return {
    permissionGranted,
    requestContactPermission,
    getContacts,
    getContactNumbersOnly,
    getPhoneNumber,
    permissionLoading,
  };
};

export default useContacts;
