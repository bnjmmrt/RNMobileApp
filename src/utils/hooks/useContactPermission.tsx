import { useState, useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Contacts from 'react-native-contacts';
import { getCountryCallingCode, parsePhoneNumberFromString } from 'libphonenumber-js';
import { getCountry } from "react-native-localize";
import { getCountryFlag } from '../functions';



type PermissionStatus = boolean | null;
export type ContactItem = {
  name: string;
  phoneNumber: string;
  firstName?: string;
  lastName?: string;
};

const useContacts = () => {
  const [permissionGranted, setPermissionGranted] =
    useState<PermissionStatus>(null);
  const currentCountry = getCountry();


  const getPhoneNumber = (phoneNumber) => {
    const phone = parsePhoneNumberFromString(phoneNumber);
    return phone ? { countryCode: phone.countryCallingCode, flag: getCountryFlag(phone.country), phoneNumber: phone.nationalNumber.replace(/\D/g, ''), currentCountry: phone.country } : { currentCountry, flag: getCountryFlag(currentCountry), countryCode: getCountryCallingCode(`${currentCountry}`), phoneNumber: phoneNumber.replace(/\D/g, '') };
  };

  const getContacts = async (): Promise<ContactItem[]> => {
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
        console.log('Contact permission denied on Android');
        setPermissionGranted(false);
      }
    } catch (error) {
      console.error('Android permission error: ', error);
      setPermissionGranted(false);
    }
  };

  const requestIOSPermission = async (): Promise<void> => {
    try {
      const permission = await Contacts.requestPermission();
      if (permission === 'authorized') {
        console.log('Contact permission granted on iOS');
        setPermissionGranted(true);
        await getContacts();
      } else {
        console.log('Contact permission denied on iOS');
        setPermissionGranted(false);
      }
    } catch (error) {
      console.error('iOS permission error: ', error);
      setPermissionGranted(false);
    }
  };

  const requestContactPermission = async (): Promise<void> => {
    if (Platform.OS === 'android') {
      await requestAndroidPermission();
    } else if (Platform.OS === 'ios') {
      await requestIOSPermission();
    }
  };

  return {
    permissionGranted,
    requestContactPermission,
    getContacts,
    getContactNumbersOnly,
    getPhoneNumber
  };
};

export default useContacts;
