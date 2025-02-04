import { useState, useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Contacts from 'react-native-contacts';

type PermissionStatus = boolean | null;
type ContactItem = {
    name: string;
    phoneNumber: string;
};

const useContacts = () => {
    const [permissionGranted, setPermissionGranted] = useState<PermissionStatus>(null);

    const getContacts = async (): Promise<ContactItem[]> => {
        try {
            const deviceContacts = await Contacts.getAll();
            const formattedContacts = deviceContacts
                .map((contact) => ({
                    name: `${contact.givenName} ${contact.familyName}`.trim(),
                    phoneNumber: contact.phoneNumbers[0]?.number.replace(/\D/g, '') || '',
                }))
                .filter((contact) => contact.phoneNumber);

            return formattedContacts;
        } catch (error) {
            console.error('Error fetching contacts:', error);
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
                }
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

    useEffect(() => {
        requestContactPermission();
    }, []);

    return { permissionGranted, requestContactPermission, getContacts };
};

export default useContacts;
