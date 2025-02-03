import { useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Contacts from 'react-native-contacts';

type PermissionStatus = boolean | null;

const useContactPermission = () => {
    const [permissionGranted, setPermissionGranted] = useState<PermissionStatus>(null);

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

    return { permissionGranted, requestContactPermission };
};

export default useContactPermission;