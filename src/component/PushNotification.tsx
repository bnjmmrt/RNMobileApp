import { getApp, getApps, initializeApp } from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import { setFcmToken } from 'src/redux/slices/authSlice';
import { navigate, navigateToNestedStack } from './NavigationService';
import { ROUTES } from 'src/navigation/Route';

// Request Notification Permission
export async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        getFCMToken()
    }
}

// Get FCM Token
export async function getFCMToken() {
    const dispatch = useDispatch();
    try {
        const token = await messaging().getToken();
        console.log(" siya FCM Token:", token);
        dispatch(setFcmToken(token))
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
    // Handle when app is in background and user taps notification
    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log('Notification caused app to open from background:', remoteMessage);
        if (remoteMessage?.data?.screen) {
            navigateToScreen(remoteMessage.data.screen);
        }
    });

    // Handle when app was killed and user taps notification
    messaging().getInitialNotification().then(remoteMessage => {
        if (remoteMessage) {
            console.log('Notification caused app to open from quit state:', remoteMessage);
            if (remoteMessage?.data?.screen) {
                navigateToScreen(remoteMessage?.data);
            }
        }
    });

    messaging().onMessage(async remoteMessage => { });
};


export const navigateToScreen = (data: any) => {
    // Use navigationRef to navigate if navigation is not yet mounted
    setTimeout(() => {
        // if (data?.type === 'eventReminder' || 'eventInvitation' || 'eventPosted' || 'eventPostedCity' || 'eventRequestApproved' || 'eventRequestDenied' || 'signUpFormApproved' || 'eventSubmissionApproved' || 'eventAnnouncement') {
        //     let eventData = {
        //         id: data?.eventId
        //     }
        //     navigateToNestedStack(ROUTES.EventStack, ROUTES.EventDetailsScreen, eventData);
        // }
        if (data?.type === 'eventVouch') {
            let eventData = {
                id: data?.eventId
            }
            navigateToNestedStack(ROUTES.EventStack, 'Profile - Referrals page ', eventData);
        }
        else {
            let eventData = {
                id: data?.eventId
            }
            navigateToNestedStack(ROUTES.EventStack, ROUTES.EventDetailsScreen, eventData);
        }
    }, 1000);
};
