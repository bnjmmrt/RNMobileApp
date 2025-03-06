import { getApp, getApps, initializeApp } from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';

// Request Notification Permission
export async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        getFCMToken()
    } else {
        Alert.alert("Push Notification Permission", "Please enable notifications in settings.");
    }
}

// Get FCM Token
export async function getFCMToken() {
    try {
        const token = await messaging().getToken({
            senderId:'911470503708'
        });
        console.log(" siya FCM Token:", token);
        return token;
    } catch (error) {
        console.log(" siya Error getting FCM token:", error);
    }
}
export const NotificationsListener = async () => {
    // Handle Background Notifications
    messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log("Message handled in the background!", remoteMessage);
    });
}

